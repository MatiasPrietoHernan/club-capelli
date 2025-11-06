export interface Product {
  id: string
  name: string
  description: string
  price: number
  salePrice?: number | null
  category: string
  image: string
  stock: number
}

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

export interface ImportResult {
  success: boolean
  message: string
  products?: Product[]
  errors?: string[]
}
