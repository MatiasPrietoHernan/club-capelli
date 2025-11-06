import mongoose, { Schema, Document } from "mongoose"

export interface IVariant {
  variant_id: number
  sku: string
  label: string
  color: string
  price: number
  promotional_price: number
  effective_price: number
  stock_total: number
  image_url: string
  visible: boolean
  weight: number
}

export interface IProduct extends Document {
  _id: string
  name: string
  description: string
  brand?: string
  product_id?: number
  images: string[]
  price: number
  salePrice?: number
  stock?: number
  quantity?: number | undefined
  variants: IVariant[]
}

const VariantSchema = new Schema<IVariant>(
  {
    variant_id: { type: Number, required: true },
    sku: String,
    label: String,
    color: String,
    price: Number,
    promotional_price: Number,
    effective_price: Number,
    stock_total: Number,
    image_url: String,
    visible: Boolean,
    weight: Number,
  },
  { _id: false }
)

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    brand: { type: String },
    product_id: { type: Number },
    images: { type: [String], default: [] },
    price: { type: Number, required: true },
    salePrice: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 },
    variants: { type: [VariantSchema], default: [] },
  },
  { timestamps: true }
)

export default mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema, "products")
