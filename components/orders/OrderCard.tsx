"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, ChevronRight } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { IOrder } from "@/types/order"


interface OrderCardProps {
  order: IOrder
  onStatusChange: (orderId: string, newStatus: string) => void
}

export default function OrderCard({ order, onStatusChange }: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Cancelado":
        return "bg-red-500 text-white hover:bg-red-700"
      case "En Proceso":
        return "bg-orange-500 text-white bg-orange-700"
      case "Completado":
        return "bg-green-500 text-white bg-green-700"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Card className="mb-4">
      <CardContent className="p-3 md:p-4">
        <div className="space-y-3 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          {/* Primera fila: Botón expandir, ID de orden y badge de estado */}
          <div className="flex items-center justify-between" >
            <div className="flex items-center gap-2 md:gap-4">
              <Button variant="ghost" size="sm"  className="p-1">
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
              <span className="font-medium text-sm md:text-base">Orden {order.orderId}</span>
              <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
            </div>
          </div>

          {/* Segunda fila: Información del cliente y orden */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs md:text-sm text-muted-foreground pl-8 md:pl-12">
            <div>
              <span className="block font-medium text-foreground truncate">{order.customerName}</span>
            </div>
            <div>
              <span className="block">{format(new Date(order.createdAt), "dd/MM/yyyy", { locale: es })}</span>
            </div>
            <div>
              <span className="block font-semibold text-foreground">{formatCurrency(order.total)}</span>
            </div>
            <div>
              <span className="block">{order.products.length} prod.</span>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 md:mt-6 pl-4 md:pl-8 border-t pt-4">
            <div className="mb-4 md:flex md:justify-between md:mb-0">
              <div>
                <h4 className="font-medium mb-2">Detalles de la orden</h4>
              </div>
              <div className="flex justify-center md:justify-end mb-4">
                <Select value={order.status} onValueChange={(newStatus) => onStatusChange(order.orderId, newStatus)}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="En Proceso">En Proceso</SelectItem>
                    <SelectItem value="Cancelado">Cancelado</SelectItem>
                    <SelectItem value="Completado">Completado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {order.products.map((product, index) => (
              <div key={index} className="mb-4 p-3 md:p-4 bg-gray-200 rounded-lg">
                <h5 className="font-semibold text-base md:text-lg mb-2">{product.name}</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Cantidad: </span>
                    <span>{product.quantity}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Precio: </span>
                    <span>{formatCurrency(product.price)}</span>
                  </div>
                  <div className="sm:col-span-2 md:col-span-1">
                    <span className="text-muted-foreground">Subtotal: </span>
                    <span className="font-medium">{formatCurrency(product.price * product.quantity)}</span>
                  </div>
                </div>
              </div>
            ))}

            <div className="space-y-2 md:space-y-0 md:grid md:grid-cols-3 md:gap-4 mt-4 text-sm">
              <div>
                <span className="text-muted-foreground">Cliente: </span>
                <span>{order.customerName}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Teléfono: </span>
                <span>{order.customerPhone}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Fecha: </span>
                <span>{format(new Date(order.createdAt), "dd/MM/yyyy", { locale: es })}</span>
              </div>
              <div>
                <span className="text-muted-foreground">OrderID Uala: </span>
                <span>{order?.orderId_uala||"Sin OrderID"}</span>
              </div>
              <div className="md:text-right">
                <span className="text-base md:text-lg font-semibold">Total: {formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
