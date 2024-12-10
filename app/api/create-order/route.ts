import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  try {
    const { amount, wallpaperId } = await request.json();
    
    console.log('Creating Razorpay order:', { amount, wallpaperId });
    
    if (!amount || amount <= 0) {
      throw new Error('Invalid amount');
    }

    // Create order options
    const orderOptions = {
      amount: amount,
      currency: 'INR',
      notes: {
        wallpaperId: wallpaperId
      },
      receipt: `receipt_${Date.now()}`
    };
    
    console.log('Order options:', orderOptions);

    // Create Razorpay order
    const order = await razorpay.orders.create(orderOptions);
    console.log('Order created:', order);

    return NextResponse.json({ 
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error: any) {
    console.error('Order creation error:', {
      message: error.message,
      stack: error.stack,
      details: error.details
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to create order',
        details: error.message,
        code: error.code
      },
      { status: 500 }
    );
  }
} 