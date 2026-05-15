import { NextResponse } from 'next/server';
import { getRazorpayClient, RazorpayConfigError } from '@/lib/razorpay';

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { amount, currency = "INR", receipt } = await req.json();
    const amountInPaise = Number(amount);

    if (!Number.isInteger(amountInPaise) || amountInPaise < 100) {
      return NextResponse.json(
        { error: "Invalid amount. Must be at least 100 paise." },
        { status: 400 }
      );
    }

    const instance = getRazorpayClient();

    const order = await instance.orders.create({
      amount: amountInPaise,
      currency,
      receipt: receipt || `sundays_${Date.now()}`,
    });
    
    return NextResponse.json({
      order_id: order.id,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    });
  } catch (error: unknown) {
    console.error("Razorpay order creation error:", error);
    if (error instanceof RazorpayConfigError) {
      return NextResponse.json(
        { error: "Razorpay is not configured. Add key id and key secret environment variables." },
        { status: 401 }
      );
    }

    const statusCode = typeof error === "object" && error && "statusCode" in error
      ? Number((error as { statusCode?: number }).statusCode)
      : 500;

    return NextResponse.json(
      { error: "Could not create order" },
      { status: statusCode === 401 ? 401 : 500 }
    );
  }
}
