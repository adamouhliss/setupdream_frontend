import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Product {
  id: number
  name: string
  description: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  isNew?: boolean
  colors: string[]
  sizes?: string[]
  category: string
  image?: string
  stock_quantity: number // Added to track available stock
}

export interface CartItem {
  product: Product
  quantity: number
  selectedColor?: string
  selectedSize?: string
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product, quantity?: number, selectedColor?: string, selectedSize?: string) => void
  removeItem: (productId: number, selectedColor?: string, selectedSize?: string) => void
  updateQuantity: (productId: number, quantity: number, selectedColor?: string, selectedSize?: string) => void
  clearCart: () => void
  toggleCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1, selectedColor, selectedSize) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id &&
              item.selectedColor === selectedColor &&
              item.selectedSize === selectedSize
          )

          // Use the actual stock quantity from the product
          const availableStock = product.stock_quantity

          if (existingItem) {
            // Check if adding quantity would exceed available stock
            const newQuantity = existingItem.quantity + quantity
            if (newQuantity > availableStock) {
              console.warn(`Cannot add ${quantity} more items. Available stock: ${availableStock}, current cart quantity: ${existingItem.quantity}`)
              // Only add up to available stock
              const maxAddable = Math.max(0, availableStock - existingItem.quantity)
              if (maxAddable === 0) {
                return state // Don't add anything if already at maximum
              }
              // Update quantity to maximum available
              return {
                items: state.items.map((item) =>
                  item.product.id === product.id &&
                    item.selectedColor === selectedColor &&
                    item.selectedSize === selectedSize
                    ? { ...item, quantity: availableStock }
                    : item
                )
              }
            } else {
              // Update quantity if within stock limits
              return {
                items: state.items.map((item) =>
                  item.product.id === product.id &&
                    item.selectedColor === selectedColor &&
                    item.selectedSize === selectedSize
                    ? { ...item, quantity: newQuantity }
                    : item
                )
              }
            }
          } else {
            // Check if initial quantity exceeds available stock
            const finalQuantity = Math.min(quantity, availableStock)
            if (finalQuantity <= 0) {
              console.warn(`Product ${product.name} is out of stock`)
              return state // Don't add if no stock available
            }
            // Add new item with validated quantity
            return {
              items: [...state.items, { product, quantity: finalQuantity, selectedColor, selectedSize }]
            }
          }
        })
      },

      removeItem: (productId, selectedColor, selectedSize) => {
        set((state) => ({
          items: state.items.filter((item) =>
            !(item.product.id === productId &&
              item.selectedColor === selectedColor &&
              item.selectedSize === selectedSize)
          )
        }))
      },

      updateQuantity: (productId, quantity, selectedColor, selectedSize) => {
        if (quantity <= 0) {
          get().removeItem(productId, selectedColor, selectedSize)
          return
        }

        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === productId &&
              item.selectedColor === selectedColor &&
              item.selectedSize === selectedSize
          )

          if (existingItem) {
            // Use the actual stock quantity from the product
            const availableStock = existingItem.product.stock_quantity

            // Ensure quantity doesn't exceed available stock
            const finalQuantity = Math.min(quantity, availableStock)

            if (finalQuantity !== quantity) {
              console.warn(`Requested quantity ${quantity} exceeds available stock ${availableStock}. Setting to maximum available.`)
            }

            return {
              items: state.items.map((item) =>
                item.product.id === productId &&
                  item.selectedColor === selectedColor &&
                  item.selectedSize === selectedSize
                  ? { ...item, quantity: finalQuantity }
                  : item
              )
            }
          }

          return state
        })
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
      }
    }),
    {
      name: 'cart-storage', // localStorage key
    }
  )
) 