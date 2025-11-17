import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database"
import { Brand } from "@/lib/models/tags"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")

    const skip = (page - 1) * limit

    // Build search query
    const query: any = {}
    if (search.trim()) {
      query.name = { $regex: search.trim(), $options: "i" }
    }

    // Get total count for pagination
    const total = await Brand.countDocuments(query)

    // Get paginated results
    const brands = await Brand.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    return NextResponse.json({
      brands,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1
    })
  } catch (error) {
    console.error("Error fetching brands:", error)
    return NextResponse.json({ error: "Error al obtener marcas" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== "admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { name, image_url } = await request.json()

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "El nombre de la marca es requerido" }, { status: 400 })
    }

    await connectDB()

    const existingBrand = await Brand.findOne({ name: name.trim() })
    if (existingBrand) {
      return NextResponse.json({ error: "Ya existe una marca con ese nombre" }, { status: 409 })
    }

    const newBrand = new Brand({
      name: name.trim(),
      image_url: image_url || ""
    })

    const savedBrand = await newBrand.save()
    return NextResponse.json({ brand: savedBrand }, { status: 201 })
  } catch (error) {
    console.error("Error creating brand:", error)
    return NextResponse.json({ error: "Error al crear marca" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== "admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id, name, image_url } = await request.json()

    if (!id || !name || !name.trim()) {
      return NextResponse.json({ error: "ID y nombre son requeridos" }, { status: 400 })
    }

    await connectDB()

    const existingBrand = await Brand.findOne({
      name: name.trim(),
      _id: { $ne: id }
    })

    if (existingBrand) {
      return NextResponse.json({ error: "Ya existe una marca con ese nombre" }, { status: 409 })
    }

    const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        image_url: image_url || ""
      },
      { new: true, runValidators: true }
    )

    if (!updatedBrand) {
      return NextResponse.json({ error: "Marca no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ brand: updatedBrand })
  } catch (error) {
    console.error("Error updating brand:", error)
    return NextResponse.json({ error: "Error al actualizar marca" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== "admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID de marca inválido" }, { status: 400 })
    }

    await connectDB()
    const deletedBrand = await Brand.findByIdAndDelete(id)

    if (!deletedBrand) {
      return NextResponse.json({ error: "Marca no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ message: "Marca eliminada correctamente" })
  } catch (error) {
    console.error("Error deleting brand:", error)
    return NextResponse.json({ error: "Error al eliminar marca" }, { status: 500 })
  }
}
