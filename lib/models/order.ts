import mongoose, { type Document, Schema } from "mongoose"

export interface IOrderProduct {
  name: string
  quantity: number
  price: number
  image?: string
}

export interface IOrder extends Document {
  orderId: string
  customerName: string
  customerPhone: string
  customerDNI?:string
  address?: string
  postal_code?: string
  products: IOrderProduct[]
  status: "En Proceso" | "Pagado" |  "Cancelado" | "Completado"
  total: number
  orderId_mercadoPago: string
  createdAt: Date
  updatedAt: Date
}

const ProductSchema = new Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
})

const OrderSchema = new Schema<IOrder>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerPhone: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    customerDNI: {
      type: String,
      required: false,
      trim: true,
    },
    address: {
      type: String,
      required: false,
    },
    postal_code: {
      type: String,
      required: false,
    },
    products: {
      type: [ProductSchema],
      required: true,
      validate: {
        validator: (products: IOrderProduct[]) => products && products.length > 0,
        message: "Una orden debe tener al menos un producto",
      },
    },
    status: {
      type: String,
      enum: ["En Proceso", "Pagado", "Cancelado", "Completado"],
      default: "En Proceso",
      index: true,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    orderId_mercadoPago: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

OrderSchema.index({ createdAt: -1 })
OrderSchema.index({ customerPhone: 1, createdAt: -1 })
OrderSchema.index({ status: 1, createdAt: -1 })
OrderSchema.index({ customerDNI: 1, createdAt: -1 })

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema)
