"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Download } from "lucide-react";
import { ProductForm } from "./product-form";
import { ProductsContainer } from "@/components/admin/ProductContainer";
//import { ImportDialog } from "./import-dialog";
import type {  Product } from "@/types/product";
import { toast } from "sonner"
import { useRouter } from "next/navigation";

export function ProductManagement() {
  const [showForm, setShowForm] = useState(false);
  //const [showImport, setShowImport] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);
  const router = useRouter()
  const handleEdit = (product: Product) => {
    router.push(`/admin/products/edit/${product._id}`);
  }; 

  const handleCreate = ()=>{
    router.push('/admin/products/new')
  }

  const handleDelete = async (productId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este producto?")) return;
    const res = await fetch(`/api/products?id=${productId}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      console.error("Error deleting product:", data?.error || res.statusText);
      toast.error("Error al eliminar el producto", {position:"top-center",style:{color:"red"},duration:3000});
    }else{
      toast.success("Producto eliminado", {position:"top-center",style:{color:"green"},duration:3000});
    }
    // el contenedor hará refresh al volver la promesa
  };

/*   const downloadTemplate = () => {
    const csvContent =
      "Nombre,Descripción,Precio,Categoría,URL de Imagen,Precio Oferta,Stock\n" +
      "Producto Ejemplo,Descripción del producto,99.99,Categoría,https://ejemplo.com/imagen.jpg,79.99,10";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "plantilla_productos.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };
 */
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Productos</h1>
          <p className="text-gray-600">Administra tu catálogo de productos</p>
        </div>

        <div className="flex items-center space-x-3">
          {/* <Button variant="outline" onClick={downloadTemplate}>
            <Download className="h-4 w-4 mr-2" />
            Descargar Plantilla
          </Button>
          <Button variant="outline" onClick={() =>/*setShowImport(true)>
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button> 
          */}
          <Button onClick={() => { handleCreate()}} style={{
            backgroundColor: '#FF6B1A',
            borderColor: '#FF6B1A',
            color: 'white'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#E85D0D'
          }} onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FF6B1A'
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Producto
          </Button>
        </div>
      </div>

      {/* Contenedor: busca, pagina, muestra stats y la grilla */}
      <ProductsContainer
        onEdit={handleEdit}
        onDelete={handleDelete}
        refreshToken={refreshToken}
      />


      {/* Importar CSV 
      {showImport && (
        <ImportDialog
          onClose={() => setShowImport(false)}
          onImportComplete={() => { setShowImport(false); bumpRefresh(); }}
        />
      )}*/}
    </div>
  );
}
