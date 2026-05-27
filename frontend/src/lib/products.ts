export const PRODUCT_NAMES = {
  trio: "Trio",
  halfDozen: "Half Dozen",
  mini12: "12 Mini Bites",
  mini24: "24 Mini Bites",
  starter: "The Sunday Starter",
  fullSunday: "The Full Sunday",
  giftBox: "The Gift Box",
} as const;

export const PRODUCT_PRICES = {
  trio: 399,
  halfDozen: 599,
  mini12: 269,
  mini24: 399,
  starter: 599,
  fullSunday: 899,
  giftBox: 799,
} as const;

export const PRODUCT_PRICE_BY_NAME: Record<string, number> = {
  [PRODUCT_NAMES.trio]: PRODUCT_PRICES.trio,
  [PRODUCT_NAMES.halfDozen]: PRODUCT_PRICES.halfDozen,
  [PRODUCT_NAMES.mini12]: PRODUCT_PRICES.mini12,
  [PRODUCT_NAMES.mini24]: PRODUCT_PRICES.mini24,
  [PRODUCT_NAMES.starter]: PRODUCT_PRICES.starter,
  [PRODUCT_NAMES.fullSunday]: PRODUCT_PRICES.fullSunday,
  [PRODUCT_NAMES.giftBox]: PRODUCT_PRICES.giftBox,

  // Legacy names are kept so an older cart payload cannot break checkout.
  "3-Cookie Pack": PRODUCT_PRICES.trio,
  "6-Cookie Pack": PRODUCT_PRICES.halfDozen,
  "12 Bite-Size Box": PRODUCT_PRICES.mini12,
  "24 Bite-Size Box": PRODUCT_PRICES.mini24,
};
