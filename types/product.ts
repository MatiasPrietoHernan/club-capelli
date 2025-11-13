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

export interface Product{
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
  category?: string
}