export const FREE_DELIVERY_THRESHOLD = 1099;

export const DELIVERY_ZONES = {
  zone1: {
    fee: 49,
    minimum: 0,
    label: "Zone 1",
    pincodes: ["500085", "500072", "500090", "500049", "500050"],
  },
  zone2: {
    fee: 99,
    minimum: 399,
    label: "Zone 2",
    pincodes: ["500037", "500038", "500018", "500016", "500081", "500084", "500032", "500089"],
  },
  zone3: {
    fee: 149,
    minimum: 599,
    label: "Zone 3",
    pincodes: [],
  },
} as const;

export type DeliveryZoneId = keyof typeof DELIVERY_ZONES;

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

export function getDeliveryZoneByPincode(pincodeInput: string | number | null | undefined): DeliveryZoneId | null {
  const pincode = normalizePincode(pincodeInput);

  if ((DELIVERY_ZONES.zone1.pincodes as readonly string[]).includes(pincode)) {
    return "zone1";
  }

  if ((DELIVERY_ZONES.zone2.pincodes as readonly string[]).includes(pincode)) {
    return "zone2";
  }

  if (isHyderabadPincode(pincode)) {
    return "zone3";
  }

  return null;
}

export function getDeliveryQuoteByPincode(pincodeInput: string | number | null | undefined, subtotal: number) {
  const zoneId = getDeliveryZoneByPincode(pincodeInput);

  if (!zoneId) return null;

  const zone = DELIVERY_ZONES[zoneId];
  const fee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : zone.fee;
  const missingMinimum = Math.max(zone.minimum - subtotal, 0);

  return {
    zoneId,
    zoneLabel: zone.label,
    fee,
    minimum: zone.minimum,
    missingMinimum,
    isFree: fee === 0,
  };
}

export function getDeliveryFeeByPincode(pincodeInput: string | number | null | undefined, subtotal: number) {
  const quote = getDeliveryQuoteByPincode(pincodeInput, subtotal);

  return quote ? quote.fee : null;
}
