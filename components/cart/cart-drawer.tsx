"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { CartItem } from "./cart-item"
import { CheckoutForm } from "./checkout-form"
import { ShoppingBag, CreditCard } from "lucide-react"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [showCheckout, setShowCheckout] = useState(false)
  const { items, getTotalPrice } = useCart()

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = getTotalPrice()

  // Cerrar automáticamente si el carrito se vacía
  useEffect(() => {
    if (totalItems === 0 && isOpen) {
      onClose()
    }
  }, [totalItems, isOpen, onClose])

  // Reset checkout state when drawer closes
  const handleClose = () => {
    setShowCheckout(false)
    onClose()
  }

  // Reset checkout state when items change
  useEffect(() => {
    if (totalItems === 0) {
      setShowCheckout(false)
    }
  }, [totalItems])

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5" />
            <span>{showCheckout ? "Finalizar Pedido" : `Carrito de Compras (${totalItems})`}</span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Tu carrito está vacío</p>
                <Button onClick={handleClose} className="mt-4">
                  Continuar Comprando
                </Button>
              </div>
            </div>
          ) : showCheckout ? (
            <CheckoutForm
              items={items}
              totalPrice={totalPrice}
              onBack={() => setShowCheckout(false)}
              onClose={handleClose}
            />
          ) : (
            <>
              <div className="flex-1 overflow-y-auto py-4">
                <div className="space-y-4">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-4 mb-5">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>

                <div className="space-y-2">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => setShowCheckout(true)}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Proceder al Pago
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleClose}>
                    Continuar Comprando
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
