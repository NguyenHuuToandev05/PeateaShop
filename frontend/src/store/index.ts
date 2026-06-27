import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product, User } from '../types'

// ─── Cart Store ───────────────────────────────────────────────────────────────
interface CartStore {
  items: CartItem[]
  addItem: (product: Product, variant?: string, qty?: number) => void
  removeItem: (productId: number, variant?: string) => void
  updateQty: (productId: number, variant: string | undefined, qty: number) => void
  clearCart: () => void
  total: () => number
  itemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, variant, qty = 1) => {
        set((state) => {
          const idx = state.items.findIndex(
            (i) => i.product.id === product.id && i.variant === variant
          )
          if (idx >= 0) {
            const items = [...state.items]
            items[idx] = { ...items[idx], quantity: items[idx].quantity + qty }
            return { items }
          }
          return { items: [...state.items, { product, variant, quantity: qty }] }
        })
      },
      removeItem: (productId, variant) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.product.id === productId && i.variant === variant)
          ),
        })),
      updateQty: (productId, variant, qty) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId && i.variant === variant
              ? { ...i, quantity: Math.max(1, qty) }
              : i
          ),
        })),
      clearCart: () => set({ items: [] }),
      total: () => get().items.reduce((s, i) => s + i.product.price * i.quantity, 0),
      itemCount: () => get().items.reduce((s, i) => s + i.quantity, 0),
    }),
    { name: 'squishy-cart' }
  )
)

// ─── Auth Store ───────────────────────────────────────────────────────────────
interface AuthStore {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  logout: () => void
  isAdmin: () => boolean
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        localStorage.setItem('token', token)
        set({ user, token })
      },
      logout: () => {
        localStorage.removeItem('token')
        set({ user: null, token: null })
      },
      isAdmin: () => get().user?.role === 'ADMIN',
    }),
    { name: 'squishy-auth' }
  )
)

// ─── Wishlist Store ───────────────────────────────────────────────────────────
interface WishlistStore {
  ids: number[]
  toggle: (id: number) => void
  has: (id: number) => boolean
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set((s) => ({
          ids: s.ids.includes(id) ? s.ids.filter((i) => i !== id) : [...s.ids, id],
        })),
      has: (id) => get().ids.includes(id),
    }),
    { name: 'squishy-wishlist' }
  )
)
