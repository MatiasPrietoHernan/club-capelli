"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import OrderFilters from "@/components/orders/OrderFilters"
import OrderCard from "@/components/orders/OrderCard"
import CreateOrderModal from "@/components/orders/CreateOrderModal"
import { toast } from "sonner"
import { IOrder } from "@/types/order"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { OrderStats } from "@/components/orders/OrderStats"
import { format as formatDate } from "date-fns"
import type { DateRange } from "react-day-picker" 

export default function OrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([])
  const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([])
  const [phoneFilter, setPhoneFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("Todos")
  const [statusRefresh, SetStatusRefresh] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  })
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()

      if (phoneFilter) params.append("phone", phoneFilter)
      if (statusFilter !== "Todos") params.append("status", statusFilter)

      // Enviar rango de fechas si existe (formato yyyy-MM-dd para evitar TZ issues)
      if (dateRange?.from)
        params.append("dateFrom", formatDate(dateRange.from, "yyyy-MM-dd"))
      if (dateRange?.to)
        params.append("dateTo", formatDate(dateRange.to, "yyyy-MM-dd"))

      const response = await fetch(`/api/orders?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
        setFilteredOrders(data)
      } else {
        throw new Error("Response not ok")
      }
    } catch (error) {
      toast.error("Error",{position:"top-center",style:{color:"red"},duration:3000})
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Evitamos dependencias por referencia usando las ISO strings
    fetchOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    phoneFilter,
    statusFilter,
    dateRange?.from?.toISOString(),
    dateRange?.to?.toISOString(),
  ])

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      })

      if (response.ok) {
        toast.success("Estado de la orden actualizado",{ position: "top-center", style: { color: "green" }, duration: 3000 })
        SetStatusRefresh(newStatus)
        fetchOrders()
      } else {
        throw new Error("Update failed")
      }
    } catch (error) {
      toast("Error al actualizar el estado",{position:"top-center",style:{color:"red"},duration:3000})
    }
  }

  const handleClearFilters = () => {
    setPhoneFilter("")
    setStatusFilter("Todos")
    const today = new Date()
    setDateRange({ from: today, to: today })
  }

  const handleOrderCreated = () => {
    fetchOrders()
  }

  return (
    <div className="min-h-screen bg-gray-100 container mx-auto p-4 md:p-6">
      <AdminHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-balance">Órdenes</h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">Gestiona pedidos y ventas</p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-green-600 hover:bg-green-700  w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Orden
          </Button>
        </div>

        <OrderStats status={statusRefresh} />

        {/* Filters */}
        <OrderFilters
          phoneFilter={phoneFilter}
          setPhoneFilter={setPhoneFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          dateRange={dateRange}
          setDateRange={setDateRange}
          onClearFilters={handleClearFilters}
        />

        {/* Orders List */}
        <div className="space-y-4">
          {isLoading && (
            <div className="container mx-auto p-6">
              <div className="flex items-center justify-center h-64">
                <div className="text-lg">Cargando órdenes...</div>
              </div>
            </div>
          )}

          {!isLoading && filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No se encontraron órdenes</p>
            </div>
          ) : (
            !isLoading &&
            filteredOrders.map((order) => (
              <OrderCard key={order._id} order={order} onStatusChange={handleStatusChange} />
            ))
          )}
        </div>

        {/* Create Order Modal */}
        <CreateOrderModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onOrderCreated={handleOrderCreated}
        />
      </div>
    </div>
  )
}
