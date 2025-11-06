"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductList } from "./product-list";
import { Product } from "@/types/product";

type Summary = { inStock: number; outOfStock: number; discounted: number };

// Hook personalizado para debounce
function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function ProductsContainer({
  onEdit,
  onDelete,
  refreshToken = 0,
}: {
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
  refreshToken?: number; // cuando cambia -> refetch
}) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [loading, setLoading] = useState(false);

  // Debounce del query con 1.5 segundos de delay
  const debouncedQuery = useDebounce(q, 1000);

  const [items, setItems] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [summary, setSummary] = useState<Summary>({ inStock: 0, outOfStock: 0, discounted: 0 });

  async function fetchPage(p = page, query = debouncedQuery) {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?page=${p}&limit=${limit}&q=${encodeURIComponent(query)}`);
      const data = await res.json();

      setItems(data.items || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
      setSummary(data.summary || { inStock: 0, outOfStock: 0, discounted: 0 });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { 
    setPage(1); 
  }, [debouncedQuery]);

  useEffect(() => { 
    fetchPage(page, debouncedQuery); 
  }, [page, debouncedQuery, refreshToken]);

  return (
    <div className="space-y-6">
      {/* búsqueda + contador */}
      <div className="flex items-center gap-2">
        <Input
          placeholder="Buscar por título/categoría…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-sm"
        />
        {/* Mostrar loading si está buscando O si el query cambió pero aún no se ha disparado el debounce */}
        {(loading || (q !== debouncedQuery && q.length > 0)) && (
          <span className="text-sm text-muted-foreground">
            {loading ? "Cargando…" : "Buscando…"}
          </span>
        )}
        <div className="ml-auto text-sm text-muted-foreground">{total} productos</div>
      </div>

      {/* stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">En Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.inStock}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Agotados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.outOfStock}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Con Descuento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.discounted}</div>
          </CardContent>
        </Card>
      </div>

      {/* grilla */}
      <ProductList
        loading={loading}
        products={items}
        onEdit={onEdit}
        onDelete={async (id) => {
          await onDelete(id);
          fetchPage(); // refresh después de borrar
        }}
      />

      {/* paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            ←
          </Button>
          <span className="px-2 text-sm">{page} / {totalPages}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            →
          </Button>
        </div>
      )}
    </div>
  );
}