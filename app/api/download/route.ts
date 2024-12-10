import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const { wallpaperId, email } = await request.json();
    const supabase = createRouteHandlerClient({ cookies });

    // Get wallpaper details
    const { data: wallpaper } = await supabase
      .from('wallpapers')
      .select('*')
      .eq('id', wallpaperId)
      .single();

    if (!wallpaper) {
      return NextResponse.json(
        { error: 'Wallpaper not found' },
        { status: 404 }
      );
    }

    // Generate a signed URL that expires in 1 hour
    const { data: urlData } = await supabase.storage
      .from('wallpapers')
      .createSignedUrl(wallpaper.image_path, 3600);

    if (!urlData?.signedUrl) {
      return NextResponse.json(
        { error: 'Failed to generate download link' },
        { status: 500 }
      );
    }

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

    // Send email
    const mailOptions = {
      from: process.env.GMAIL_USER,
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

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing download:', error);
    return NextResponse.json(
      { error: 'Failed to process download request' },
      { status: 500 }
    );
  }
} 