import mongoose, { Schema, Document } from "mongoose"

export interface ICategory extends Document {
    _id: string
    name: string
    created_at: Date
    updatedAt: Date
}

export interface IBrand extends Document {
    _id: string
    name: string
    image_url: string
    created_at: Date
    updatedAt: Date
}

// Schema para Categorías
const CategorySchema = new Schema<ICategory>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
)

// Schema para Marcas
const BrandSchema = new Schema<IBrand>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        image_url: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
)

export const Category = mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema, "categories")
export const Brand = mongoose.models.Brand || mongoose.model<IBrand>("Brand", BrandSchema, "brands")
