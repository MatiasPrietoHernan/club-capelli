export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Branding */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TC</span>
              </div>
              <span className="font-semibold text-lg text-gray-900">TechnoCommerce</span>
            </div>
            <p className="text-gray-600 text-sm">Tu tienda de tecnología de confianza.</p>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">Contacto</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>info@technocommerce.com</p>
              <p>+1 (555) 123-4567</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">© 2024 TechnoCommerce</p>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <span className="text-gray-500 text-sm">Powered by</span>
            <span className="text-emerald-600 font-semibold text-sm">Waichatt</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
