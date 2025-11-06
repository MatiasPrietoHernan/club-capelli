import { NextResponse } from "next/server"
import connectDB from "@/lib/database"
import carts from "@/lib/models/carts";


export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const idCart = searchParams.get("idCart");

        if (!idCart) return NextResponse.json({ error: "error al obtener el id" })

        const cart = await carts.findById(idCart)

        if (cart && cart?.products?.length > 0) {
            return NextResponse.json({ products: cart.products, name: cart?.name || "" }, { status: 200 })
        } else {
            return NextResponse.json({ products: [] }, { status: 404 })
        }
    } catch (error) {
        return NextResponse.json({ products: [], error: "Error al obtener productos" }, { status: 500 })
    }
}

