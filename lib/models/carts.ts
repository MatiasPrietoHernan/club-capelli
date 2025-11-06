import mongoose, { type Document, Schema } from "mongoose"

export interface ICarts extends Document {
    _id: string
    products: ICartsProduct[]
    phone: string
    name: string
}

export interface ICartsProduct {
    id: string
    title: string
    unit_price: number
    quantity: number
}

const ProductSchema = new Schema<ICartsProduct>({
    id: { type: String, required: true },
    title: { type: String, required: true },
    unit_price: { type: Number, required: true, min: 1 },
    quantity: { type: Number, required: true, min: 1 },
})


const cartsSchema = new Schema<ICarts>({
    products: {
        type: [ProductSchema],
        required: true,
        validate: {
            validator: (products: ICartsProduct[]) => products && products.length > 0,
            message: "Una orden debe tener al menos un producto",
        },

    },
    phone: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
})

export default mongoose.models.carts || mongoose.model<ICarts>("carts", cartsSchema)
