import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpaHpoaHlsanRmdG12c3BucWVnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzU2NjY0MywiZXhwIjoyMDQ5MTQyNjQzfQ.7ft5rD4HdSJIBDQFAFpBOSgJa9rOkMHLT452e7pAIyU',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);

// Create a transporter using SMTP configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const MAX_SUBMISSIONS_PER_DAY = 2;

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();
    console.log('Received contact form submission for:', email);

    // Validate the input
    if (!name || !email || !message) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    try {
      // Get today's start timestamp in UTC
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      console.log('Checking submissions since:', today.toISOString());

      // Check submissions for today
      const { data: todaySubmissions, error: countError } = await supabase
        .from('contact_submissions')
        .select('id, last_submission')
        .eq('email', email)
        .gte('last_submission', today.toISOString());

      if (countError) {
        console.error('Database query error:', countError);
        throw new Error(`Failed to check submission count: ${countError.message}`);
      }

      console.log('Found submissions:', todaySubmissions?.length || 0);

      // Check if max submissions reached
      if (todaySubmissions && todaySubmissions.length >= MAX_SUBMISSIONS_PER_DAY) {
        console.log('Rate limit reached for:', email);
        return NextResponse.json(
          { error: 'You have reached the maximum number of submissions for today. Please try again tomorrow.' },
          { status: 429 }
        );
      }

      // Create new submission record
      console.log('Creating new submission record');
      const { error: insertError } = await supabase
        .from('contact_submissions')
        .insert({
          email,
          last_submission: new Date().toISOString()
        });

      if (insertError) {
        console.error('Database insert error:', insertError);
        throw new Error(`Failed to record submission: ${insertError.message}`);
      }

      // Create the email content
      console.log('Preparing to send email');
      const mailOptions = {
        from: process.env.SMTP_FROM,
        to: process.env.SMTP_USER,
        subject: `New Contact Form Message from ${name}`,
        text: `
          Name: ${name}
          Email: ${email}
          Message: ${message}
        `,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      };

      // Send the email
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');

      return NextResponse.json(
        { message: 'Message sent successfully' },
        { status: 200 }
      );
    } catch (dbError) {
      console.error('Detailed error:', dbError);
      throw new Error(dbError instanceof Error ? dbError.message : 'Failed to process request');
    }
  } catch (error) {
    console.error('Top level error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send message' },
      { status: 500 }
    );
  }
} 