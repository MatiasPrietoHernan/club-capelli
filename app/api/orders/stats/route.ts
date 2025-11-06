import { NextResponse } from "next/server"
import connectDB from "@/lib/database"
import Order from "@/lib/models/order"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    await connectDB()

    // Get total orders count
    const totalOrders = await Order.countDocuments()

    // Get completed orders count
    const completedOrders = await Order.countDocuments({
      status: "Completado",
    })

    // Get total earnings from completed orders
    const earningsResult = await Order.aggregate([
      { $match: { status: "Completado" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ])

    const totalEarnings = earningsResult.length > 0 ? earningsResult[0].total : 0

    return NextResponse.json({
      totalOrders,
      completedOrders,
      totalEarnings,
    })
  } catch (error) {
    console.error("Error fetching order stats:", error)
    return NextResponse.json({ error: "Error al obtener estadísticas de órdenes" }, { status: 500 })
  }
}
