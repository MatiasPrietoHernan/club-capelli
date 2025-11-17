"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, X } from "lucide-react"
import { useState } from "react"
import { formatPrice } from "@/lib/formatPrice"

interface ProductFiltersProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  brands: string[]
  selectedBrand: string
  onBrandChange: (brand: string) => void
  searchTerm: string
  onSearchChange: (term: string) => void
  priceFilter: string
  onPriceFilterChange: (filter: string) => void
  maxPrice: number
  onMaxPriceChange: (price: number) => void
}

export function ProductFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  brands,
  selectedBrand,
  onBrandChange,
  searchTerm,
  onSearchChange,
  priceFilter,
  onPriceFilterChange,
  maxPrice,
  onMaxPriceChange,
}: ProductFiltersProps) {
  const [showCategories, setShowCategories] = useState(false)
  const [showBrands, setShowBrands] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const [tempCategory, setTempCategory] = useState(selectedCategory)
  const [tempBrand, setTempBrand] = useState(selectedBrand)
  const [tempPriceFilter, setTempPriceFilter] = useState(priceFilter)
  const [tempMaxPrice, setTempMaxPrice] = useState(maxPrice)

  const priceOptions = [
    { value: "all", label: "Todos los precios" },
    { value: "low-to-high", label: "Menor a mayor" },
    { value: "high-to-low", label: "Mayor a menor" },
    { value: "under-limit", label: "Precio límite" },
  ]

  const applyCategoryFilters = () => {
    onCategoryChange(tempCategory)
    setShowCategories(false)
  }

  const applyBrandFilters = () => {
    onBrandChange(tempBrand)
    setShowBrands(false)
  }

  const applyPriceFilters = () => {
    onPriceFilterChange(tempPriceFilter)
    onMaxPriceChange(tempMaxPrice)
    setShowFilters(false)
  }

  const handleCategoriesToggle = () => {
    if (!showCategories) {
      setTempCategory(selectedCategory)
    }
    setShowCategories(!showCategories)
  }

  const handleBrandsToggle = () => {
    if (!showBrands) {
      setTempBrand(selectedBrand)
    }
    setShowBrands(!showBrands)
  }

  const handleFiltersToggle = () => {
    if (!showFilters) {
      setTempPriceFilter(priceFilter)
      setTempMaxPrice(maxPrice)
    }
    setShowFilters(!showFilters)
  }

  return (
    <div className="mb-6 space-y-4 max-w-3xl mx-auto">
     <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 h-12 rounded-xl bg-card  shadow-sm focus:shadow-md  focus-visible:ring-orange-500 transition-shadow text-base"
        />
      </div>

      <div className="flex items-center justify-center gap-3">
        <Button
          variant="outline"
          onClick={handleCategoriesToggle}
          className={`rounded-xl shadow-sm transition-all ${
            selectedCategory !== "all"
              ? "bg-primary text-primary-foreground border-primary hover:bg-orange-500 hover:text-primary-foreground"
              : "hover:border-orange-500"
          }`}
        >
          <Filter className="h-4 w-4 mr-2" />
          Categorías
        </Button>
        <Button
          variant="outline"
          onClick={handleFiltersToggle}
          className={`rounded-xl shadow-sm transition-all ${
            priceFilter !== "all"
              ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:text-primary-foreground"
              : "hover:border-orange-500"
          }`}
        >
          <Filter className="h-4 w-4 mr-2" />
          Precio
        </Button>

        {(selectedCategory !== "all" || selectedBrand !== "all" || priceFilter !== "all") && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              onCategoryChange("all")
              onBrandChange("all")
              onPriceFilterChange("all")
              onMaxPriceChange(0)
              setTempCategory("all")
              setTempBrand("all")
              setTempPriceFilter("all")
              setTempMaxPrice(0)
            }}
            className="rounded-xl hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {showCategories && (
        <div className="bg-card border border-border rounded-xl p-5 shadow-lg max-w-md mx-auto z-[9999] relative animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-base">Filtrar por categoría</h3>

            <div className="grid grid-cols-2 gap-2.5">
              {categories.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-2.5 cursor-pointer p-2.5 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <input
                    type="radio"
                    name="categoryFilter"
                    value={category}
                    checked={tempCategory === category}
                    onChange={(e) => setTempCategory(e.target.value)}
                    className="text-primary focus:ring-primary w-4 h-4"
                  />
                  <span className="text-sm text-foreground truncate">{category === "all" ? "Todos" : category}</span>
                </label>
              ))}
            </div>

            <Button onClick={applyCategoryFilters} className="w-full rounded-lg shadow-sm border border-orange-500 bg-transparent hover:bg-orange-600 text-orange-500 hover:text-primary-foreground">
              Aplicar filtros
            </Button>
          </div>
        </div>
      )}

      {showFilters && (
        <div className="bg-card border border-border rounded-xl p-5 shadow-lg max-w-md mx-auto z-[9999] relative animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-base">Filtrar por precio</h3>

            <div className="grid grid-cols-2 gap-2.5">
              {priceOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2.5 cursor-pointer p-2.5 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <input
                    type="radio"
                    name="priceFilter"
                    value={option.value}
                    checked={tempPriceFilter === option.value}
                    onChange={(e) => setTempPriceFilter(e.target.value)}
                    className="text-primary focus:ring-primary w-4 h-4"
                  />
                  <span className="text-sm text-foreground truncate">{option.label}</span>
                </label>
              ))}
            </div>

            {tempPriceFilter === "under-limit" && (
              <div className="pt-3 border-t border-border">
                <label className="block text-sm text-muted-foreground mb-2 font-medium">Precio máximo</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm font-medium">
                    $
                  </span>
                  <Input
                    type="text"
                    placeholder="0"
                    value={formatPrice(tempMaxPrice) || ""}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/\./g, "")
                      setTempMaxPrice(
                        e.target.value === "" ? 0 : !isNaN(Number(numericValue)) ? Number(numericValue) : tempMaxPrice,
                      )
                    }}
                    onBlur={(e) => {
                      const numericValue = e.target.value.replace(/\./g, "")
                      if (!isNaN(Number(numericValue))) {
                        setTempMaxPrice(
                          e.target.value === ""
                            ? 0
                            : !isNaN(Number(numericValue))
                              ? Number(numericValue)
                              : tempMaxPrice,
                        )
                      }
                    }}
                    className="pl-8 rounded-lg"
                    min="0"
                  />
                </div>
              </div>
            )}

            <Button onClick={applyPriceFilters} className="w-full rounded-lg shadow-sm border border-orange-500 bg-transparent hover:bg-orange-600 text-orange-500 hover:text-primary-foreground">
              Aplicar filtros
            </Button>
          </div>
        </div>
      )}

      {(showCategories || showBrands || showFilters) && (
        <div
          className="fixed inset-0 bg-black/20 z-[9998] animate-in fade-in duration-200"
          onClick={() => {
            setShowCategories(false)
            setShowFilters(false)
          }}
        />
      )}
    </div>
  )
}
