"use client"

import { useState, useEffect, useRef } from "react"
import { WhatsAppProductCard } from "./whatsapp-product-card"
import { WhatsAppProductCardSkeleton } from "./whatsapp-product-card-skeleton"
import { ProductFilters } from "./product-filters"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import type { ApiListResponse } from "@/types/IWhatsappProductCatalog"
import { IProduct } from "@/lib/models/product"

type ApiCategories = { categories: { name: string; count: number }[] }

// ------- debounce simple (espera antes de disparar fetch) -------
function useDebounce<T>(value: T, delay = 450) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

export function WhatsAppProductCatalog() {
  const [products, setProducts] = useState<IProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  // categorías globales
  const [categories, setCategories] = useState<string[]>([])
  const [filterPrice, setFilterPrice] = useState<string>("all")
  const [maxPrice, setMaxPrice] = useState<number>(0)
  const [catLoading, setCatLoading] = useState(true)

  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearch = useDebounce(searchTerm, 450)

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 14

  const abortRef = useRef<AbortController | null>(null)

  // cargar categorías + primera página
  useEffect(() => {
    ;(async () => {
      try {
        setCatLoading(true)
        const res = await fetch("/api/categories")
        const data: ApiCategories = await res.json()
        const names = data.categories?.map((c) => c.name) ?? []
        setCategories(["all", ...names])
      } catch {
        setCategories(["all"])
      } finally {
        setCatLoading(false)
      }
    })()

    fetchPage(1, true, debouncedSearch)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // cuando cambian filtros/búsqueda (debounced), reset y recarga
  useEffect(() => {
    if (!initialLoading) {
      setProducts([])
      setPage(1)
      fetchPage(1, true, debouncedSearch)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, debouncedSearch, initialLoading, filterPrice])

  async function fetchPage(nextPage: number, replace = false, qOverride?: string) {
    // cancela petición previa
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

    try {
      if (replace || nextPage === 1) setLoading(true)
      else setLoadingMore(true)

      const res = await fetch(`/api/products?${params.toString()}`, {
        signal: ctrl.signal,
      })
      const raw = await res.json()

      if (Array.isArray(raw)) {
        // compat: si el endpoint aún devuelve array plano
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
    <div className="whatsapp-bg min-h-screen pt-24">
      {/* Indicador de fecha estilo WhatsApp */}
      <div className="text-center py-4">
        <div className="inline-block bg-white bg-opacity-90 rounded-full px-3 py-1 shadow-sm">
          <span className="text-xs text-gray-600">Hoy</span>
        </div>
      </div>

      {/* Filtros - Siempre renderizados */}
      <div className="px-4 mb-4 relative z-[100]">
        <ProductFilters
          priceFilter={filterPrice}
          onPriceFilterChange={setFilterPrice}
          maxPrice={maxPrice}
          onMaxPriceChange={setMaxPrice}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>

      {/* Contenedor de productos con loading overlay */}
      <div className="relative">
        {/* Loading overlay solo para la carga inicial */}
        {initialLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0">
            {[...Array(limit)].map((_, i) => (
              <WhatsAppProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Loading indicator para búsquedas/filtros (más sutil) */}
        {loading && !initialLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0 opacity-60">
            {[...Array(8)].map((_, i) => (
              <WhatsAppProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Productos - Solo mostrar cuando no está en carga inicial */}
        {!initialLoading && (
          <>
            {products && products.length === 0 && !loading ? (
              <div className="text-center py-20">
                <div className="bg-gray-100 bg-opacity-80 rounded-lg p-6 mx-4 shadow-sm">
                  <p className="text-gray-600 text-lg mb-4">No se encontraron productos</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCategory("all")
                      setSearchTerm("")
                      setFilterPrice("all")
                      setMaxPrice(0)
                    }}
                    className="bg-white"
                  >
                    Limpiar filtros
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div
                  className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0 ${
                    loading ? "opacity-50" : ""
                  }`}
                >
                  {products.map((p) => (
                    <WhatsAppProductCard key={p._id} product={p} />
                  ))}
                </div>

                {/* Cargar más */}
                <div className="flex justify-center pb-20">
                  {hasMore ? (
                    <Button
                      onClick={() => fetchPage(page + 1)}
                      disabled={loadingMore}
                      className="bg-white text-emerald-700 border border-emerald-200"
                      variant="outline"
                    >
                      {loadingMore ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Cargando…
                        </>
                      ) : (
                        "Cargar más"
                      )}
                    </Button>
                  ) : products.length > 0 ? (
                    <span className="text-xs text-gray-500 bg-white bg-opacity-80 px-3 py-1 rounded-full">
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
