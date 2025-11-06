/* import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No se encontró archivo" }, { status: 400 })
    }

    const fileType = file.type
    let products = []

    if (fileType === "text/csv" || file.name.endsWith(".csv")) {
      const text = await file.text()
      products = parseCSV(text)
    } else if (
      fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.name.endsWith(".xlsx")
    ) {
      // En producción, usarías una librería como 'xlsx' para procesar Excel
      return NextResponse.json({ error: "Formato Excel no implementado en demo" }, { status: 400 })
    } else {
      return NextResponse.json({ error: "Formato de archivo no soportado" }, { status: 400 })
    }

    return NextResponse.json({
      message: `${products.length} productos importados exitosamente`,
      products,
    })
  } catch (error) {
    return NextResponse.json({ error: "Error al procesar archivo" }, { status: 500 })
  }
}

function parseCSV(csvText: string) {
  const lines = csvText.split("\n")
  const headers = lines[0].split(",").map((h) => h.trim())
  const products = []

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = lines[i].split(",").map((v) => v.trim())
      const product = {
        id: Date.now().toString() + i,
        name: values[0] || "",
        description: values[1] || "",
        price: Number.parseFloat(values[2]) || 0,
        category: values[3] || "General",
        image: values[4] || "/placeholder.svg?height=300&width=300",
        salePrice: values[5] ? Number.parseFloat(values[5]) : null,
        stock: Number.parseInt(values[6]) || 0,
      }
      products.push(product)
    }
  }

  return products
}
 */