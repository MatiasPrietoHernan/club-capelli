// app/admin/products/edit/[id]/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useRouter, useParams } from "next/navigation"
import { Upload, X, Loader2 } from "lucide-react"

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  const [loading, setLoading] = useState(false)
  const [loadingProduct, setLoadingProduct] = useState(true)
  const [uploadingMain, setUploadingMain] = useState(false)
  const [uploadingVariants, setUploadingVariants] = useState<{ [key: number]: boolean }>({})
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    brand: "",
    price: 0,
    category: "",
    images: [] as string[],
  })
  const [variants, setVariants] = useState<any[]>([])

  const uploadImage = async (file: File): Promise<string | null> => {
    const formDataUpload = new FormData()
    formDataUpload.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      })

      if (response.ok) {
        const data = await response.json()
        return data.publicUrl
      } else {
        const error = await response.json()
        toast.error(error.error || "Error subiendo imagen")
        return null
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Error subiendo imagen")
      return null
    }
  }

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingMain(true)
    const uploadedUrls: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const url = await uploadImage(file)
      if (url) {
        uploadedUrls.push(url)
      }
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...uploadedUrls]
    }))

    setUploadingMain(false)
    e.target.value = ""
  }

  const handleVariantImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingVariants(prev => ({ ...prev, [index]: true }))

    const url = await uploadImage(file)
    if (url) {
      updateVariant(index, 'image_url', url)
    }

    setUploadingVariants(prev => ({ ...prev, [index]: false }))
    e.target.value = ""
  }

  const removeMainImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  // Cargar datos del producto
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoadingProduct(true)
        console.log("Fetching product with ID:", productId)
        
        const response = await fetch(`/api/products/verify?productId=${productId}`)
        
        if (response.ok) {
          const data = await response.json()
          const product = data.product
          console.log("Product loaded:", product)
          
          setFormData({
            name: product.name || "",
            description: product.description || "",
            brand: product.brand || "",
            price: product.price || 0,
            category: product.category || "",
            images: product.images || [],
          })

          // Procesar variantes - manejar null en promotional_price
          const processedVariants = product.variants?.map((variant: any) => ({
            variant_id: variant.variant_id || Date.now() + Math.random(),
            sku: variant.sku || "",
            label: variant.label || "",
            color: variant.color || "",
            price: variant.price || 0,
            promotional_price: variant.promotional_price || 0, // Convertir null a 0
            effective_price: variant.effective_price || variant.price || 0,
            stock_total: variant.stock_total || 0,
            image_url: variant.image_url || "",
            visible: variant.visible !== false,
            weight: variant.weight || 0,
          })) || []

          setVariants(processedVariants.length > 0 ? processedVariants : [
            {
              variant_id: Date.now(),
              sku: "",
              label: "",
              color: "",
              price: product.price || 0,
              promotional_price: 0,
              effective_price: product.price || 0,
              stock_total: 0,
              image_url: product.images?.[0] || "",
              visible: true,
              weight: 0,
            }
          ])

        } else {
          const errorText = await response.text()
          console.error("Error response:", errorText)
          throw new Error(`Error ${response.status}: ${errorText}`)
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        toast.error("Error al cargar el producto")
      } finally {
        setLoadingProduct(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        variant_id: Date.now() + Math.random(),
        sku: "",
        label: "",
        color: "",
        price: formData.price || 0,
        promotional_price: 0,
        effective_price: formData.price || 0,
        stock_total: 0,
        image_url: formData.images?.[0] || "",
        visible: true,
        weight: 0,
      }
    ])
  }

  const updateVariant = (index: number, field: string, value: any) => {
    const updated = [...variants]
    updated[index] = { 
      ...updated[index], 
      [field]: value 
    }
    
    // Calcular effective_price automáticamente
    if (field === 'price' || field === 'promotional_price') {
      const price = Number(updated[index].price) || 0
      const promotional_price = Number(updated[index].promotional_price) || 0
      updated[index].effective_price = promotional_price > 0 ? promotional_price : price
    }
    
    setVariants(updated)
  }

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Calcular valores agregados
      const totalStock = variants.reduce((sum, variant) => sum + (Number(variant.stock_total) || 0), 0)
      const prices = variants.map(v => Number(v.effective_price) || Number(v.price) || 0)
      const minPrice = variants.length > 0 ? Math.min(...prices) : formData.price

      const productData = {
        ...formData,
        stock: totalStock,
        quantity: totalStock,
        salePrice: minPrice,
        price: minPrice,
        variants: variants.map(variant => ({
          ...variant,
          // Asegurar que todos los campos numéricos sean números y manejar null
          price: Number(variant.price) || 0,
          promotional_price: variant.promotional_price ? Number(variant.promotional_price) : 0,
          effective_price: Number(variant.effective_price) || Number(variant.price) || 0,
          stock_total: Number(variant.stock_total) || 0,
          weight: Number(variant.weight) || 0,
        }))
      }

      console.log("Sending update:", productData)

      const response = await fetch("/api/products", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...productData, id: productId }),
      })

      if (response.ok) {
        toast.success("Producto actualizado correctamente")
        router.push("/admin/products")
      } else {
        const errorData = await response.json().catch(() => ({ error: "Error desconocido" }))
        throw new Error(errorData.error || "Error en la respuesta del servidor")
      }
    } catch (error) {
      console.error("Error updating product:", error)
      toast.error(error instanceof Error ? error.message : "Error al actualizar el producto")
    } finally {
      setLoading(false)
    }
  }

  if (loadingProduct) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="flex justify-center items-center py-12">
            <div>Cargando producto...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Editar Producto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Información Básica</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre del Producto *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="brand">Marca</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descripción *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Categoría</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Imágenes del Producto</Label>
                  <div className="mt-2 space-y-4">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <Upload className="h-4 w-4" />
                        <span className="text-sm">Seleccionar imágenes</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleMainImageUpload}
                          className="hidden"
                          disabled={uploadingMain}
                        />
                      </label>
                      {uploadingMain && (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm text-gray-600">Subiendo...</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Input
                        placeholder="https://ejemplo.com/imagen.jpg"
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            const input = e.target as HTMLInputElement
                            const url = input.value.trim()
                            if (url) {
                              setFormData(prev => ({
                                ...prev,
                                images: [...prev.images, url]
                              }))
                              input.value = ''
                            }
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const input = document.querySelector('input[placeholder="https://ejemplo.com/imagen.jpg"]') as HTMLInputElement
                          const url = input?.value.trim()
                          if (url) {
                            setFormData(prev => ({
                              ...prev,
                              images: [...prev.images, url]
                            }))
                            input.value = ''
                          }
                        }}
                      >
                        Agregar URL
                      </Button>
                    </div>

                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData.images.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`Imagen ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = '/placeholder.svg'
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => removeMainImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Precio Base</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>

            {/* Variantes */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Variantes</h3>
                <Button type="button" onClick={addVariant}>
                  Agregar Variante
                </Button>
              </div>

              {variants.map((variant, index) => (
                <Card key={variant.variant_id || index} className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Variante {index + 1}</h4>
                    {variants.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeVariant(index)}
                      >
                        Eliminar
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`sku-${index}`}>SKU</Label>
                      <Input
                        id={`sku-${index}`}
                        value={variant.sku || ""}
                        onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`label-${index}`}>Label</Label>
                      <Input
                        id={`label-${index}`}
                        value={variant.label || ""}
                        onChange={(e) => updateVariant(index, 'label', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`color-${index}`}>Color</Label>
                      <Input
                        id={`color-${index}`}
                        value={variant.color || ""}
                        onChange={(e) => updateVariant(index, 'color', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`price-${index}`}>Precio Regular</Label>
                      <Input
                        id={`price-${index}`}
                        type="number"
                        step="0.01"
                        value={variant.price || 0}
                        onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`promotional_price-${index}`}>Precio Promocional</Label>
                      <Input
                        id={`promotional_price-${index}`}
                        type="number"
                        step="0.01"
                        value={variant.promotional_price || 0}
                        onChange={(e) => updateVariant(index, 'promotional_price', parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`stock_total-${index}`}>Stock</Label>
                      <Input
                        id={`stock_total-${index}`}
                        type="number"
                        value={variant.stock_total || 0}
                        onChange={(e) => updateVariant(index, 'stock_total', parseInt(e.target.value) || 0)}
                      />
                    </div>

                    <div>
                      <Label>Imagen de la Variante</Label>
                      <div className="mt-2 space-y-2">
                        {variant.image_url ? (
                          <div className="relative inline-block">
                            <img
                              src={variant.image_url}
                              alt={`Variante ${index + 1}`}
                              className="w-20 h-20 object-cover rounded-lg border"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = '/placeholder.svg'
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => updateVariant(index, 'image_url', '')}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <label className="flex items-center gap-2 px-3 py-1 border border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-50">
                                <Upload className="h-3 w-3" />
                                <span className="text-xs">Subir</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleVariantImageUpload(index, e)}
                                  className="hidden"
                                  disabled={uploadingVariants[index]}
                                />
                              </label>
                              {uploadingVariants[index] && (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              )}
                            </div>
                            <div className="flex gap-1">
                              <Input
                                placeholder="URL de imagen"
                                className="flex-1 text-xs"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault()
                                    const input = e.target as HTMLInputElement
                                    const url = input.value.trim()
                                    if (url) {
                                      updateVariant(index, 'image_url', url)
                                      input.value = ''
                                    }
                                  }
                                }}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const input = document.querySelector(`input[placeholder="URL de imagen"]`) as HTMLInputElement
                                  const url = input?.value.trim()
                                  if (url) {
                                    updateVariant(index, 'image_url', url)
                                    input.value = ''
                                  }
                                }}
                              >
                                OK
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`weight-${index}`}>Peso (kg)</Label>
                      <Input
                        id={`weight-${index}`}
                        type="number"
                        step="0.01"
                        value={variant.weight || 0}
                        onChange={(e) => updateVariant(index, 'weight', parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`visible-${index}`}
                        checked={variant.visible !== false}
                        onChange={(e) => updateVariant(index, 'visible', e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor={`visible-${index}`}>Visible</Label>
                    </div>

                    <div>
                      <Label htmlFor={`effective_price-${index}`}>Precio Efectivo</Label>
                      <Input
                        id={`effective_price-${index}`}
                        type="number"
                        step="0.01"
                        value={variant.effective_price || 0}
                        disabled
                        className="bg-gray-100"
                      />
                      <p className="text-xs text-gray-500 mt-1">Calculado automáticamente</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Actualizando..." : "Actualizar Producto"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
