"use client"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, ChevronRight } from "lucide-react"
import { format, isValid } from "date-fns"
import { es } from "date-fns/locale"
import { IOrder } from "@/types/order"
import Image from "next/image"

interface OrderCardProps {
  order: IOrder
  onStatusChange: (orderId: string, newStatus: string) => void
}

export default function OrderCard({ order, onStatusChange }: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const isShipping = Boolean(
    (order.address && order.address !== "null") ||
    (order.postal_code && order.postal_code !== "null")
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Cancelado":
        return "bg-red-500 text-white hover:bg-red-700"
      case "En Proceso":
        return "bg-orange-500 text-white hover:bg-orange-700"
      case "Pagado":
        return "bg-blue-500 text-white hover:bg-blue-700"
      case "Completado":
        return "bg-green-500 text-white hover:bg-green-700"
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

  const formatDateSafely = (dateInput: string | Date | undefined | null): string => {
    if (!dateInput) {
      return "Fecha no disponible";
    }
    const date = new Date(dateInput);
    if (isValid(date)) {
      return format(date, "dd/MM/yyyy", { locale: es });
    }
    return "Fecha inválida";
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-3 md:p-4">
        <div className="space-y-3 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>

          <div className="flex items-center justify-between" >
            <div className="flex items-center gap-2 md:gap-4">
              <Button variant="ghost" size="sm" className="p-1">
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
              <span className="font-medium text-sm md:text-base">Orden {order.orderId}</span>
              <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
              <Badge variant="default" className="bg-orange-500">{isShipping ? "Envio" : "Retiro en local"}</Badge>
            </div>
          </div>
          {/* Segunda fila: Información del cliente y orden */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs md:text-sm text-muted-foreground pl-8 md:pl-12">
            <div>
              <span className="block font-medium text-foreground truncate">{order.customerName}</span>
            </div>
            <div>
              <span className="block">{formatDateSafely(order.createdAt)}</span>
            </div>
            <div>
              <span className="block font-semibold text-foreground">{formatCurrency(order.total)}</span>
            </div>
            <div>
              <span className="block">{order.products?.length ?? 0} prod.</span>
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
                    <SelectItem value="Pagado">Pagado</SelectItem>
                    <SelectItem value="Completado">Completado</SelectItem>
                    <SelectItem value="Cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {order.products?.map((product, index) => (
              <div key={index} className="mb-4 p-3 md:p-4 bg-gray-200 rounded-lg">
                <div className="flex items-start gap-4">
                  <Image
                    src={product.image || "/placeholder.jpg"}
                    alt={product.name}
                    className="w-16 h-16 md:w-20 md:h-20 rounded object-cover flex-shrink-0"
                    width={80}
                    height={80}
                  />
                  <div className="flex-1">
                    <h5 className="font-semibold text-base md:text-lg mb-2">{product.name}</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Cantidad: </span>
                        <span>{product.quantity}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Precio: </span>
                        <span>{formatCurrency(product.price)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Subtotal: </span>
                        <span className="font-medium">{formatCurrency(product.price * product.quantity)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )) ?? <div className="text-center text-muted-foreground">No hay productos disponibles</div>}
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
                {order.customerDNI && (
                  <div>
                    <span className="text-muted-foreground">DNI: </span>
                    <span>{order.customerDNI}</span>
                  </div>
                )}
              </div>
              <div>
                <span className="text-muted-foreground">Fecha: </span>
                <span>{formatDateSafely(order.createdAt)}</span>
              </div>
              {isShipping && (
                <>
                  <div>
                    <span className="text-muted-foreground">Dirección: </span>
                    <span>{order.address}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Código Postal: </span>
                    <span>{order.postal_code}</span>
                  </div>
                </>
              )}
              <div>
                <span className="text-muted-foreground">OrderID Mercado Pago: </span>
                <span>{order?.orderId_mercadoPago || "Sin OrderID"}</span>
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