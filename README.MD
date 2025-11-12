# 🛍️ Club Capelli - E-commerce Platform

**Plataforma de comercio electrónico moderna construida con Next.js**

## 📖 Información Importante

### 👀 **Por favor, lee el CHANGELOG**

**Antes de explorar el código, te recomendamos encarecidamente revisar nuestro [CHANGELOG.MD](./CHANGELOG.MD)** para entender:

- ✅ **Cambios recientes implementados**
- 🔧 **Modificaciones colaborativas** (desarrolladores)
- 🐛 **Bugs corregidos**
- 🚀 **Nuevas funcionalidades**
- 📊 **Estadísticas de desarrollo**

El changelog documenta tanto las implementaciones propias como las colaboraciones con IA, manteniendo un registro completo de la evolución del proyecto.

## 🛠️ Tecnologías Utilizadas

- **Framework**: Next.js 15 + React 19
- **Base de Datos**: MongoDB con Mongoose
- **Autenticación**: NextAuth.js
- **UI/UX**: Tailwind CSS + Radix UI
- **Almacenamiento**: MinIO (S3-compatible)
- **Lenguaje**: TypeScript

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+
- MongoDB
- MinIO (opcional, para almacenamiento de imágenes)

### Instalación

```bash
# Instalar dependencias
npm install
# o
pnpm install

# Configurar variables de entorno
cp .env.example .env.local

# Ejecutar en desarrollo
npm run dev
# o
pnpm dev
```

### Variables de Entorno

```env
# Base de datos
MONGODB_URI=mongodb://localhost:27017/club-capelli

# NextAuth
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# MinIO (opcional)
MINIO_ENDPOINT=http://localhost:9000
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key
MINIO_BUCKET=club-capelli
```

## 📁 Estructura del Proyecto

```
club-capelli/
├── app/                    # Next.js App Router
│   ├── admin/             # Panel de administración
│   ├── api/               # API Routes
│   └── product/           # Páginas de productos
├── components/            # Componentes reutilizables
├── lib/                   # Utilidades y configuraciones
├── types/                 # Definiciones TypeScript
└── schemas/               # Esquemas de base de datos
```

## 🎯 Características Principales

- ✅ **Gestión de Productos**: CRUD completo con variantes
- ✅ **Sistema de Órdenes**: Creación y seguimiento
- ✅ **Carrito de Compras**: Persistencia en base de datos
- ✅ **Autenticación**: Sistema seguro con roles
- ✅ **Subida de Imágenes**: MinIO + URLs manuales
- ✅ **Interfaz Responsive**: Diseño mobile-first

## 📝 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linting con ESLint
```

## 🤝 Contribución

1. Revisa el [CHANGELOG.MD](./CHANGELOG.MD) para entender cambios recientes
2. Crea una rama para tu feature
3. Realiza commits descriptivos
4. Actualiza el changelog con tus cambios

## 📄 Licencia

Este proyecto es privado y propiedad de Club Capelli y de Waichatt.

---

**💡 Tip**: El proyecto evoluciona constantemente. Siempre revisa el changelog para estar al día con las últimas modificaciones y mejoras.
