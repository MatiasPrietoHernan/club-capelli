"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Package, BarChart3 } from "lucide-react"

export function AdminHeader() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="font-semibold text-xl text-gray-900">Waichatt</span>
            </div>
            <span className="text-gray-300">|</span>
            <span className="text-gray-600 font-light">Panel Administrativo</span>
          </div>

          <nav className="flex items-center space-x-2">
            <Link href="/admin/orders">
              <Button variant="ghost" size="sm" className="hover:bg-emerald-50 hover:text-emerald-700">
                <BarChart3 className="h-4 w-4 mr-2" />
                Pedidos
              </Button>
            </Link>
            <Link href="/admin/products">
              <Button variant="ghost" size="sm" className="hover:bg-emerald-50 hover:text-emerald-700">
                <Package className="h-4 w-4 mr-2" />
                Productos
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm" className="border-emerald-200 hover:bg-emerald-50">
                <Home className="h-4 w-4 mr-2" />
                Ver Tienda
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
