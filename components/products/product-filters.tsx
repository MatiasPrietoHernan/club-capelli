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
  searchTerm,
  onSearchChange,
  priceFilter,
  onPriceFilterChange,
  maxPrice,
  onMaxPriceChange,
}: ProductFiltersProps) {
  const [showCategories, setShowCategories] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const [tempCategory, setTempCategory] = useState(selectedCategory)
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

  const handleFiltersToggle = () => {
    if (!showFilters) {
      setTempPriceFilter(priceFilter)
      setTempMaxPrice(maxPrice)
    }
    setShowFilters(!showFilters)
  }

  return (
    <div className="mb-6 space-y-3">
      {/* Search Bar - WhatsApp style */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 rounded-full border-gray-200 bg-gray-50 focus:bg-white transition-colors"
        />
      </div>

      {/* Filter Controls - Compact WhatsApp style */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCategoriesToggle}
          className={`rounded-full border-gray-200 hover:bg-gray-50 ${selectedCategory !== "all" ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-white text-gray-700"
            }`}
        >
          <Filter className="h-4 w-4 mr-1" />
          Categorías
        </Button>

        {/* Price Filter Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleFiltersToggle}
          className={`rounded-full border-gray-200 hover:bg-gray-50 ${priceFilter !== "all" ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-white text-gray-700"
            }`}
        >
          <Filter className="h-4 w-4 mr-1" />
          Precio
        </Button>

        {/* Clear Filters */}
        {(selectedCategory !== "all" || priceFilter !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onCategoryChange("all")
              onPriceFilterChange("all")
              onMaxPriceChange(0)
              setTempCategory("all")
              setTempPriceFilter("all")
              setTempMaxPrice(0)
            }}
            className="rounded-full text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {showCategories && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm max-w-md mx-auto z-[9999] relative">
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900 text-sm">Filtrar por categoría</h3>

            {/* Category Options in 2 columns */}
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <label key={category} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="categoryFilter"
                    value={category}
                    checked={tempCategory === category}
                    onChange={(e) => setTempCategory(e.target.value)}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700 truncate">{category === "all" ? "Todos" : category}</span>
                </label>
              ))}
            </div>

            {/* Apply Button */}
            <Button
              onClick={applyCategoryFilters}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-sm"
              size="sm"
            >
              Aplicar filtros
            </Button>
          </div>
        </div>
      )}

      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm max-w-md mx-auto z-[9999] relative">
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900 text-sm">Filtrar por precio</h3>

            <div className="grid grid-cols-2 gap-2">
              {priceOptions.map((option) => (
                <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="priceFilter"
                    value={option.value}
                    checked={tempPriceFilter === option.value}
                    onChange={(e) => setTempPriceFilter(e.target.value)}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700 truncate">{option.label}</span>
                </label>
              ))}
            </div>

            {/* Price Limit Input */}
            {tempPriceFilter === "under-limit" && (
              <div className="pt-2 border-t border-gray-100">
                <label className="block text-sm text-gray-600 mb-1">Precio máximo</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                  <Input
                    type="text"
                    placeholder="0"
                    value={formatPrice(tempMaxPrice) || ""}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/\./g, '');
                      setTempMaxPrice(e.target.value === "" ? 0 : !isNaN(Number(numericValue)) ? Number(numericValue) : tempMaxPrice);
                    }}
                    onBlur={(e) => {
                      const numericValue = e.target.value.replace(/\./g, '');
                      if (!isNaN(Number(numericValue))) {
                        setTempMaxPrice(e.target.value === "" ? 0 : !isNaN(Number(numericValue)) ? Number(numericValue) : tempMaxPrice);
                      }
                    }}
                    className="pl-8 text-sm"
                    min="0"
                  />
                </div>
              </div>
            )}

            {/* Apply Button */}
            <Button
              onClick={applyPriceFilters}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-sm"
              size="sm"
            >
              Aplicar filtros
            </Button>
          </div>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {(showCategories || showFilters) && (
        <div
          className="fixed inset-0 z-[9998]"
          onClick={() => {
            setShowCategories(false)
            setShowFilters(false)
          }}
        />
      )}
    </div>
  )
}
