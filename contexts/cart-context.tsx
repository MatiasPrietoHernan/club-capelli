"use client"

import { createContext, useContext, useReducer, type ReactNode } from "react"

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  stock?: number
  quantity?: number
}

interface CartState {
  items: CartItem[]
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem & { quantityToAdd: number } }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "SET_CART"; payload: CartItem[] }

const CartContext = createContext<{
  items: CartItem[]
  addItem: (item: CartItem, quantity?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  setCart: (items: CartItem[]) => void
  getTotalPrice: () => number
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => item.id === action.payload.id)
      const quantityToAdd = action.payload.quantityToAdd

      if (existingItem) {
        const newQuantity = (existingItem.quantity ?? 0) + quantityToAdd

        if (existingItem.stock && newQuantity > existingItem.stock) {
          // Don't add more than available stock
          return state
        }

        return {
          ...state,
          items: state.items.map((item) => (item.id === action.payload.id ? { ...item, quantity: newQuantity } : item)),
        }
      }

      if (action.payload.stock && quantityToAdd > action.payload.stock) {
        return state
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: quantityToAdd }],
      }
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      }

    case "UPDATE_QUANTITY":
      const existingItem = state.items.find((item) => item.id === action.payload.id)

      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== action.payload.id),
        }
      }

      if (existingItem && action.payload.quantity < (existingItem.quantity ?? 0)) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item,
          ),
        }
      } else if (existingItem && existingItem.stock && (existingItem.quantity ?? 0) < existingItem.stock) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item,
          ),
        }
      }

      return {
        ...state,
      }

    case "SET_CART":
      return {
        ...state,
        items: action.payload,
      }

    case "CLEAR_CART":
      return { items: [] }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  const addItem = (item: CartItem, quantity = 1) => {
    dispatch({ type: "ADD_ITEM", payload: { ...item, quantityToAdd: quantity } })
  }

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const setCart = (items: CartItem[]) => {
    dispatch({ type: "SET_CART", payload: items })
  }

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + item.price * (item.quantity ?? 0), 0)
  }

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        setCart,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

// Función helper para transformar datos de API al formato del carrito
export function transformApiCartToCartItems(apiCart: {
  items: Array<{
    id: string
    title: string
    unit_price: number
    quantity: number
    image?: string
  }>
}): CartItem[] {
  return apiCart.items.map((item) => ({
    id: item.id,
    name: item.title,
    price: item.unit_price,
    image: item.image || "",
    quantity: item.quantity,
  }))
}

// Función para obtener carrito desde API (solo cliente)
export async function getCartFromApi(cartId: string): Promise<CartItem[]> {
  try {
    if (typeof window === "undefined") {
      throw new Error("getCartFromApi solo puede ejecutarse en el cliente")
    }

    const response = await fetch(`/api/cart?idCart=${cartId}`)
    const apiCart = await response.json()

    if (response.status === 200 || response.status === 404) {
      if (apiCart.products && Array.isArray(apiCart.products) && apiCart.products.length > 0) {
        return transformApiCartToCartItems({ items: apiCart.products })
      } else {
        return []
      }
    }

    throw new Error(`Error al obtener el carrito: ${response.status}`)
  } catch (error) {
    console.error("Error getting cart:", error)
    return []
  }
}
