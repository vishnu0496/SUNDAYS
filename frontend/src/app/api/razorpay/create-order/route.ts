import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
  try {
    const { amount, currency = "INR", receipt } = await req.json();

    if (!amount || amount < 100) {
      return NextResponse.json(
        { error: "Invalid amount. Must be at least 100 paise." },
        { status: 400 }
      );
    }

    const instance = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
      key_secret: process.env.RAZORPAY_KEY_SECRET as string,
    });

    const options = {
      amount, // amount in smallest currency unit (paise)
      currency,
      receipt,
    };

    const order = await instance.orders.create(options);
    
    return NextResponse.json(order);
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      { error: "Could not create order" },
      { status: 500 }
    );
  }
}
