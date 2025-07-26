import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, Order } from '@/types';

interface CartState {
  cart: Product[];
  orders: Order[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  addOrder: (order: Order) => void;
}

interface AuthState {
  isAuthenticated: boolean;
  setAuth: (auth: boolean) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      orders: [],
      addToCart: (product) =>
        set((state) => {
          const existing = state.cart.find((item) => item.id === product.id);
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
              ),
            };
          }
          return { cart: [...state.cart, { ...product, quantity: 1 }] };
        }),
      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id ? { ...item, quantity: quantity < 1 ? 1 : quantity } : item
          ),
        })),
      addOrder: (order) =>
        set((state) => ({
          orders: [...state.orders, order],
          cart: [],
        })),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      setAuth: (auth) => set({ isAuthenticated: auth }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);