"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Package, CreditCard } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { toast } from "sonner"
import { useSearchParams } from "next/navigation"
import { formatPrice } from "@/lib/formatPrice"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"

interface CheckoutFormProps {
  items: Array<{
    id: string
    name: string
    price: number
    image: string
    quantity: number
  }>
  totalPrice: number
  onBack: () => void
  onClose: () => void
}

export function CheckoutForm({ items, totalPrice, onBack, onClose }: CheckoutFormProps) {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const idCart = searchParams.get("idCart") || "";
  const [loading, setLoading] = useState(false)
  const [tokenless, setTokenless] = useState(true)
  //const [needsShipping, setNeedsShipping] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
  })
  const { clearCart } = useCart()

  useEffect(() => {
    if (idCart) {
      try {
        const fetchData = async () => {
          const res = await fetch(`/api/cart?idCart=${idCart}`);
          if (res.ok) {
            const data = await res.json();
            return setFormData({ ...formData, name: data?.name });
          }
          else return;
        }
        fetchData()
      } catch (error) {
        return;
      }
    }
    if (!id) return setTokenless(true);
    try {
      const fetchData = async () => {
        const res = await fetch(`/api/token?id=${id}`);
        if (res.ok) return setTokenless(false);
        else return setTokenless(true);
      }
      fetchData()
    } catch (error) {
      setTokenless(true);
    }
  }, [id])


  const sendToWebhook = async () => {
    try {
      const res = await fetch(`/api/token?id=${id}`)
      if (res.ok) {
        const data = await res.json()
        if (data.token) {
          const response = await fetch(process.env.NEXT_PUBLIC_URL_WEBHOOK || "", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${data.token}`
            },
            body: JSON.stringify(
              {
                items: items.map((item) => ({
                  id: item.id,
                  title: item.name,
                  unit_price: item.price,
                  quantity: item.quantity,
                  image: item.image || ""
                })),
                totalPrice,
                //needsShipping,
                formData
              })
          })
          if (response.ok) {
            const link = document.createElement("a");
            link.href = "https://wa.me/+5493816592823"
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Simulación de procesamiento del pedido
            setTimeout(() => {
              toast.success("¡Pedido realizado!", { position: 'top-right', style: { color: "green" } })
              clearCart()
              onClose()
              setLoading(false)
            }, 2000)
          }
        }

      } else {
        setTokenless(true)
      }
    } catch (error) {
      setTokenless(true);
    }


  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    if (!formData.name) {
      toast.warning("El nombre es obligatorio", { position: 'top-right', style: { color: "orange" } })
      setLoading(false)
      return
    }
    /* 
        if (needsShipping && !formData.address) {
          toast({
            title: "Dirección requerida",
            description: "Por favor ingresa tu dirección de envío",
            variant: "destructive",
          })
          setLoading(false)
          return
        }
     */
    sendToWebhook()
  }

  // const shippingCost = needsShipping ? 10 : 0
  const finalTotal = totalPrice // + shippingCost

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      {tokenless ? (
        <>
          <Alert className="mt-5">
            <AlertTitle>¡Ups! Necesitamos verificar tu pedido desde WhatsApp.</AlertTitle>
            <AlertDescription className="mt-2">
              Por favor, envianos un mensaje y hacé clic en el botón <b>Iniciar Compra</b> que te enviaremos.
              <br /> Así podemos generar tu token y continuar con el proceso.
            </AlertDescription>
          </Alert>
          <Button
            variant="default"
            size="lg"
            className="w-full mt-6 mb-5 bg-green-600 hover:bg-green-700"
            onClick={() => {
              const link = document.createElement("a");
              link.href = "https://wa.me/+5493816592823"
              link.target = "_blank";
              link.rel = "noopener noreferrer";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            Ir a Whatsapp
          </Button>
        </>
      ) :
        (
          <>
            <div className="flex items-center space-x-3 pb-4 border-b">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h3 className="font-semibold text-gray-900">Finalizar Pedido</h3>
                <p className="text-sm text-gray-600">Completa tus datos</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4">
              {/* Datos del cliente */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Datos del Cliente</h4>

                <div>
                  <Label htmlFor="name">Nombre Completo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>
              </div>

              {/* Opciones de envío */}
              {/* <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Envio</h4>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="shipping"
              checked={needsShipping}
              onCheckedChange={(checked) => setNeedsShipping(checked as boolean)}
            />
            <Label htmlFor="shipping" className="text-sm">
              Necesito envío a domicilio (+$10.00)
            </Label>
          </div>

          {needsShipping && (
            <div>
              <Label htmlFor="address">Dirección de Envío *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Calle, número, colonia, ciudad, código postal"
                rows={3}
                required
              />
            </div>
          )}
        </div> */}

              {/* Resumen del pedido */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <Package className="h-4 w-4 mr-2" />
                  Resumen del Pedido
                </h4>

                <div className="space-y-2 text-sm">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span className="text-gray-600">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="font-medium">${formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}

                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">${formatPrice(totalPrice)}</span>
                  </div>

                  {/* {needsShipping && (
              <div className="flex justify-between">
                <span className="text-gray-600">Envío:</span>
                <span className="font-medium">${shippingCost.toFixed(2)}</span>
              </div>
            )} */}

                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>${formatPrice(finalTotal)}</span>
                  </div>
                </div>
              </div>
            </form>

            {/* Footer con botón */}
            <div className="border-t pt-4 mb-5">
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                {loading ? (
                  "Procesando..."
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Finalizar Pedido (${formatPrice(finalTotal)})
                  </>
                )}
              </Button>
            </div>
          </>
        )}
    </div>
  )
}
