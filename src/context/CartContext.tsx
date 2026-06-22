import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Accessory } from '../types'

interface CartItem extends Accessory {
  quantity: number
}

interface CartContextValue {
  items: CartItem[]
  addToCart: (item: Accessory) => void
  removeFromCart: (id: string) => void
  cartCount: number
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

interface CartProviderProps {
  children: ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([])

  const addToCart = (item: Accessory) => {
    setItems((currentItems) => {
      const existing = currentItems.find((cartItem) => cartItem.id === item.id)
      if (existing) {
        return currentItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        )
      }
      return [...currentItems, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (id: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id))
  }

  const cartCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  )

  const value: CartContextValue = {
    items,
    addToCart,
    removeFromCart,
    cartCount,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used inside CartProvider')
  }

  return context
}
