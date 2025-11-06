"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Phone, MoreVertical, User, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { useSearchParams } from "next/navigation"

export function WhatsAppHeader() {
  const pathname = usePathname();
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { items } = useCart()
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  const param=useSearchParams();
  const id = param.get("id");

  const buildUrl = (basePath: string) => {
    return id ? `${basePath}?id=${id}` : basePath
  }

  // Cerrar carrito automáticamente si se vacía
  useEffect(() => {
    if (totalItems === 0) {
      setIsCartOpen(false)
    }
  }, [totalItems])

  return (
    <>
      <header className="bg-emerald-600 text-white fixed top-0 left-0 right-0 z-40">
        {/* Top bar con branding de la plataforma */}
        <div className="bg-emerald-700 px-4 py-1 text-xs flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-emerald-200">Powered by</span>
            <span className="font-semibold text-white">Waichatt</span>
          </div>
          <Link href={buildUrl("/login")} className="text-emerald-200 hover:text-white flex items-center space-x-1">
            <User className="h-3 w-3" />
            <span>Admin</span>
          </Link>
        </div>

        {/* Header principal estilo WhatsApp */}
        <div className="flex items-center px-4 py-3">
          <Link href={pathname.includes("product") ? buildUrl("/") : buildUrl("#")}>
            <Button variant="ghost" size="sm" className="text-white hover:bg-emerald-700 p-2 mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-r rounded-full flex items-center justify-center text-center">
                <Image src="/images/CRISTAL_LOGO.webp" width={40} height={40} alt="logo" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="font-semibold text-white">Cristal Shop</h1>
              <p className="text-xs text-emerald-100">Tienda en línea</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-emerald-700 p-2 relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-emerald-700 p-2">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-emerald-700 p-2">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
