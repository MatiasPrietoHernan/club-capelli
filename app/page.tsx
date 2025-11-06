"use client"
import { WhatsAppHeader } from "@/components/layout/whatsapp-header"
import { WhatsAppProductCatalog } from "@/components/products/whatsapp-product-catalog"
import { FloatingCartButton } from "@/components/products/floating-cart-button"
import { CartLoader } from "@/components/cart/cart-loader"
import { Suspense } from "react"


export default function HomePage() {

  return (
    <div className="min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <WhatsAppHeader />
      </Suspense>
      <main>
        <WhatsAppProductCatalog />
      </main>
      <FloatingCartButton />
      <Suspense fallback={<div>Loading...</div>}>
        <CartLoader />
      </Suspense>
    </div>
  );

}