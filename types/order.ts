export interface IOrderProduct {
  name: string
  quantity: number
  price: number
}

export interface IOrder {
  _id: string
  orderId: string
  customerName: string
  customerPhone: string
  products: IOrderProduct[]
  status: "En Proceso" | "Cancelado" | "Completado"
  total: number
  orderId_uala?: string
  createdAt: Date
  updatedAt?: Date
}

