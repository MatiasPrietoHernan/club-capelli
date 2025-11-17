import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/database"
import { Category } from "@/lib/models/tags"
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
    const total = await Category.countDocuments(query)

    // Get paginated results
    const categories = await Category.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    return NextResponse.json({
      categories,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1
    })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Error al obtener categorías" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== "admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { name } = await request.json()

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "El nombre de la categoría es requerido" }, { status: 400 })
    }

    await connectDB()

    const existingCategory = await Category.findOne({ name: name.trim() })
    if (existingCategory) {
      return NextResponse.json({ error: "Ya existe una categoría con ese nombre" }, { status: 409 })
    }

    const newCategory = new Category({
      name: name.trim()
    })

    const savedCategory = await newCategory.save()
    return NextResponse.json({ category: savedCategory }, { status: 201 })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Error al crear categoría" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== "admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id, name } = await request.json()

    if (!id || !name || !name.trim()) {
      return NextResponse.json({ error: "ID y nombre son requeridos" }, { status: 400 })
    }

    await connectDB()

    const existingCategory = await Category.findOne({
      name: name.trim(),
      _id: { $ne: id }
    })

    if (existingCategory) {
      return NextResponse.json({ error: "Ya existe una categoría con ese nombre" }, { status: 409 })
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name: name.trim() },
      { new: true, runValidators: true }
    )

    if (!updatedCategory) {
      return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ category: updatedCategory })
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json({ error: "Error al actualizar categoría" }, { status: 500 })
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
      return NextResponse.json({ error: "ID de categoría inválido" }, { status: 400 })
    }

    await connectDB()
    const deletedCategory = await Category.findByIdAndDelete(id)

    if (!deletedCategory) {
      return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ message: "Categoría eliminada correctamente" })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ error: "Error al eliminar categoría" }, { status: 500 })
  }
}
