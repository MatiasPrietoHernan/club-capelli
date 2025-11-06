"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { CartDrawer } from "@/components/cart/cart-drawer"

export function FloatingCartButton() {
  const [isVisible, setIsVisible] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { items } = useCart()

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  useEffect(() => {
    setIsVisible(totalItems > 0)

    // Si el carrito se vacía, cerrar el drawer automáticamente
    if (totalItems === 0) {
      setIsCartOpen(false)
    }
  }, [totalItems])

  if (!isVisible) return null

  return (
    <>
      <Button
        onClick={() => setIsCartOpen(true)}
        className="floating-cart-btn bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 md:hidden"
        style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          minWidth: "200px",
          zIndex: 50,
          borderRadius: "25px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        }}
      >
        <ShoppingCart className="h-4 w-4 mr-2" />
        Ir al Carrito ({totalItems})
      </Button>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
