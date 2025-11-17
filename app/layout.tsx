import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { CartProvider } from "@/contexts/cart-context"
import { Toaster } from "sonner"
import  AuthProvider  from "@/components/auth/auth-providers"
import { DynamicTitle } from "@/components/layout/dynamicTitle"

export const metadata: Metadata = {
  title: "Club Capelli",
  description: "Catalogo web Club Capelli",
  generator: 'next.js',
  icons: {
    icon: '/favicon.ico',
  }
}



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <CartProvider>
            <DynamicTitle />
            {children}
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
