export const FREE_DELIVERY_THRESHOLD = 799;

export const DELIVERY_ZONES = {
  zone1: {
    fee: 49,
    pincodes: ["500085", "500072", "500090", "500049", "500050"],
  },
  zone2: {
    fee: 79,
    pincodes: ["500037", "500038", "500018", "500016", "500081", "500084", "500032", "500089"],
  },
} as const;

export const HYDERABAD_PINCODE_MIN = 500001;
export const HYDERABAD_PINCODE_MAX = 500118;
export const UNSUPPORTED_PINCODE_MESSAGE = "Sorry, we currently deliver only within Hyderabad.";

export function normalizePincode(value: string | number | null | undefined) {
  return String(value ?? "").replace(/\D/g, "").slice(0, 6);
}

export function isHyderabadPincode(pincode: string) {
  if (!/^\d{6}$/.test(pincode)) return false;
  const numericPincode = Number(pincode);
  return numericPincode >= HYDERABAD_PINCODE_MIN && numericPincode <= HYDERABAD_PINCODE_MAX;
}

export function getDeliveryFeeByPincode(pincodeInput: string | number | null | undefined, subtotal: number) {
  const pincode = normalizePincode(pincodeInput);

  let baseFee: number | null = null;

  if (DELIVERY_ZONES.zone1.pincodes.includes(pincode)) {
    baseFee = DELIVERY_ZONES.zone1.fee;
  } else if (DELIVERY_ZONES.zone2.pincodes.includes(pincode)) {
    baseFee = DELIVERY_ZONES.zone2.fee;
  } else if (isHyderabadPincode(pincode)) {
    baseFee = 99;
  }

  if (baseFee === null) return null;
  if (subtotal >= FREE_DELIVERY_THRESHOLD) return 0;

  return baseFee;
}
