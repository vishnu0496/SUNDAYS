import { NextResponse } from 'next/server';
import { getRazorpayClient, RazorpayConfigError } from '@/lib/razorpay';
import { UNSUPPORTED_PINCODE_MESSAGE } from '@/lib/delivery';
import { calculateServerOrderPricing } from '@/lib/order-pricing';
import type { OrderItem } from '@/lib/storage';

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { items, pincode, currency = "INR", receipt } = await req.json() as {
      items?: OrderItem[];
      pincode?: string;
      currency?: string;
      receipt?: string;
    };

    const pricing = calculateServerOrderPricing(items || [], pincode);
    const amountInPaise = pricing.total * 100;

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
      subtotal: pricing.subtotal,
      delivery: pricing.delivery,
      total: pricing.total,
      pincode: pricing.pincode,
    });
  } catch (error: unknown) {
    console.error("Razorpay order creation error:", error);
    if (error instanceof Error && error.message === "UNSUPPORTED_PINCODE") {
      return NextResponse.json(
        { error: UNSUPPORTED_PINCODE_MESSAGE },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.startsWith("MINIMUM_ORDER_NOT_MET:")) {
      const missingAmount = error.message.split(":")[1];
      return NextResponse.json(
        { error: `Add \u20b9${missingAmount} more to meet the minimum order for your area.` },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === "MINI_STANDALONE_NOT_AVAILABLE") {
      return NextResponse.json(
        { error: "Bites are available as a standalone order only in Zone 1. Add a regular cookie pack or choose The Sunday Starter combo." },
        { status: 400 }
      );
    }

    if (error instanceof Error && (error.message === "Cart is empty." || error.message.startsWith("Unknown product:"))) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

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
