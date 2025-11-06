"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star, X } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useState } from "react"
import { IProduct } from "@/lib/models/product"
import { formatPrice } from "@/lib/formatPrice"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
interface WhatsAppProductCardProps {
  product: IProduct
}

export function WhatsAppProductCard({ product }: WhatsAppProductCardProps) {
  const { addItem } = useCart()
  const [showImageModal, setShowImageModal] = useState(false)

  const param = useSearchParams();
  const id = param.get("id");

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.salePrice || Number(product.price),
      image: (product as any).images[0],
      stock: product.stock
    })
  }

  // Mejorar la lógica de descuento
  const hasDiscount = product.salePrice && product.salePrice > 0 && product.salePrice < Number(product.price)

  const discountPercentage =
    hasDiscount && product.salePrice && product.salePrice > 0
      ? Math.round((((Number(product.price)) - product.salePrice!) / Number(product.price)) * 100)
      : null

  console.log(product);
  return (
    <>
      <Link href={id ? `product/${product.id}?id=${id}` : `product/${product.id}`} className="cursor-pointer">
        <div className="product-message w-full flex flex-col">
          <div
            className="relative overflow-hidden rounded-t-lg group cursor-pointer"
          //onClick={() => setShowImageModal(true)}
          >
            <Image
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              width={400}
              height={250}
              className="w-full h-32 sm:h-40 md:h-44 lg:h-48 object-cover transition-all duration-300 ease-in-out group-hover:brightness-110"
            />
            {/*  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 ease-in-out flex items-center justify-center">
            <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-medium">
              Ver imagen completa
            </div>
          </div> */}

            {/* Solo mostrar el badge si hay descuento real y el porcentaje es mayor a 0 */}
            {discountPercentage && (
              <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 text-xs">-{discountPercentage}%</Badge>
            )}

            {product.quantity && product.quantity <= 5 && product.quantity > 0 && (
              <Badge variant="outline" className="absolute top-2 right-2 bg-white text-xs z-10">
                Últimas {product.quantity}
              </Badge>
            )}
            {product.stock === 0 && (
              <Badge variant="destructive" className="absolute top-2 right-2 text-xs z-10">
                Agotado
              </Badge>
            )}
          </div>

          <div className="p-3 md:p-4 flex-1 flex flex-col">
            <div className="mb-2">
              <Badge variant="secondary" className="text-xs">
                {product.brand || ""}
              </Badge>
            </div>

            <h3 title={product.name} className="font-semibold text-gray-900 mb-2 text-sm line-clamp-2">{product.name.length > 30 ? `${product.name.slice(0, 30)}...` : product.name}</h3>
            <p className="text-gray-600 text-xs mb-3 line-clamp-2">{product.description}</p>

            <div className="flex items-center mb-3">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-2">(4.8)</span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {hasDiscount ? (
                  <>
                    <span className="text-sm md:text-base font-bold text-emerald-600">
                      ${formatPrice(product.salePrice!)}
                    </span>
                    <span className="text-xs text-gray-400 line-through">${formatPrice(product.price)}</span>
                  </>
                ) : (
                  <span className="text-sm md:text-base font-bold text-gray-900">${formatPrice(product.price)}</span>
                )}
              </div>
            </div>

          </div>
        </div>

        {/*  {showImageModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-lg md:max-w-xl max-h-[70vh] md:max-h-[75vh] w-full animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-12 right-0 md:-top-12 md:right-0 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-70 rounded-full p-2"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="bg-white rounded-lg overflow-hidden transform transition-all duration-300">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={600}
                height={450}
                className="w-full h-auto object-contain max-h-[50vh] md:max-h-[55vh]"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm">{product.description}</p>
              </div>
            </div>
          </div>
        </div>
      )} */}
      </Link>
    </>
  )
}
