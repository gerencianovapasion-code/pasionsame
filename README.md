# 🏪 Marketplace Local - Escaparate Comercial

Aplicación web en Laravel para crear un escaparate comercial donde los dueños de negocios pueden registrarse, publicar sus negocios y gestionar su tienda virtual con sistema de suscripciones multinivel.

## 🌟 Características Principales

### Para Clientes
- 📍 Búsqueda de negocios por categoría y ubicación
- 🗺️ Visualización en mapa con geolocalización
- 🔍 Filtros avanzados por categoría, ubicación y radio
- 📱 Visualización de información completa del negocio
- 🛒 Navegación por tiendas virtuales y catálogo de productos

### Para Dueños de Negocios
- 📝 Registro y publicación de negocio
- 🏬 Gestión de tienda virtual (según plan)
- 📦 Gestión de productos físicos y digitales
- 📊 Estadísticas de visualizaciones y ventas
- 🤖 Asistente IA para descripciones (plan Diamante)

### Para Administradores
- 👥 Gestión de usuarios y roles
- ✅ Aprobación de negocios publicados
- 📈 Panel de estadísticas
- 🏷️ Gestión de categorías
- 💎 Gestión de planes de suscripción

## 💎 Planes de Suscripción

| Plan | Precio | Productos | Características |
|------|--------|-----------|-----------------|
| Básico | €9.99/mes | 0 | Publicación del negocio |
| Plata | €19.99/mes | 5 | Básico + Tienda virtual |
| Oro | €39.99/mes | 20 | Plata + Productos destacados |
| Diamante | €79.99/mes | 100 | Oro + Asistente IA |

## 🚀 Instalación Rápida

```bash
# 1. Instalar dependencias
composer install

# 2. Configurar entorno
cp .env.example .env
php artisan key:generate

# 3. Configurar base de datos en .env
DB_DATABASE=marketplace_db
DB_USERNAME=root
DB_PASSWORD=tu_password

# 4. Ejecutar migraciones y seeders
php artisan migrate --seed

# 5. Iniciar servidor
php artisan serve
```

**Usuarios de prueba:**
- Admin: admin@marketplace.local / admin123
- Owner: owner@marketplace.local / owner123  
- Customer: customer@marketplace.local / customer123

## 📊 Estructura de Base de Datos

✅ 8 tablas creadas con todas las relaciones
✅ 7 modelos Eloquent configurados
✅ Migraciones completas
✅ Seeders con datos de prueba

---

**Estado del proyecto:** Base de datos y modelos completados ✅
**Próximo paso:** Implementar controladores y vistas
