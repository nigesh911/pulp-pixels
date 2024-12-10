import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { transactionId, wallpaperId, amount } = await request.json();
    const supabase = createRouteHandlerClient({ cookies });

    // Store payment attempt
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert([
        {
          transaction_id: transactionId,
          wallpaper_id: wallpaperId,
          amount: amount,
          status: 'pending',
          payment_method: 'UPI'
        }
      ])
      .select()
      .single();

    if (paymentError) {
      throw new Error('Failed to record payment');
    }

    // In a production environment, you would:
    // 1. Call UPI PSP's API to verify transaction status
    // 2. Update payment status based on response
    // 3. Send webhooks/notifications

    // For demo, we'll simulate verification
    const isSuccess = true; // In production, this would be actual verification

    if (isSuccess) {
      // Update payment status
      await supabase
        .from('payments')
        .update({ status: 'completed' })
        .eq('id', payment.id);

      return NextResponse.json({ 
        success: true,
        verified: true,
        message: 'Payment verified successfully'
      });
    }

    return NextResponse.json({ 
      success: true,
      verified: false,
      message: 'Payment verification failed'
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
} 