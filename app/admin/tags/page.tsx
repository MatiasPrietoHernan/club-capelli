"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2, Plus, Edit, Trash2, Upload, X, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { AdminHeader } from "@/components/admin/AdminHeader"

interface Category {
  _id: string
  name: string
  createdAt: string
  updatedAt: string
}

interface Brand {
  _id: string
  name: string
  image_url: string
  createdAt: string
  updatedAt: string
}

export default function TagsPage() {
  const [activeTab, setActiveTab] = useState("categories")

  // Search and pagination state - separate for each tab
  const [categoriesSearchQuery, setCategoriesSearchQuery] = useState("")
  const [brandsSearchQuery, setBrandsSearchQuery] = useState("")
  const [categoriesCurrentPage, setCategoriesCurrentPage] = useState(1)
  const [brandsCurrentPage, setBrandsCurrentPage] = useState(1)
  const [categoriesItemsPerPage, setCategoriesItemsPerPage] = useState(10)
  const [brandsItemsPerPage, setBrandsItemsPerPage] = useState(10)
  const [categoriesTotalItems, setCategoriesTotalItems] = useState(0)
  const [brandsTotalItems, setBrandsTotalItems] = useState(0)
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null)

  // Categories state
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  // Brands state
  const [brands, setBrands] = useState<Brand[]>([])
  const [loadingBrands, setLoadingBrands] = useState(true)
  const [newBrandName, setNewBrandName] = useState("")
  const [newBrandImage, setNewBrandImage] = useState("")
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const [uploadingBrandImage, setUploadingBrandImage] = useState(false)

  // Load initial data for active tab
  useEffect(() => {
    if (activeTab === "categories") {
      loadCategories()
    } else {
      loadBrands()
    }
  }, [])

  // Separate handlers for each tab
  const handleCategoriesSearch = (query: string) => {
    setCategoriesSearchQuery(query)
    setCategoriesCurrentPage(1)

    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    setDebounceTimer(
      setTimeout(() => {
        loadCategories()
      }, 300)
    )
  }

  const handleBrandsSearch = (query: string) => {
    setBrandsSearchQuery(query)
    setBrandsCurrentPage(1)

    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    setDebounceTimer(
      setTimeout(() => {
        loadBrands()
      }, 300)
    )
  }

  // Tab change handler
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setDebounceTimer(null)

    if (tab === "categories") {
      loadCategories()
    } else {
      loadBrands()
    }
  }

  const buildCategoriesQueryString = () => {
    const params = new URLSearchParams()
    if (categoriesSearchQuery.trim()) {
      params.append("search", categoriesSearchQuery.trim())
    }
    params.append("page", categoriesCurrentPage.toString())
    params.append("limit", categoriesItemsPerPage.toString())
    return params.toString()
  }

  const buildBrandsQueryString = () => {
    const params = new URLSearchParams()
    if (brandsSearchQuery.trim()) {
      params.append("search", brandsSearchQuery.trim())
    }
    params.append("page", brandsCurrentPage.toString())
    params.append("limit", brandsItemsPerPage.toString())
    return params.toString()
  }

  const loadCategories = async () => {
    setLoadingCategories(true)
    try {
      const queryString = buildCategoriesQueryString()
      const response = await fetch(`/api/tags/categories?${queryString}`)
      const data = await response.json()
      if (response.ok) {
        setCategories(data.categories || [])
        setCategoriesTotalItems(data.total || 0)
      } else {
        toast.error(data.error || "Error al cargar categorías")
      }
    } catch (error) {
      toast.error("Error al cargar categorías")
    } finally {
      setLoadingCategories(false)
    }
  }

  const loadBrands = async () => {
    setLoadingBrands(true)
    try {
      const queryString = buildBrandsQueryString()
      const response = await fetch(`/api/tags/brands?${queryString}`)
      const data = await response.json()
      if (response.ok) {
        setBrands(data.brands || [])
        setBrandsTotalItems(data.total || 0)
      } else {
        toast.error(data.error || "Error al cargar marcas")
      }
    } catch (error) {
      toast.error("Error al cargar marcas")
    } finally {
      setLoadingBrands(false)
    }
  }

  // Category operations
  const createCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("El nombre de la categoría es requerido")
      return
    }

    try {
      const response = await fetch("/api/tags/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName.trim() })
      })

      const data = await response.json()
      if (response.ok) {
        toast.success("Categoría creada correctamente")
        setNewCategoryName("")
        loadCategories()
      } else {
        toast.error(data.error || "Error al crear categoría")
      }
    } catch (error) {
      toast.error("Error al crear categoría")
    }
  }

  const updateCategory = async () => {
    if (!editingCategory || !newCategoryName.trim()) return

    try {
      const response = await fetch("/api/tags/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingCategory._id, name: newCategoryName.trim() })
      })

      const data = await response.json()
      if (response.ok) {
        toast.success("Categoría actualizada correctamente")
        setNewCategoryName("")
        setEditingCategory(null)
        loadCategories()
      } else {
        toast.error(data.error || "Error al actualizar categoría")
      }
    } catch (error) {
      toast.error("Error al actualizar categoría")
    }
  }

  const deleteCategory = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta categoría?")) return

    try {
      const response = await fetch(`/api/tags/categories?id=${id}`, { method: "DELETE" })
      const data = await response.json()

      if (response.ok) {
        toast.success("Categoría eliminada correctamente")
        loadCategories()
      } else {
        toast.error(data.error || "Error al eliminar categoría")
      }
    } catch (error) {
      toast.error("Error al eliminar categoría")
    }
  }

  // Brand operations
  const uploadImage = async (file: File): Promise<string | null> => {
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
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
      toast.error("Error subiendo imagen")
      return null
    }
  }

  const handleBrandImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingBrandImage(true)

    const url = await uploadImage(file)
    if (url) {
      setNewBrandImage(url)
    }

    setUploadingBrandImage(false)
    e.target.value = ""
  }

  const createBrand = async () => {
    if (!newBrandName.trim()) {
      toast.error("El nombre de la marca es requerido")
      return
    }

    try {
      const response = await fetch("/api/tags/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newBrandName.trim(), image_url: newBrandImage })
      })

      const data = await response.json()
      if (response.ok) {
        toast.success("Marca creada correctamente")
        setNewBrandName("")
        setNewBrandImage("")
        loadBrands()
      } else {
        toast.error(data.error || "Error al crear marca")
      }
    } catch (error) {
      toast.error("Error al crear marca")
    }
  }

  const updateBrand = async () => {
    if (!editingBrand || !newBrandName.trim()) return

    try {
      const response = await fetch("/api/tags/brands", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingBrand._id,
          name: newBrandName.trim(),
          image_url: newBrandImage
        })
      })

      const data = await response.json()
      if (response.ok) {
        toast.success("Marca actualizada correctamente")
        setNewBrandName("")
        setNewBrandImage("")
        setEditingBrand(null)
        loadBrands()
      } else {
        toast.error(data.error || "Error al actualizar marca")
      }
    } catch (error) {
      toast.error("Error al actualizar marca")
    }
  }

  const deleteBrand = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta marca?")) return

    try {
      const response = await fetch(`/api/tags/brands?id=${id}`, { method: "DELETE" })
      const data = await response.json()

      if (response.ok) {
        toast.success("Marca eliminada correctamente")
        loadBrands()
      } else {
        toast.error(data.error || "Error al eliminar marca")
      }
    } catch (error) {
      toast.error("Error al eliminar marca")
    }
  }

  // Pagination helpers - separate for each tab
  const categoriesTotalPages = Math.ceil(categoriesTotalItems / categoriesItemsPerPage)
  const categoriesStartItem = (categoriesCurrentPage - 1) * categoriesItemsPerPage + 1
  const categoriesEndItem = Math.min(categoriesCurrentPage * categoriesItemsPerPage, categoriesTotalItems)

  const brandsTotalPages = Math.ceil(brandsTotalItems / brandsItemsPerPage)
  const brandsStartItem = (brandsCurrentPage - 1) * brandsItemsPerPage + 1
  const brandsEndItem = Math.min(brandsCurrentPage * brandsItemsPerPage, brandsTotalItems)

  const goToCategoriesPage = (page: number) => {
    if (page >= 1 && page <= categoriesTotalPages) {
      setCategoriesCurrentPage(page)
      setTimeout(() => loadCategories(), 0)
    }
  }

  const goToBrandsPage = (page: number) => {
    if (page >= 1 && page <= brandsTotalPages) {
      setBrandsCurrentPage(page)
      setTimeout(() => loadBrands(), 0)
    }
  }

  const handleCategoriesItemsPerPageChange = (value: string) => {
    setCategoriesItemsPerPage(parseInt(value))
    setCategoriesCurrentPage(1)
    setTimeout(() => loadCategories(), 0)
  }

  const handleBrandsItemsPerPageChange = (value: string) => {
    setBrandsItemsPerPage(parseInt(value))
    setBrandsCurrentPage(1)
    setTimeout(() => loadBrands(), 0)
  }

  return (
    <>
    <AdminHeader/>
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Marcas y Categorías</h1>
        <p className="text-gray-600">Administra las marcas y categorías de tus productos</p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="categories">Categorías</TabsTrigger>
          <TabsTrigger value="brands">Marcas</TabsTrigger>
        </TabsList>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Categorías</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add/Edit Category Form */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <Label htmlFor="categoryName">Nombre de la Categoría</Label>
                  <Input
                    id="categoryName"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Ej: Ropa, Accesorios, etc."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        editingCategory ? updateCategory() : createCategory()
                      }
                    }}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={editingCategory ? updateCategory : createCategory}
                    disabled={!newCategoryName.trim()}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {editingCategory ? "Actualizar" : "Agregar"}
                  </Button>
                  {editingCategory && (
                    <Button
                      variant="outline"
                      className="ml-2"
                      onClick={() => {
                        setEditingCategory(null)
                        setNewCategoryName("")
                      }}
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>

              {/* Filters and Search */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
                <div className="flex gap-4 items-center flex-1">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar categorías..."
                      value={categoriesSearchQuery}
                      onChange={(e) => handleCategoriesSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={categoriesItemsPerPage.toString()} onValueChange={handleCategoriesItemsPerPageChange}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-gray-600 whitespace-nowrap">
                    por página
                  </span>
                </div>

                {categoriesTotalItems > 0 && (
                  <div className="text-sm text-gray-600">
                    {categoriesStartItem}-{categoriesEndItem} de {categoriesTotalItems} elemento{categoriesTotalItems !== 1 ? 's' : ''}
                  </div>
                )}
              </div>

              {/* Categories List */}
              {loadingCategories ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="grid gap-3">
                  {categories.map((category) => (
                    <Card key={category._id} className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{category.name}</span>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingCategory(category)
                              setNewCategoryName(category.name)
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteCategory(category._id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {categories.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No hay categorías registradas
                    </div>
                  )}
                </div>
              )}

              {/* Pagination */}
              {categoriesTotalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToCategoriesPage(categoriesCurrentPage - 1)}
                      disabled={categoriesCurrentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Anterior
                    </Button>
                    <span className="text-sm text-gray-600 px-2">
                      Página {categoriesCurrentPage} de {categoriesTotalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToCategoriesPage(categoriesCurrentPage + 1)}
                      disabled={categoriesCurrentPage === categoriesTotalPages}
                    >
                      Siguiente
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Brands Tab */}
        <TabsContent value="brands" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Marcas</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add/Edit Brand Form */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="brandName">Nombre de la Marca</Label>
                    <Input
                      id="brandName"
                      value={newBrandName}
                      onChange={(e) => setNewBrandName(e.target.value)}
                      placeholder="Ej: Nike, Adidas, etc."
                    />
                  </div>
                  <div>
                    <Label>Imagen de la Marca</Label>
                    <div className="mt-2 flex gap-2">
                      <label className="flex items-center gap-2 px-3 py-1 border border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-50">
                        <Upload className="h-3 w-3" />
                        <span className="text-xs">Subir imagen</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleBrandImageUpload}
                          className="hidden"
                          disabled={uploadingBrandImage}
                        />
                      </label>
                      {uploadingBrandImage && (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      )}
                    </div>
                    {newBrandImage && (
                      <div className="mt-2 relative inline-block">
                        <img
                          src={newBrandImage}
                          alt="Vista previa"
                          className="w-16 h-16 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => setNewBrandImage("")}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={editingBrand ? updateBrand : createBrand}
                    disabled={!newBrandName.trim()}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {editingBrand ? "Actualizar" : "Agregar"}
                  </Button>
                  {editingBrand && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingBrand(null)
                        setNewBrandName("")
                        setNewBrandImage("")
                      }}
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>

              {/* Filters and Search */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
                <div className="flex gap-4 items-center flex-1">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar marcas..."
                      value={brandsSearchQuery}
                      onChange={(e) => handleBrandsSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={brandsItemsPerPage.toString()} onValueChange={handleBrandsItemsPerPageChange}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-gray-600 whitespace-nowrap">
                    por página
                  </span>
                </div>

                {brandsTotalItems > 0 && (
                  <div className="text-sm text-gray-600">
                    {brandsStartItem}-{brandsEndItem} de {brandsTotalItems} elemento{brandsTotalItems !== 1 ? 's' : ''}
                  </div>
                )}
              </div>

              {/* Brands List */}
              {loadingBrands ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="grid gap-3">
                  {brands.map((brand) => (
                    <Card key={brand._id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {brand.image_url && (
                            <img
                              src={brand.image_url}
                              alt={brand.name}
                              className="w-8 h-8 object-cover rounded"
                            />
                          )}
                          <span className="font-medium">{brand.name}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingBrand(brand)
                              setNewBrandName(brand.name)
                              setNewBrandImage(brand.image_url)
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteBrand(brand._id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {brands.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No hay marcas registradas
                    </div>
                  )}
                </div>
              )}

              {/* Pagination */}
              {brandsTotalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToBrandsPage(brandsCurrentPage - 1)}
                      disabled={brandsCurrentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Anterior
                    </Button>
                    <span className="text-sm text-gray-600 px-2">
                      Página {brandsCurrentPage} de {brandsTotalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToBrandsPage(brandsCurrentPage + 1)}
                      disabled={brandsCurrentPage === brandsTotalPages}
                    >
                      Siguiente
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </>
  )
}
