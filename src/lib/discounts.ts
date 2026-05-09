export type DiscountType = "free_shipping" | "percent" | "fixed_amount";

export interface DiscountCode {
  code: string;
  type: DiscountType;
  value: number;
  active: boolean;
  label: string;
  createdAt: string;
}

export const defaultDiscountCodes: DiscountCode[] = [
  {
    code: "AMIR23",
    type: "free_shipping",
    value: 0,
    active: true,
    label: "Envio gratis",
    createdAt: "2026-05-09T00:00:00.000Z",
  },
  {
    code: "DANKEST",
    type: "percent",
    value: 5,
    active: true,
    label: "5% de descuento",
    createdAt: "2026-05-09T00:00:00.000Z",
  },
];

export function normalizeDiscountCode(code: string) {
  return code.trim().toUpperCase().replace(/\s+/g, "");
}

export function discountAmountForSubtotal(discount: DiscountCode | null, subtotal: number) {
  if (!discount || !discount.active) return 0;
  if (discount.type === "percent") return Math.round((subtotal * discount.value) / 100);
  if (discount.type === "fixed_amount") return Math.min(subtotal, Math.max(0, Math.round(discount.value)));
  return 0;
}

export function discountDisplay(discount: DiscountCode | null) {
  if (!discount) return "";
  if (discount.type === "free_shipping") return discount.label || "Envio gratis";
  if (discount.type === "percent") return discount.label || `${discount.value}% de descuento`;
  return discount.label || `$${discount.value.toLocaleString("es-MX")} MXN de descuento`;
}
