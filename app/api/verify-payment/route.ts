import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Razorpay from 'razorpay';
import nodemailer from 'nodemailer';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Initialize nodemailer with Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

export async function POST(request: Request) {
  try {
    const { orderId, paymentId, signature, wallpaperId, email } = await request.json();

    console.log('Starting payment verification:', { orderId, paymentId, wallpaperId, email });

    // Verify all required fields
    if (!orderId || !paymentId || !signature || !wallpaperId || !email) {
      console.error('Missing required fields:', { orderId, paymentId, signature, wallpaperId, email });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify email configuration
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error('Email configuration missing');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Verify signature
    const body = orderId + "|" + paymentId;
    const expectedSignature = createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('Invalid payment signature');
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Verify payment with Razorpay
    const payment = await razorpay.payments.fetch(paymentId);
    console.log('Payment details:', payment);

    if (payment.status !== 'captured') {
      return NextResponse.json(
        { error: 'Payment not captured', details: `Payment status: ${payment.status}` },
        { status: 400 }
      );
    }

    // Record payment in database
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id || 'anonymous';

    const { error: dbError } = await supabase
      .from('payments')
      .insert([
        {
          transaction_id: paymentId,
          wallpaper_id: wallpaperId,
          user_id: 'anonymous',
          amount: Number(payment.amount) / 100,
          status: 'completed',
          payment_method: 'razorpay'
        }
      ]);

    if (dbError) {
      console.error('Database error:', dbError);
      console.error('Full error details:', {
        code: dbError.code,
        message: dbError.message,
        details: dbError.details,
        hint: dbError.hint
      });
      return NextResponse.json(
        { error: 'Failed to record payment', details: dbError.message },
        { status: 500 }
      );
    }

    // Get wallpaper details
    const { data: wallpaper, error: wallpaperError } = await supabase
      .from('wallpapers')
      .select('*')
      .eq('id', wallpaperId)
      .single();

    if (wallpaperError || !wallpaper) {
      console.error('Error fetching wallpaper:', wallpaperError);
      return NextResponse.json(
        { error: 'Failed to fetch wallpaper details' },
        { status: 500 }
      );
    }

    // Generate download URL
    const { data: urlData, error: urlError } = await supabase.storage
      .from('wallpapers')
      .createSignedUrl(wallpaper.image_path, 3600);

    if (urlError || !urlData?.signedUrl) {
      console.error('Error generating signed URL:', urlError);
      return NextResponse.json(
        { error: 'Failed to generate download link' },
        { status: 500 }
      );
    }

    // Send email with download link
    try {
      // First verify SMTP connection
      await transporter.verify();
      console.log('SMTP connection verified');

      const info = await transporter.sendMail({
        from: {
          name: 'Pulp Pixels',
          address: process.env.GMAIL_USER!
        },
        to: email,
        subject: `Download Link for ${wallpaper.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4169E1;">Your Wallpaper Download Link</h2>
            <p>Thank you for your purchase! Here's your download link for "${wallpaper.title}":</p>
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
              If you have any issues, please contact our support.
            </p>
          </div>
        `
      });

      console.log('Email sent successfully:', info.messageId);

      return NextResponse.json({ 
        success: true,
        message: 'Payment verified and download link sent'
      });

    } catch (emailError) {
      console.error('Email error details:', emailError);
      return NextResponse.json(
        { 
          error: 'Failed to send download link email',
          details: emailError instanceof Error ? emailError.message : 'Unknown email error'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { 
        error: 'Payment verification failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 