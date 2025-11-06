"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2 } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

interface CartItemProps {
  item: {
    id: string
    name: string
    price: number
    image: string
    quantity: number
  }
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart()

  return (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
      <Image
        src={item.image || "/placeholder.svg"}
        alt={item.name}
        width={60}
        height={60}
        className="rounded-md object-cover"
      />

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
        <p className="text-sm text-gray-600">${item.price}</p>
      </div>

      <div className="flex items-center space-x-2">
        <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}>
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
        <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      <Button
        size="sm"
        variant="ghost"
        onClick={() => removeItem(item.id)}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
