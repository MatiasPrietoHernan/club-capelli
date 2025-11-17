"use client"

import { useState, useEffect, useRef } from "react"
import { ProductCardSkeleton } from "./whatsapp-product-card-skeleton"
import { ProductFilters } from "./product-filters"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import type { ApiListResponse } from "@/types/IWhatsappProductCatalog"
import type { IProduct } from "@/lib/models/product"
import { ProductCard } from "./whatsapp-product-card"

type ApiCategories = { categories: { name: string; count: number }[] }

function useDebounce<T>(value: T, delay = 450) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

export function ProductCatalog() {
  const [products, setProducts] = useState<IProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  const [categories, setCategories] = useState<string[]>([])
  const [brands, setBrands] = useState<string[]>([])
  const [filterPrice, setFilterPrice] = useState<string>("all")
  const [maxPrice, setMaxPrice] = useState<number>(0)
  const [catLoading, setCatLoading] = useState(true)

  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedBrand, setSelectedBrand] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearch = useDebounce(searchTerm, 450)

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 14

  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        setCatLoading(true)
        const [categoriesRes, brandsRes] = await Promise.all([
          fetch("/api/tags/categories"),
          fetch("/api/tags/brands")
        ])

        const categoriesData: ApiCategories = await categoriesRes.json()
        console.log('Categories data:', categoriesData)

        const brandsData = await brandsRes.json()
        console.log('Brands data:', brandsData)

        const categoryNames = categoriesData.categories?.map((c) => c.name) ?? []
        const brandNames = brandsData.brands?.map((b: any) => b.name) ?? []
        console.log('Brand names:', brandNames)

        setCategories(["all", ...categoryNames])
        setBrands(["all", ...brandNames])
      } catch {
        setCategories(["all"])
        setBrands(["all"])
      } finally {
        setCatLoading(false)
      }
    })()

    fetchPage(1, true, debouncedSearch)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!initialLoading) {
      setProducts([])
      setPage(1)
      fetchPage(1, true, debouncedSearch)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedBrand, debouncedSearch, initialLoading, filterPrice])

  async function fetchPage(nextPage: number, replace = false, qOverride?: string) {
    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl

    const params = new URLSearchParams()
    params.set("page", String(nextPage))
    params.set("limit", String(limit))
    if (filterPrice !== "all" && filterPrice !== "under-limit") params.set("priceFilter", filterPrice)
    if (filterPrice === "under-limit" && maxPrice > 0) params.set("maxPrice", String(maxPrice))

    const q = qOverride ?? debouncedSearch
    if (q) params.set("q", q)
    if (selectedCategory && selectedCategory !== "all") params.set("category", selectedCategory)
    if (selectedBrand && selectedBrand !== "all") params.set("brand", selectedBrand)

    try {
      if (replace || nextPage === 1) setLoading(true)
      else setLoadingMore(true)

      const res = await fetch(`/api/products?${params.toString()}`, {
        signal: ctrl.signal,
      })
      const raw = await res.json()

      if (Array.isArray(raw)) {
        const mapped = raw as IProduct[]
        if (replace) {
          setProducts(mapped)
        } else {
          setProducts((prev) => {
            const seen = new Set(prev.map((p) => p._id))
            const toAdd = mapped.filter((p) => !seen.has(p._id))
            return [...prev, ...toAdd]
          })
        }
        setTotalPages(1)
        setPage(1)
      } else {
        const data = raw as ApiListResponse
        const mapped = (data.items ?? []) as IProduct[]

        if (replace) {
          setProducts(mapped)
        } else {
          setProducts((prev) => {
            const seen = new Set(prev.map((p) => p._id))
            const toAdd = mapped.filter((p) => !seen.has(p._id))
            return [...prev, ...toAdd]
          })
        }

        setTotalPages(data.totalPages || 1)
        setPage(nextPage)
      }
    } catch (err: any) {
      if (err?.name !== "AbortError") console.error("Error fetching products:", err)
    } finally {
      setLoading(false)
      setLoadingMore(false)
      setInitialLoading(false)
    }
  }

  const hasMore = page < totalPages

  return (
    <div className="catalog-pattern-bg min-h-screen pt-24 pb-12">
      <div className="px-4 mb-6 relative  mt-6">
        <ProductFilters
          priceFilter={filterPrice}
          onPriceFilterChange={setFilterPrice}
          maxPrice={maxPrice}
          onMaxPriceChange={setMaxPrice}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          brands={brands}
          selectedBrand={selectedBrand}
          onBrandChange={setSelectedBrand}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>

      <div className="relative px-4 max-w-7xl mx-auto">
        {initialLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(limit)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {loading && !initialLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 opacity-60">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!initialLoading && (
          <>
            {products && products.length === 0 && !loading ? (
              <div className="text-center py-20">
                <div className="bg-white rounded-xl p-8 mx-4 shadow-sm border border-border max-w-md mx-auto">
                  <p className="text-muted-foreground text-lg mb-4">No se encontraron productos</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCategory("all")
                      setSelectedBrand("all")
                      setSearchTerm("")
                      setFilterPrice("all")
                      setMaxPrice(0)
                    }}
                  >
                    Limpiar filtros
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div
                  className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ${
                    loading ? "opacity-50" : ""
                  }`}
                >
                  {products.map((p) => (
                    <ProductCard key={p._id} product={p} />
                  ))}
                </div>

                <div className="flex justify-center pt-8 pb-4">
                  {hasMore ? (
                    <Button
                      onClick={() => fetchPage(page + 1)}
                      disabled={loadingMore}
                      variant="outline"
                      size="lg"
                      className="shadow-sm"
                    >
                      {loadingMore ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Cargando…
                        </>
                      ) : (
                        "Cargar más productos"
                      )}
                    </Button>
                  ) : products.length > 0 ? (
                    <span className="text-sm text-muted-foreground bg-muted px-4 py-2 rounded-full">
                      No hay más productos
                    </span>
                  ) : null}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
