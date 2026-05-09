import { create } from "zustand";
import type { Product } from "./products";
export {
  DISCOUNT_CODE,
  DISCOUNT_CODE_PERCENT,
  DISCOUNT_PERCENT_VALUE,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_COST,
} from "./pricing";
import {
  DISCOUNT_CODE,
  DISCOUNT_CODE_PERCENT,
  DISCOUNT_PERCENT_VALUE,
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
  discountApplied: boolean;
  discountPercent: number;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  applyDiscount: (code: string) => boolean;
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
  discountApplied: false,
  discountPercent: 0,
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
  clearCart: () => set({ items: [], discountApplied: false, discountPercent: 0 }),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  applyDiscount: (code: string) => {
    const upper = code.trim().toUpperCase();
    if (upper === DISCOUNT_CODE) {
      set({ discountApplied: true, discountPercent: 0 });
      return true;
    }
    if (upper === DISCOUNT_CODE_PERCENT) {
      set({ discountApplied: true, discountPercent: DISCOUNT_PERCENT_VALUE });
      return true;
    }
    return false;
  },
  removeDiscount: () => set({ discountApplied: false, discountPercent: 0 }),
  subtotal: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
  discountAmount: () => {
    const pct = get().discountPercent;
    if (pct <= 0) return 0;
    return Math.round(get().subtotal() * pct / 100);
  },
  shipping: () => {
    const sub = get().subtotal();
    if (sub === 0) return 0;
    if (get().discountApplied) return 0;
    if (sub >= FREE_SHIPPING_THRESHOLD) return 0;
    return SHIPPING_COST;
  },
  total: () => get().subtotal() - get().discountAmount() + get().shipping(),
  count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
