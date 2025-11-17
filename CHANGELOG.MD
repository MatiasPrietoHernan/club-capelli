# Changelog

Todos los cambios notables del proyecto Club Capelli.

---

## [1.2.0] - 2025-11-17

### Nuevas funcionalidades
- Implementación de apartado "Categorias y Marcas" con el respectivo formulario

**Páginas afectadas:**
- `/admin/tags` - Creación y edición de Marcas y Categorias

**Características:**
- Se implementó subtabs para "Marcas":
  - Tiene una lista para ver las marcas, y para agregarlas con un solo input

- Se implementó subtabs para "Categorias":
  - Tiene una lista para ver las categorias, y para agregarlas con un solo input

### Edición
- Se edito las páginas de agregados y edición de productos para buscar las marcas y categorias con un pequeño modal
- Se realizó el brandeo del BackOffice y login con los colores y el logo de Club Capelli.



## [1.1.0] - 2025-11-12

### 🎯 Nuevas Funcionalidades

#### Sistema de Almacenamiento MinIO
- Implementación de buckets S3-compatible para imágenes de productos
- Endpoint `/api/upload` para subida de archivos
- Configuración de credenciales en `.env.local`:
  - `MINIO_ENDPOINT`
  - `MINIO_ACCESS_KEY`
  - `MINIO_SECRET_KEY`
  - `MINIO_BUCKET`

#### Gestión Dual de Imágenes
**Páginas afectadas:**
- `/admin/products/new` - Creación de productos
- `/admin/products/edit/[id]` - Edición de productos

**Características:**
- **Opción 1 - Subida de Archivos:**
  - Drag-and-drop para múltiples imágenes
  - Soporte JPEG, PNG, WebP
  - Estados de carga individuales
  - Previews en tiempo real
  
- **Opción 2 - URLs Externas:**
  - Campos de texto para URLs manuales
  - Validación automática
  - Soporte para Enter/botones

**UX/UI:**
- Grid responsive con previews
- Botones de eliminación con hover
- Fallback para imágenes rotas
- Toast notifications para errores

### 🐛 Correcciones

#### Fix Crítico: Carga de Productos en Edición
- **Problema**: Endpoint incorrecto `/api/products?id=` impedía cargar datos
- **Solución**: Migrado a `/api/products/verify?productId=`
- **Impacto**: Páginas de edición ahora funcionan correctamente

### 📊 Estadísticas

- **Archivos modificados**: 3 (2 páginas + 1 API route)
- **Líneas agregadas**: ~200
- **Nuevas dependencias**: lucide-react (icons)
- **Storage backend**: MinIO (S3-compatible)

---

## [1.0.0] - 2025-11-11

### Lanzamiento Inicial
- E-commerce con Next.js 14 + MongoDB
- Autenticación de usuarios
- CRUD completo de productos
- Sistema de variantes
- Gestión de órdenes y carrito

---

**Mantenido por**: Equipo Waichatt  
**Última actualización**: 2025-11-12