export default function SessionExpiredPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Sesión Expirada</h1>
        <p className="mb-6">Tu sesión ha expirado.</p>
        <p>Esta pagina solo es accesible desde un redireccionamiento de whatsapp</p>
      </div>
    </div>
  )
}