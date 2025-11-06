"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, Menu, X, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { CartDrawer } from "@/components/cart/cart-drawer"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { items } = useCart()

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <>
      <header className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-40">
        <div className="container mx-auto px-4">
          {/* Top bar con branding de la plataforma */}
          <div className="flex items-center justify-between py-1 text-xs border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">Powered by</span>
              <span className="font-semibold text-green-600">Waichatt</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild className="text-gray-500 hover:text-green-600 p-1 h-auto">
                <Link href="/login">
                  <User className="h-3 w-3 mr-1" />
                  <span className="text-xs">Admin</span>
                </Link>
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between py-4">
            {/* Logo y nombre de la empresa cliente */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">TC</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">TechnoCommerce</h1>
                <p className="text-xs text-gray-500">Cliente de Waichatt</p>
              </div>
            </div>



            {/* Carrito y menú móvil */}
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCartOpen(true)}
                className="relative hover:bg-emerald-50 transition-colors"
              >
                <ShoppingCart className="h-4 w-4" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>

              <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Menú móvil */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <nav className="flex flex-col space-y-4">
                <Link
                  href="/"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Inicio
                </Link>
                <Link
                  href="#productos"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Productos
                </Link>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-green-600 font-medium transition-colors flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-4 w-4 mr-2" />
                  Panel Admin
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
