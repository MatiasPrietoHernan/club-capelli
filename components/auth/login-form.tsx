"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { signIn } from "next-auth/react"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false
      });

      if (res?.error) return toast.error("Error de acceso", {position:"top-center",style:{color:"red"},duration:3000});
      router.push("/admin");
      toast.success("Acceso concedido", { position: "top-center", style: { color: "green" }, duration: 3000 });
    } catch (error) {
      return toast.error("Error de acceso", {position:"top-center",style:{color:"red"},duration:3000});
    } finally {
      setLoading(false);
    }

  }

  return (
    <div className="w-full max-w-md">
      {/* Header con branding */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">W</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Waichatt</h1>
            <p className="text-sm text-gray-600">Plataforma SaaS</p>
          </div>
        </div>
        <p className="text-gray-600">Accede al panel administrativo</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-center">Iniciar Sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="admin@technocommerce.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
              {loading ? "Verificando..." : "Iniciar Sesión"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a la tienda
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Footer con info del cliente */}
      <div className="mt-8 text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-green-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">TC</span>
          </div>
          <span className="text-sm font-medium text-gray-700">Cristal Shop</span>
        </div>
        <p className="text-xs text-gray-500">Cliente de Waichatt desde 2025</p>
      </div>
    </div>
  )
}
