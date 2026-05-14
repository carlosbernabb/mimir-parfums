export const SHIPPING_COST = 180;
export const FREE_SHIPPING_THRESHOLD = 1900;
export const DISCOUNT_CODE = "AMIR23";
export const DISCOUNT_CODE_PERCENT = "DANKEST";
export const DISCOUNT_PERCENT_VALUE = 5;

export type PricingSettings = {
  shippingCost: number;
  freeShippingThreshold: number;
  updatedAt?: string;
};
