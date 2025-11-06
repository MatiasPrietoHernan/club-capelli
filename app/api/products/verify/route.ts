import product from "@/lib/models/product";
import { NextResponse } from "next/server";
import connectDB from "@/lib/database";
import { IProduct } from "@/lib/models/product";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("productId")

    if (!id) return NextResponse.json({ error: "No se encontro el id del producto" }, { status: 400 })
    try {
        await connectDB();
        const findProduct = await product.findById<IProduct>(id).lean()

        if (findProduct) return NextResponse.json({ product: {...findProduct,id:(findProduct as any)?._id,price:Number(findProduct?.price.replace('$',''))} }, { status: 200 })
        return NextResponse.json({ message: "No se encontro el producto" }, { status: 400 })

    } catch (error) {
        return NextResponse.error()
    }

}