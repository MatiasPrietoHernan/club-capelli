"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Loader2 } from "lucide-react"
import { Product } from "@/types/product"
import { formatPrice } from "@/lib/formatPrice";

interface ProductListProps {
  products: Product[]
  loading: boolean
  onEdit: (product: Product) => void
  onDelete: (productId: string) => void
}

export function ProductList({ products, loading, onEdit, onDelete }: ProductListProps) {
  if (loading) {
    return (
      <div className="min-h-screen pt-24">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <span className="ml-2 text-gray-600">Cargando productos...</span>
        </div>
      </div>
    )
  }
  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-gray-600 mb-4">No hay productos registrados</p>
          <p className="text-sm text-gray-500">Agrega tu primer producto o importa un archivo CSV/Excel</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product,index) => {

        const hasDiscount = product.salePrice &&
          product.salePrice > 0 &&
          product.salePrice < product.price

        const discountPercentage = hasDiscount && product.salePrice && product.salePrice > 0
          ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
          : null
        return (
          <Card key={product._id} className="overflow-hidden">
            <div className="relative">
              <Image
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                width={300}
                height={200}
                className="w-full h-48 object-contain"
              />
              <div className="absolute top-2 right-2 flex space-x-1">
                {discountPercentage && product.salePrice && (
                  <Badge className="bg-red-500">
                    -{Math.round(((product.price - product.salePrice) / product.price) * 100)}%
                  </Badge>
                )}
                {product.quantity === 0 && <Badge variant="destructive">Agotado</Badge>}
                {product.quantity && product.quantity  > 0 && product.quantity <= 5 && (
                  <Badge variant="outline" className="bg-yellow-100">
                    Poco Stock
                  </Badge>
                )}
              </div>
            </div>

            <CardContent className="p-4">
              <div className="mb-2">
                <Badge variant="secondary" className="text-xs">
                  {product.category}
                </Badge>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{product.name}</h3>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {product.salePrice && product.salePrice < product.price ? (
                    <>
                      <span className="text-lg font-bold text-green-600">${formatPrice(product.salePrice)}</span>
                      <span className="text-sm text-gray-500 line-through">${formatPrice(product.price)}</span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-gray-900">${formatPrice(product.price)}</span>
                  )}
                </div>
                <span className="text-sm text-gray-600">Stock: {product.quantity}</span>
              </div>

              <div className="flex justify-between space-x-2">
                <Button size="sm" variant="outline" onClick={() => onEdit(product)} className="flex-1">
                  <Edit className="h-3 w-3 mr-1" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDelete(product._id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
