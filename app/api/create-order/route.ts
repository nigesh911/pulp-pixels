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
    
    // Log configuration status
    console.log('Razorpay Configuration:', {
      keyIdExists: !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      keyIdPrefix: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.substring(0, 8),
      secretExists: !!process.env.RAZORPAY_KEY_SECRET,
      secretLength: process.env.RAZORPAY_KEY_SECRET?.length
    });
    
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

    try {
      // Create Razorpay order
      const order = await razorpay.orders.create(orderOptions);
      console.log('Order created successfully:', order);

      const response = { 
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
      };

      return NextResponse.json(response);
    } catch (razorpayError: any) {
      console.error('Razorpay API Error Details:', {
        error: razorpayError,
        message: razorpayError.message,
        description: razorpayError.error?.description,
        code: razorpayError.error?.code,
        field: razorpayError.error?.field,
        step: razorpayError.error?.step,
        httpStatus: razorpayError.statusCode
      });
      
      return NextResponse.json(
        { 
          error: 'Razorpay API Error',
          details: razorpayError.error?.description || razorpayError.message,
          code: razorpayError.error?.code,
          httpStatus: razorpayError.statusCode
        },
        { status: razorpayError.statusCode || 400 }
      );
    }
  } catch (error: any) {
    console.error('Order creation failed:', {
      error,
      message: error.message,
      stack: error.stack,
      details: error.details,
      razorpayError: error.error
    });
    
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