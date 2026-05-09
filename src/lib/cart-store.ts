import { create } from "zustand";
import type { Product } from "./products";
import { discountAmountForSubtotal, type DiscountCode } from "./discounts";
export {
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_COST,
} from "./pricing";
import {
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_COST,
} from "./pricing";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  discount: DiscountCode | null;
  discountApplied: boolean;
  discountPercent: number;
  discountCode: string;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  applyDiscount: (code: string) => Promise<boolean>;
  removeDiscount: () => void;
  subtotal: () => number;
  discountAmount: () => number;
  shipping: () => number;
  total: () => number;
  count: () => number;
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  discount: null,
  discountApplied: false,
  discountPercent: 0,
  discountCode: "",
  addItem: (product) => {
    set((state) => {
      const existing = state.items.find((i) => i.product.id === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { items: [...state.items, { product, quantity: 1 }] };
    });
  },
  removeItem: (productId) =>
    set((state) => ({ items: state.items.filter((i) => i.product.id !== productId) })),
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items: quantity <= 0
        ? state.items.filter((i) => i.product.id !== productId)
        : state.items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
    })),
  clearCart: () => set({ items: [], discount: null, discountApplied: false, discountPercent: 0, discountCode: "" }),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  applyDiscount: async (code: string) => {
    const res = await fetch("/api/discounts/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    const discount = data.discount as DiscountCode | undefined;
    if (!discount) return false;
    set({
      discount,
      discountApplied: true,
      discountPercent: discount.type === "percent" ? discount.value : 0,
      discountCode: discount.code,
    });
    return true;
  },
  removeDiscount: () => set({ discount: null, discountApplied: false, discountPercent: 0, discountCode: "" }),
  subtotal: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
  discountAmount: () => discountAmountForSubtotal(get().discount, get().subtotal()),
  shipping: () => {
    const sub = get().subtotal();
    if (sub === 0) return 0;
    if (get().discount?.type === "free_shipping") return 0;
    if (sub >= FREE_SHIPPING_THRESHOLD) return 0;
    return SHIPPING_COST;
  },
  total: () => get().subtotal() - get().discountAmount() + get().shipping(),
  count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
