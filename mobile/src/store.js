import { create } from 'zustand';

export const useStore = create((set) => ({
  cart: [],
  user: null,
  token: null,
  
  addToCart: (product) => set((state) => {
    const existing = state.cart.find((item) => item.product_id === product.id);
    if (existing) {
      return {
        cart: state.cart.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
    }
    return {
      cart: [...state.cart, { product_id: product.id, product, quantity: 1, price: product.price }],
    };
  }),

  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter((item) => item.product_id !== productId),
  })),

  clearCart: () => set({ cart: [] }),

  setUser: (user, token) => set({ user, token }),
  
  logout: () => set({ user: null, token: null, cart: [] }),
}));
