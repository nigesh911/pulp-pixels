import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Initialize Razorpay with live keys
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function GET() {
  if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
    return NextResponse.json(
      { error: 'Payment service not configured' },
      { status: 500 }
    );
  }

  return NextResponse.json({ 
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID 
  });
}

export async function POST(request: Request) {
  try {
    const { amount, wallpaperId } = await request.json();
    
    console.log('Received request:', { amount, wallpaperId });
    console.log('Using Razorpay key:', process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
    
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('Missing Razorpay credentials');
      return NextResponse.json(
        { error: 'Payment service not configured' },
        { status: 500 }
      );
    }
    
    if (!amount || amount <= 0) {
      console.error('Invalid amount:', amount);
      return NextResponse.json(
        { error: 'Invalid amount', details: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Convert amount to paise (1 rupee = 100 paise)
    const amountInPaise = Math.round(amount * 100);

    // Create order options
    const orderOptions = {
      amount: amountInPaise,
      currency: 'INR',
      notes: {
        wallpaperId: wallpaperId
      },
      receipt: `receipt_${Date.now()}`
    };
    
    console.log('Creating order with options:', orderOptions);

    // Create Razorpay order
    const order = await razorpay.orders.create(orderOptions);
    console.log('Order created successfully:', order);
    console.log('Sending response with key:', process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ? 'Key exists' : 'No key');

    const response = { 
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    };

    console.log('Full response:', {
      ...response,
      key: response.key ? 'Key exists' : 'No key'
    });

    return NextResponse.json(response);
  } catch (error: any) {
    // Log the complete error
    console.error('Order creation failed:', {
      message: error.message,
      stack: error.stack,
      details: error.details,
      razorpayError: error.error
    });
    
    // Check if it's a Razorpay API error
    if (error.error && error.error.description) {
      return NextResponse.json(
        { 
          error: 'Razorpay API Error',
          details: error.error.description,
          code: error.error.code
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create order',
        details: error.message || 'Unknown error',
        code: error.code
      },
      { status: 500 }
    );
  }
} 