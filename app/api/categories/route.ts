// app/api/categories/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/database";
import product from "@/lib/models/product";
export async function GET() {
  try {
    await connectDB();

    const rows=await product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]).sort({_id:1});

    const categories = rows
      .map(r => ({ name: String(r._id ?? "").trim(), count: r.count }))
      .filter(c => c.name.length > 0);

    return NextResponse.json({ categories });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ categories: [] }, { status: 200 });
  }
}