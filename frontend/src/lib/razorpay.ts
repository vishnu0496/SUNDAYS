import crypto from "crypto";
import Razorpay from "razorpay";

export class RazorpayConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RazorpayConfigError";
  }
}

export function getRazorpayKeyId() {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

  if (!keyId) {
    throw new RazorpayConfigError("Missing Razorpay key id.");
  }

  return keyId;
}

export function getRazorpayKeySecret() {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    throw new RazorpayConfigError("Missing Razorpay key secret.");
  }

  return keySecret;
}

export function getRazorpayClient() {
  return new Razorpay({
    key_id: getRazorpayKeyId(),
    key_secret: getRazorpayKeySecret(),
  });
}

export function verifyRazorpaySignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}) {
  const generatedSignature = crypto
    .createHmac("sha256", getRazorpayKeySecret())
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const received = Buffer.from(signature, "hex");
  const generated = Buffer.from(generatedSignature, "hex");

  return received.length === generated.length && crypto.timingSafeEqual(received, generated);
}
