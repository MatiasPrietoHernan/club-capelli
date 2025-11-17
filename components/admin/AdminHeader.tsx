"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, Package, BarChart3, Tags, LogOut } from "lucide-react"
import Image from "next/image"
import { useSession, signOut } from "next-auth/react"

export function AdminHeader() {
  const { status, data: session } = useSession()
  const pathname = usePathname()

  // Function to get the current page title based on pathname
  const getCurrentPageTitle = () => {
    if (pathname === "/admin") return "Panel Administrativo"
    if (pathname === "/admin/tags") return "Gestión de Marcas y Categorías"
    if (pathname === "/admin/products") return "Gestión de Productos"
    if (pathname.startsWith("/admin/products/new")) return "Crear Nuevo Producto"
    if (pathname.startsWith("/admin/products/edit/")) return "Editar Producto"
    if (pathname.startsWith("/admin/orders")) return "Gestión de Pedidos"
    return "Panel Administrativo"
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div
                className="w-8 h-8 bg-gradient-to-r from-[#FF6B1A] to-[#FF7F00] rounded-lg flex items-center justify-center overflow-hidden shadow-sm"
                style={{ background: 'linear-gradient(to right, #FF6B1A, #FF7F00)' }}
              >
                <Image
                  src="/images/logoCapelli.png"
                  alt="Club Capelli Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                  onError={(e) => {
                    // Fallback to text if logo fails
                    const target = e.target as HTMLElement
                    target.style.display = 'none'
                    const fallback = target.parentElement?.querySelector('.fallback-text') as HTMLElement
                    if (fallback) fallback.style.display = 'block'
                  }}
                />
                <span className="fallback-text hidden text-white font-bold text-sm">CC</span>
              </div>
              <span className="font-semibold text-xl" style={{ color: '#FF6B1A' }}>Club Capelli</span>
            </div>
            <span className="text-gray-300">|</span>
            <span className="text-gray-600 font-light">{getCurrentPageTitle()}</span>
          </div>

          <nav className="flex items-center space-x-2">
            <Link href="/admin/orders">
              <Button
                variant={pathname.startsWith("/admin/orders") ? "default" : "ghost"}
                size="sm"
                className={pathname.startsWith("/admin/orders")
                  ? "text-white shadow-sm"
                  : "hover:text-[#FF6B1A] text-[#FF6B1A]"
                }
                style={pathname.startsWith("/admin/orders") ? {
                  backgroundColor: '#FF6B1A',
                  borderColor: '#FF6B1A'
                } : {
                  backgroundColor: 'transparent',
                  borderColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (!pathname.startsWith("/admin/orders")) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 107, 26, 0.1)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!pathname.startsWith("/admin/orders")) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }
                }}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Pedidos
              </Button>
            </Link>
            <Link href="/admin/tags">
              <Button
                variant={pathname.startsWith("/admin/tags") ? "default" : "ghost"}
                size="sm"
                className={pathname.startsWith("/admin/tags")
                  ? "text-white shadow-sm"
                  : "hover:text-[#FF6B1A] text-[#FF6B1A]"
                }
                style={pathname.startsWith("/admin/tags") ? {
                  backgroundColor: '#FF6B1A',
                  borderColor: '#FF6B1A'
                } : {
                  backgroundColor: 'transparent',
                  borderColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (!pathname.startsWith("/admin/tags")) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 107, 26, 0.1)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!pathname.startsWith("/admin/tags")) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }
                }}
              >
                <Tags className="h-4 w-4 mr-2" />
                Marcas y Categorías
              </Button>
            </Link>
            <Link href="/admin/products">
              <Button
                variant={pathname.startsWith("/admin/products") ? "default" : "ghost"}
                size="sm"
                className={pathname.startsWith("/admin/products")
                  ? "text-white shadow-sm"
                  : "hover:text-[#FF6B1A] text-[#FF6B1A]"
                }
                style={pathname.startsWith("/admin/products") ? {
                  backgroundColor: '#FF6B1A',
                  borderColor: '#FF6B1A'
                } : {
                  backgroundColor: 'transparent',
                  borderColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (!pathname.startsWith("/admin/products")) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 107, 26, 0.1)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!pathname.startsWith("/admin/products")) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }
                }}
              >
                <Package className="h-4 w-4 mr-2" />
                Productos
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-[#FFF9F5] border-[#FFE0CC] text-[#FF6B1A] hover:border-[#FF6B1A]"
                style={{ borderColor: '#FFE0CC' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFF9F5'
                  e.currentTarget.style.borderColor = '#FF6B1A'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.borderColor = '#FFE0CC'
                }}
              >
                <Home className="h-4 w-4 mr-2" />
                Ver Tienda
              </Button>
            </Link>

            {status === "authenticated" ? (
              <Button
                variant="destructive"
                size="sm"
                className="ml-2"
                onClick={() => signOut({ callbackUrl: "/" })}
                title={session?.user?.email ?? "Cerrar sesión"}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            ) : (
              <Link href="/login">
                <Button size="sm" className="ml-2">Ingresar</Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
