import { getDeliveryQuoteByPincode, normalizePincode } from "@/lib/delivery";
import {
  PRODUCT_NAMES,
  PRODUCT_PRICE_BY_NAME,
  STANDALONE_BITE_PRODUCT_NAMES,
  getAttaJaggeryBiteUpgrade,
} from "@/lib/products";
import type { OrderItem } from "@/lib/storage";

const COMBO_PRODUCT_NAMES = new Set<string>([
  PRODUCT_NAMES.starter,
  PRODUCT_NAMES.giftBox,
  PRODUCT_NAMES.fullSunday,
]);

function isMiniBitesOnlyOrder(items: OrderItem[]) {
  return items.every((item) => STANDALONE_BITE_PRODUCT_NAMES.includes(item.name as typeof STANDALONE_BITE_PRODUCT_NAMES[number]));
}

export function calculateServerOrderPricing(items: OrderItem[], pincodeInput: string | number | null | undefined) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Cart is empty.");
  }

  const normalizedItems = items.map((item) => {
    const attaJaggeryBiteCount = Number(item.selections?.["Atta Jaggery Almond Bites"]) || 0;
    const attaJaggeryUpgrade = COMBO_PRODUCT_NAMES.has(item.name)
      ? getAttaJaggeryBiteUpgrade(attaJaggeryBiteCount)
      : 0;
    const basePrice = PRODUCT_PRICE_BY_NAME[item.name] + attaJaggeryUpgrade;
    const quantity = Math.max(1, Number(item.quantity) || 1);

    if (!basePrice) {
      throw new Error(`Unknown product: ${item.name}`);
    }

    return {
      ...item,
      price: basePrice,
      quantity,
    };
  });

  const subtotal = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const pincode = normalizePincode(pincodeInput);
  const deliveryQuote = getDeliveryQuoteByPincode(pincode, subtotal);

  if (!deliveryQuote) {
    throw new Error("UNSUPPORTED_PINCODE");
  }

  if (deliveryQuote.zoneId !== "zone1" && isMiniBitesOnlyOrder(normalizedItems)) {
    throw new Error("MINI_STANDALONE_NOT_AVAILABLE");
  }

  if (deliveryQuote.missingMinimum > 0) {
    throw new Error(`MINIMUM_ORDER_NOT_MET:${deliveryQuote.missingMinimum}`);
  }

  return {
    items: normalizedItems,
    subtotal,
    delivery: deliveryQuote.fee,
    total: subtotal + deliveryQuote.fee,
    pincode,
  };
}
