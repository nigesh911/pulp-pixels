import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { orderId, paymentId, signature, wallpaperId } = await request.json();
    const supabase = createRouteHandlerClient({ cookies });

    // Verify signature
    const body = orderId + "|" + paymentId;
    const expectedSignature = createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== signature) {
      throw new Error('Invalid payment signature');
    }

    // Record payment in database
    const { error: dbError } = await supabase
      .from('payments')
      .insert([
        {
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          wallpaper_id: wallpaperId,
          status: 'completed',
          payment_method: 'razorpay'
        }
      ]);

    if (dbError) {
      throw new Error('Failed to record payment');
    }

    return NextResponse.json({ 
      success: true,
      message: 'Payment verified successfully'
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
} 