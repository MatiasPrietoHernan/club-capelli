"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, Search, Check, X } from "lucide-react"

export interface Category {
  _id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface Brand {
  _id: string
  name: string
  image_url: string
  createdAt: string
  updatedAt: string
}

interface TagSelectorsProps {
  selectedCategory?: string
  selectedBrand?: string
  onCategoryChange: (category: string) => void
  onBrandChange: (brand: string) => void
  className?: string
}

export function TagSelectors({
  selectedCategory = "",
  selectedBrand = "",
  onCategoryChange,
  onBrandChange,
  className = ""
}: TagSelectorsProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)

  // Category modal state
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [categorySearchTerm, setCategorySearchTerm] = useState("")
  const [selectedModalCategory, setSelectedModalCategory] = useState<Category | null>(null)

  // Brand modal state
  const [brandModalOpen, setBrandModalOpen] = useState(false)
  const [brandSearchTerm, setBrandSearchTerm] = useState("")
  const [selectedModalBrand, setSelectedModalBrand] = useState<Brand | null>(null)

  useEffect(() => {
    loadTags()
  }, [])

  // Set selected category when available
  useEffect(() => {
    if (selectedCategory && categories.length > 0) {
      const category = categories.find(c => c.name === selectedCategory) || null
      setSelectedModalCategory(category)
      if (!category && selectedCategory) {
        // Category not found, clear the selection
        onCategoryChange("")
      }
    } else if (!selectedCategory && selectedModalCategory) {
      setSelectedModalCategory(null)
    }
  }, [selectedCategory, categories, selectedModalCategory])

  // Set selected brand when available
  useEffect(() => {
    if (selectedBrand && brands.length > 0) {
      const brand = brands.find(b => b.name === selectedBrand) || null
      setSelectedModalBrand(brand)
      if (!brand && selectedBrand) {
        // Brand not found, clear the selection
        onBrandChange("")
      }
    } else if (!selectedBrand && selectedModalBrand) {
      setSelectedModalBrand(null)
    }
  }, [selectedBrand, brands, selectedModalBrand])

  const loadTags = async () => {
    try {
      const [categoriesRes, brandsRes] = await Promise.all([
        fetch("/api/tags/categories?limit=1000"), // Load all categories
        fetch("/api/tags/brands?limit=1000") // Load all brands
      ])

      const [categoriesData, brandsData] = await Promise.all([
        categoriesRes.json(),
        brandsRes.json()
      ])

      if (categoriesRes.ok && categoriesData.categories) {
        setCategories(categoriesData.categories)
      } else {
        setCategories([])
      }

      if (brandsRes.ok && brandsData.brands) {
        setBrands(brandsData.brands)
      } else {
        setBrands([])
      }
    } catch (error) {
      console.error("Error loading tags:", error)
      setCategories([])
      setBrands([])
    } finally {
      setLoading(false)
    }
  }

  const handleCategorySelect = (category: Category) => {
    setSelectedModalCategory(category)
    setCategoryModalOpen(false)
    setCategorySearchTerm("")
    onCategoryChange(category.name)
  }

  const handleBrandSelect = (brand: Brand) => {
    setSelectedModalBrand(brand)
    setBrandModalOpen(false)
    setBrandSearchTerm("")
    onBrandChange(brand.name)
  }

  const handleClearCategory = () => {
    setSelectedModalCategory(null)
    onCategoryChange("")
  }

