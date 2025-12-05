export interface IOrderProduct {
  name: string
  quantity: number
  price: number
  image?: string | null
}

export interface IPickupData {
  province?: string | null
  city?: string | null
  branch?: string | null
}

export interface IOrder {
  _id: string
  orderId: string
  customerName: string
  customerPhone: string
  customerDNI: string
  pickupdata:IPickupData | null
  address?: string | null
  postal_code?: string | null
  products: IOrderProduct[]
  status: "En Proceso" | "Pagado" | "Cancelado" | "Completado"
  total: number
  orderId_mercadoPago?: string
  createdAt: Date
  updatedAt?: Date
}
