"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Upload, FileText, Download } from "lucide-react"
import { toast } from "sonner"

interface ImportDialogProps {
  onClose: () => void
  onImportComplete: () => void
}

export function ImportDialog({ onClose, onImportComplete }: ImportDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      const validTypes = ["text/csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]
      if (
        validTypes.includes(selectedFile.type) ||
        selectedFile.name.endsWith(".csv") ||
        selectedFile.name.endsWith(".xlsx")
      ) {
        setFile(selectedFile)
      } else {
        toast.error( "Solo se permiten archivos CSV y Excel (.xlsx)")
      }
    }
  }

  const handleImport = async () => {
    if (!file) return

    setLoading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/products/import", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        toast.success(result.message)
        onImportComplete()
        onClose()
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error("Error al procesar el archivo")
    } finally {
      setLoading(false)
    }
  }

  const downloadTemplate = () => {
    const csvContent =
      "Nombre,Descripción,Precio,Categoría,URL de Imagen,Precio Oferta,Stock\n" +
      "Smartphone Premium,Teléfono inteligente de última generación,899.99,Electrónicos,/placeholder.svg?height=300&width=300,749.99,15\n" +
      "Laptop Gaming,Laptop para gaming con procesador Intel i7,1299.99,Computadoras,/placeholder.svg?height=300&width=300,,8"

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "plantilla_productos.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Importar Productos</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="file">Seleccionar Archivo</Label>
            <Input id="file" type="file" accept=".csv,.xlsx" onChange={handleFileChange} className="mt-1" />
            <p className="text-xs text-gray-500 mt-1">Formatos soportados: CSV, Excel (.xlsx)</p>
          </div>

          {file && (
            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
              <FileText className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-900">{file.name}</span>
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Formato esperado:</h4>
            <p className="text-sm text-blue-800 mb-3">El archivo debe contener las siguientes columnas:</p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Nombre (requerido)</li>
              <li>• Descripción (requerido)</li>
              <li>• Precio (requerido)</li>
              <li>• Categoría (requerido)</li>
              <li>• URL de Imagen (requerido)</li>
              <li>• Precio Oferta (opcional)</li>
              <li>• Stock (opcional, por defecto 0)</li>
            </ul>
            <Button variant="outline" size="sm" onClick={downloadTemplate} className="mt-3 w-full">
              <Download className="h-3 w-3 mr-2" />
              Descargar Plantilla
            </Button>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleImport} disabled={!file || loading}>
              {loading ? (
                <>Importando...</>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Importar
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
