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

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount,
      currency: 'INR',
      notes: {
        wallpaperId: wallpaperId
      }
    });

    return NextResponse.json({ 
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
} 