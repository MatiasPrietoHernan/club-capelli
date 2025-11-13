"use client"

import type React from "react"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/formatPrice";

interface ProductFormProps {
  product?: Product | null
  onSave: () => void
  onCancel: () => void
}

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    salePrice: product?.salePrice || "",
    category: product?.category || "",
    image: product?.images[0] || "",
    stock: product?.stock || 0,
  })

  const [loading, setLoading] = useState(false)


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const productData = {
        ...formData,
        salePrice: formData.salePrice ? Number(formData.salePrice.toString()) : null,
        price: Number(formData.price.toString()) 
      }

      const response = await fetch("/api/products", {
        method: product ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          product ? { ...productData, id: product._id } : productData
        ),
      })

      if (response.ok) {
        toast.success(product ? "Producto actualizado" : "Producto creado", { position: "top-center", style: { color: "green" }, duration: 3000 })
        onSave()
      }
    } catch (error) {
      console.error("Error saving product:", error)
      toast.error("Error al guardar el producto", { position: "top-center", style: { color: "red" }, duration: 3000 })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{product ? "Editar Producto" : "Agregar Nuevo Producto"}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nombre del Producto</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Categoría</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Precio Regular</Label>
                <Input
                  id="price"
                  type="text"
                  value={formatPrice(formData.price)}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\./g, '');
                    setFormData({ ...formData, price: numericValue });
                  }}
                  onBlur={(e) => {
                    const numericValue = e.target.value.replace(/\./g, '');
                    if (!isNaN(Number(numericValue))) {
                      setFormData({ ...formData, price: numericValue });
                    }
                  }}
                  placeholder="10.000"
                  required
                />
              </div>
              <div>
                <Label htmlFor="salePrice">Precio de Oferta (Opcional)</Label>
                <Input
                  id="salePrice"
                  type="text"
                  step="0.01"
                  value={formatPrice(formData.salePrice)}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\./g, '');
                    setFormData({ ...formData, salePrice: numericValue });
                  }}
                  onBlur={(e) => {
                    const numericValue = e.target.value.replace(/\./g, '');
                    if (!isNaN(Number(numericValue))) {
                      setFormData({ ...formData, salePrice: numericValue });
                    }
                  }}
                />
              </div>
              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number.parseInt(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="image">URL de la Imagen</Label>
              <Input
                id="image"
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://ejemplo.com/imagen.jpg"
                required
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Guardando..." : product ? "Actualizar" : "Crear Producto"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
