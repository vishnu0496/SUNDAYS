import { getDeliveryFeeByPincode, normalizePincode } from "@/lib/delivery";
import type { OrderItem } from "@/lib/storage";

const PRODUCT_PRICES: Record<string, number> = {
  "3-Cookie Pack": 349,
  "6-Cookie Pack": 599,
  "12 Bite-Size Box": 219,
  "24 Bite-Size Box": 399,
};

export function calculateServerOrderPricing(items: OrderItem[], pincodeInput: string | number | null | undefined) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Cart is empty.");
  }

  const normalizedItems = items.map((item) => {
    const price = PRODUCT_PRICES[item.name];
    const quantity = Math.max(1, Number(item.quantity) || 1);

    if (!price) {
      throw new Error(`Unknown product: ${item.name}`);
    }

    return {
      ...item,
      price,
      quantity,
    };
  });

  const subtotal = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const pincode = normalizePincode(pincodeInput);
  const delivery = getDeliveryFeeByPincode(pincode, subtotal);

  if (delivery === null) {
    throw new Error("UNSUPPORTED_PINCODE");
  }

  return {
    items: normalizedItems,
    subtotal,
    delivery,
    total: subtotal + delivery,
    pincode,
  };
}
