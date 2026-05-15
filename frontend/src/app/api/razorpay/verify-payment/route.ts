import { NextResponse } from 'next/server';
import { RazorpayConfigError, verifyRazorpaySignature } from '@/lib/razorpay';

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing required signature fields." },
        { status: 400 }
      );
    }

    if (verifyRazorpaySignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    })) {
      return NextResponse.json({ success: true, message: "Payment verified successfully" });
    } else {
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
    }
  } catch (error: unknown) {
    console.error("Signature verification error:", error);
    if (error instanceof RazorpayConfigError) {
      return NextResponse.json(
        { error: "Razorpay is not configured. Add the key secret environment variable." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Signature verification failed" },
      { status: 500 }
    );
  }
}
