import { create } from "zustand";
import { Product } from "./products";

export const SHIPPING_COST = 180;
export const FREE_SHIPPING_THRESHOLD = 1900;
export const DISCOUNT_CODE = "AMIR23";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  discountApplied: boolean;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  applyDiscount: (code: string) => boolean;
  removeDiscount: () => void;
  subtotal: () => number;
  shipping: () => number;
  total: () => number;
  count: () => number;
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  discountApplied: false,
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
  clearCart: () => set({ items: [], discountApplied: false }),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  applyDiscount: (code: string) => {
    if (code.trim().toUpperCase() === DISCOUNT_CODE) {
      set({ discountApplied: true });
      return true;
    }
    return false;
  },
  removeDiscount: () => set({ discountApplied: false }),
  subtotal: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
  shipping: () => {
    const sub = get().subtotal();
    if (sub === 0) return 0;
    if (get().discountApplied) return 0;
    if (sub >= FREE_SHIPPING_THRESHOLD) return 0;
    return SHIPPING_COST;
  },
  total: () => get().subtotal() + get().shipping(),
  count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
