import { NextResponse } from "next/server";
import { processOrder, getOrders, getPreviousOrderCount, CustomerDetails, OrderItem } from "@/lib/storage";
import { sendCustomerOrderConfirmation, sendOwnerOrderNotification } from "@/lib/email";
import { RazorpayConfigError, verifyRazorpaySignature } from "@/lib/razorpay";
import { updateOrderMeta } from "@/lib/admin-data";
import { UNSUPPORTED_PINCODE_MESSAGE } from "@/lib/delivery";
import { calculateServerOrderPricing } from "@/lib/order-pricing";

const REVIEW_MODE = process.env.NEXT_PUBLIC_REVIEW_MODE === "true";

export const runtime = "nodejs";

type RazorpayPaymentPayload = {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
};

export async function POST(req: Request) {
  console.log(">>> [API] Order request received");
  // ── REVIEW MODE: Return mock success. No emails, no file writes. ──────────
  if (REVIEW_MODE) {
    console.log(">>> [API] Review mode active");
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return NextResponse.json({
      success: true,
      order: { orderNumber: "PREVIEW-001" },
      _preview: true,
    });
  }
  // ─────────────────────────────────────────────────────────────────────────

  try {
    const body = await req.json();
    console.log(">>> [API] Request body parsed:", !!body);
    const { customer, items, payment } = body as {
      customer: CustomerDetails;
      items: OrderItem[];
      payment?: RazorpayPaymentPayload;
    };

    if (
      !customer ||
      !customer.email ||
      !customer.firstName ||
      !customer.addressHouse ||
      !customer.addressLocality ||
      !customer.addressCity ||
      !customer.addressState ||
      !customer.addressPincode ||
      !items || items.length === 0
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required order fields or empty cart" },
        { status: 400 }
      );
    }

    const pricing = calculateServerOrderPricing(items, customer.addressPincode);
    const pricedCustomer = {
      ...customer,
      addressPincode: pricing.pincode,
    };

    let paymentVerified = false;

    if (payment) {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = payment;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return NextResponse.json(
          { success: false, error: "Missing Razorpay payment verification fields" },
          { status: 400 }
        );
      }

      paymentVerified = verifyRazorpaySignature({
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
      });

      if (!paymentVerified) {
        return NextResponse.json(
          { success: false, error: "Payment verification failed" },
          { status: 400 }
        );
      }
    }

    const result = await processOrder(
      pricedCustomer,
      pricing.items,
      pricing.subtotal,
      pricing.delivery,
      pricing.total
    );

    if (!result.success || !result.entry) {
      return NextResponse.json(
        { success: false, status: result.error, error: "Weekly drop limit reached. Sold out." },
        { status: 400 }
      );
    }

    if (paymentVerified && payment?.razorpay_payment_id && payment.razorpay_order_id) {
      await updateOrderMeta(result.entry.orderNumber, {
        paymentStatus: "Paid",
        fulfillmentStatus: "Reserved",
        notes: `Razorpay payment verified. Payment ID: ${payment.razorpay_payment_id}; Order ID: ${payment.razorpay_order_id}`,
      });
    }

    // Check for previous orders from this customer (for owner email insight)
    const previousOrderCount = await getPreviousOrderCount(
      result.entry.customer.email,
      result.entry.orderNumber
    );

    // Trigger emails asynchronously — non-fatal if they fail
    const emailResults = await Promise.allSettled([
      sendCustomerOrderConfirmation(result.entry),
      sendOwnerOrderNotification(result.entry, previousOrderCount),
    ]);

    emailResults.forEach((emailResult) => {
      if (emailResult.status === "rejected") {
        console.error("Non-fatal email dispatch error:", emailResult.reason);
      }
    });

    return NextResponse.json({ success: true, order: result.entry });
  } catch (error) {
    console.error("Order processing error:", error);
    if (error instanceof Error && error.message === "UNSUPPORTED_PINCODE") {
      return NextResponse.json(
        { success: false, error: UNSUPPORTED_PINCODE_MESSAGE },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.startsWith("MINIMUM_ORDER_NOT_MET:")) {
      const missingAmount = error.message.split(":")[1];
      return NextResponse.json(
        { success: false, error: `Add \u20b9${missingAmount} more to meet the minimum order for your area.` },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === "MINI_STANDALONE_NOT_AVAILABLE") {
      return NextResponse.json(
        { success: false, error: "Bites are available as a standalone order only in Zone 1. Add a regular cookie pack or choose The Sunday Starter combo." },
        { status: 400 }
      );
    }

    if (error instanceof Error && (error.message === "Cart is empty." || error.message.startsWith("Unknown product:"))) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    if (error instanceof RazorpayConfigError) {
      return NextResponse.json(
        { success: false, error: "Razorpay is not configured. Add the key secret environment variable." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // ── REVIEW MODE: Return mock status. Drop is always "live". ──────────────
  if (REVIEW_MODE) {
    return NextResponse.json({ success: true, count: 0, isSoldOut: false });
  }
  // ─────────────────────────────────────────────────────────────────────────

  try {
    const orders = await getOrders();
    const isSoldOut = orders.length >= 50;
    return NextResponse.json({
      success: true,
      count: orders.length,
      isSoldOut,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch status" },
      { status: 500 }
    );
  }
}