  const handleClearBrand = () => {
    setSelectedModalBrand(null)
    onBrandChange("")
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
  )

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(brandSearchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-gray-600">Cargando...</span>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      <div>
        <Label htmlFor="category-input">Categoría</Label>
        <div className="flex gap-2">
          <Input
            id="category-input"
            value={selectedModalCategory?.name || ""}
            placeholder="Seleccione una categoría"
            readOnly
            onClick={() => setCategoryModalOpen(true)}
            className="cursor-pointer"
          />
          <Dialog open={categoryModalOpen} onOpenChange={setCategoryModalOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="outline" size="sm">
                <Search className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Seleccionar Categoría</DialogTitle>
                <DialogDescription>
                  Busque y seleccione una categoría de la lista
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Search bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar categoría..."
                    value={categorySearchTerm}
                    onChange={(e) => setCategorySearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Selected category display */}
                {selectedModalCategory && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-blue-800">
                          {selectedModalCategory.name}
                        </span>
                        <Check className="h-4 w-4 text-blue-600" />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleClearCategory}
                        className="text-red-600 hover:text-red-800"
                      >
                        Limpiar
                      </Button>
                    </div>
                  </div>
                )}

                {/* Categories list */}
                <div className="max-h-64 overflow-y-auto">
                  {filteredCategories.length > 0 ? (
                    <div className="space-y-1">
                      {filteredCategories.map((category) => (
                        <div
                          key={category._id}
                          className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                            selectedModalCategory?._id === category._id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200"
                          }`}
                          onClick={() => handleCategorySelect(category)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-medium">{category.name}</div>
                              <div className="text-sm text-gray-500">
                                ID: {category._id.slice(-8)}
                              </div>
                            </div>
                            {selectedModalCategory?._id === category._id && (
                              <Check className="h-5 w-5 text-blue-600" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      {categorySearchTerm
                        ? "No se encontraron categorías"
                        : "No hay categorías disponibles"
                      }
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
          {selectedModalCategory && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClearCategory}
              className="px-2"
            >
              ×
            </Button>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="brand-input">Marca</Label>
        <div className="flex gap-2">
          <Input
            id="brand-input"
            value={selectedModalBrand?.name || ""}
            placeholder="Seleccione una marca"
            readOnly
            onClick={() => setBrandModalOpen(true)}
            className="cursor-pointer"
          />
          <Dialog open={brandModalOpen} onOpenChange={setBrandModalOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="outline" size="sm">
                <Search className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Seleccionar Marca</DialogTitle>
                <DialogDescription>
                  Busque y seleccione una marca de la lista
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Search bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar marca..."
                    value={brandSearchTerm}
                    onChange={(e) => setBrandSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Selected brand display */}
                {selectedModalBrand && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {selectedModalBrand.image_url && (
                          <img
                            src={selectedModalBrand.image_url}
                            alt={selectedModalBrand.name}
                            className="w-6 h-6 object-cover rounded"
                          />
                        )}
                        <span className="font-medium text-green-800">
                          {selectedModalBrand.name}
                        </span>
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleClearBrand}
                        className="text-red-600 hover:text-red-800"
                      >
                        Limpiar
                      </Button>
                    </div>
                  </div>
                )}

                {/* Brands list */}
                <div className="max-h-64 overflow-y-auto">
                  {filteredBrands.length > 0 ? (
                    <div className="space-y-1">
                      {filteredBrands.map((brand) => (
                        <div
                          key={brand._id}
                          className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                            selectedModalBrand?._id === brand._id
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200"
                          }`}
                          onClick={() => handleBrandSelect(brand)}
                        >
                          <div className="flex items-center gap-3">
                            {brand.image_url && (
                              <img
                                src={brand.image_url}
                                alt={brand.name}
                                className="w-8 h-8 object-cover rounded"
                              />
                            )}
                            <div className="flex-1">
                              <div className="font-medium">{brand.name}</div>
                              <div className="text-sm text-gray-500">
                                ID: {brand._id.slice(-8)}
                              </div>
                            </div>
                            {selectedModalBrand?._id === brand._id && (
                              <Check className="h-5 w-5 text-green-600" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      {brandSearchTerm
                        ? "No se encontraron marcas"
                        : "No hay marcas disponibles"
                      }
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
          {selectedModalBrand && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClearBrand}
              className="px-2"
            >
              ×
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
