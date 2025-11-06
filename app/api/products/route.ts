import { NextResponse } from "next/server"
import connectDB from "@/lib/database"
import Product from "@/lib/models/product"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, Number(searchParams.get("page") ?? 1))
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 12)))
    const q = (searchParams.get("q") ?? "").trim()
    //const category = (searchParams.get("category") ?? "").trim()
    const priceFilter = (searchParams.get("priceFilter") ?? "").trim()
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined

    await connectDB()
    
    const filter: any = q
      ? {
          $or: [{ name: { $regex: q, $options: "i" } }],
        }
      : {}

   // if (category) filter.category = category

    if (maxPrice) {
      filter.$or = [
        { salePrice: { $gt: 0, $lte: maxPrice } },
        {
          $and: [{ $or: [{ salePrice: 0 }, { salePrice: { $exists: false } }] }, { price: { $lte: maxPrice } }],
        },
      ]
    }

    const total = await Product.countDocuments(filter)

    
    let sort: Record<string, 1 | -1> = {_id: -1 }

    if (priceFilter === "low-to-high") {
      sort = { price: 1, _id: -1 }
    } else if (priceFilter === "high-to-low") {
      sort = { price: -1, _id: -1 }
    }

    const rawItems = await Product.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()


      //cuando cambie a array en mongo sacar el image este
    const items = rawItems.map((p) => ({ ...p, id: (p as any)._id.toString() }))


    const [inStock, outOfStock, discounted] = await Promise.all([
      Product.countDocuments({ stock: { $gt: 0 } }),
      Product.countDocuments({ stock: 0 }),
      Product.countDocuments({ salePrice: { $ne: 0 }, $expr: { $lt: ["$salePrice", "$price"] } }),
    ])

    return NextResponse.json({
      items,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      summary: { inStock, outOfStock, discounted },
    })
  } catch {
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== "admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const product = await request.json()
    if (
      !product.name ||
      !product.price?.toString() ||
      Number(product.price) < 0 ||
      !product.category ||
      product.stock < 0 ||
      !product.description
    ) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 })
    }

    await connectDB()

    const newProduct = new Product({
      ...product,
      image: product.image || "",
      stock: product.stock || 0,
      salePrice: Number(product.salePrice) || 0,
      price: Number(product.price),
    })

    const savedProduct = await newProduct.save()

    return NextResponse.json(savedProduct, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== "admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const product = await request.json()
    const { id, ...updateData } = product

    if (!id) return NextResponse.json({ error: "No se encontro el ID de el producto" }, { status: 404 })

    await connectDB()

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })

    if (!updatedProduct) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    return NextResponse.json(updatedProduct, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar producto" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== "admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID de producto inválido" }, { status: 400 })
    }

    await connectDB()

    const result = await Product.findByIdAndDelete(id)

    if (!result) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Producto eliminado correctamente" }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar producto" }, { status: 500 })
  }
}
