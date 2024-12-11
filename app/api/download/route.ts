import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Create a transporter using SMTP settings
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false // Helps with self-signed certificates
  }
});

export async function POST(request: Request) {
  try {
    const { wallpaperId, email } = await request.json();

    if (!wallpaperId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('Processing download request for:', { wallpaperId, email });

    // Verify email configuration
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error('Missing email configuration');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    // Verify SMTP connection
    try {
      await transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (smtpError) {
      console.error('SMTP verification failed:', smtpError);
      return NextResponse.json(
        { error: 'Email service unavailable', details: smtpError instanceof Error ? smtpError.message : 'Unknown error' },
        { status: 500 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Get wallpaper details
    const { data: wallpaper, error: wallpaperError } = await supabase
      .from('wallpapers')
      .select('*')
      .eq('id', wallpaperId)
      .single();

    if (wallpaperError) {
      console.error('Error fetching wallpaper:', wallpaperError);
      return NextResponse.json(
        { error: 'Failed to fetch wallpaper details' },
        { status: 500 }
      );
    }

    if (!wallpaper) {
      return NextResponse.json(
        { error: 'Wallpaper not found' },
        { status: 404 }
      );
    }

    console.log('Wallpaper found:', wallpaper.title);

    // Generate a signed URL that expires in 1 hour
    const { data: urlData, error: urlError } = await supabase.storage
      .from('wallpapers')
      .createSignedUrl(wallpaper.image_path, 3600);

    if (urlError) {
      console.error('Error generating signed URL:', urlError);
      return NextResponse.json(
        { error: 'Failed to generate download link' },
        { status: 500 }
      );
    }

    if (!urlData?.signedUrl) {
      return NextResponse.json(
        { error: 'Failed to generate download link' },
        { status: 500 }
      );
    }

    console.log('Generated signed URL successfully');

    // Store the download request
    const { error: dbError } = await supabase
      .from('download_requests')
      .insert([
        {
          wallpaper_id: wallpaper.id,
          email: email,
          download_url: urlData.signedUrl,
          expires_at: new Date(Date.now() + 3600 * 1000).toISOString()
        }
      ]);

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to record download request' },
        { status: 500 }
      );
    }

    console.log('Download request recorded in database');

    // Send email
    const mailOptions = {
      from: {
        name: 'Pulp Pixels',
        address: process.env.GMAIL_USER as string
      },
      to: email,
      subject: `Download Link for ${wallpaper.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4169E1;">Your Wallpaper Download Link</h2>
          <p>Thank you for downloading from our wallpaper collection!</p>
          <p>Here's your secure download link for "${wallpaper.title}":</p>
          <div style="margin: 20px 0;">
            <a href="${urlData.signedUrl}" 
               style="background-color: #4169E1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Download Wallpaper
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            Note: This link will expire in 1 hour for security reasons.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            If you didn't request this download, please ignore this email.
          </p>
        </div>
      `
    };

    try {
      console.log('Attempting to send email to:', email);
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info);
      return NextResponse.json({ 
        success: true,
        messageId: info.messageId 
      });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      return NextResponse.json(
        { 
          error: 'Failed to send email', 
          details: emailError instanceof Error ? emailError.message : 'Unknown error',
          config: {
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            user: process.env.GMAIL_USER
          }
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing download:', error);
    return NextResponse.json(
      { error: 'Failed to process download request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 