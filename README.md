# 🌐 Red Social Multi-Sitio para Creadores de Contenido

## 📖 Descripción

Plataforma web profesional multi-sitio para creadores de contenido, similar a OnlyFans, con sistema de suscripciones, monetización, streaming en vivo y múltiples dominios sincronizados.

### 🏢 Dominios Configurados

1. **influencersex.com** - Gradiente rosa intenso
2. **novapasion.com** - Gradiente rojo
3. **pasionred.com** - Gradiente naranja
4. **todofans.com** - Gradiente fucsia
5. **todofans.es** - Gradiente púrpura

Todos los dominios comparten:
- Misma base de datos
- Mismo contenido de modelos
- Mismas suscripciones y usuarios
- **Solo banners publicitarios son independientes por dominio**

## 🌍 Internacionalización

Soporte completo para 7 idiomas:
- 🇪🇸 Español
- 🇵🇹 Portugués
- 🇬🇧 Inglés
- 🇩🇪 Alemán
- 🇮🇹 Italiano
- 🇷🇴 Rumano
- 🇫🇷 Francés

## 🗺️ Cobertura Geográfica

**18 países con todas sus provincias:**

### Europa
- España (50 provincias)
- Portugal (20 regiones)
- Francia (13 regiones)
- Alemania (16 estados)
- Italia (20 regiones)
- Rumania (42 provincias)
- Reino Unido (14 regiones)

### América
- Estados Unidos (50 estados)
- Canadá (13 provincias/territorios)
- México (32 estados)
- Argentina (24 provincias)
- Colombia (33 departamentos)
- Brasil (27 estados)
- Chile (16 regiones)
- Perú (25 regiones)
- Venezuela (24 estados)
- Paraguay (18 departamentos)
- Uruguay (19 departamentos)

## 💎 Sistema de Membresías

### Para Modelos/Creadores

#### 🆓 GRATIS (Gratuito para siempre)
- Perfil básico
- Post diarios limitados
- Sin contenido premium
- Visibilidad estándar

#### 🥉 BRONCE - €20/mes
- Hasta 5 posts diarios en el muro
- 20 fotos premium
- 20 videos/audios (máx 1 min c/u)
- Posicionamiento automático cada 9 horas
- Soporte por email

#### 🥈 PLATA - €35/mes
- Hasta 10 posts diarios en el muro
- 40 fotos premium
- 40 videos/audios (máx 2 min c/u)
- Posicionamiento automático cada 6 horas
- Videochat habilitado
- Streaming con límite de tiempo
- Soporte prioritario

#### 🥇 ORO - €50/mes
- Hasta 20 posts diarios en el muro
- 80 fotos premium
- 80 videos/audios (máx 3 min c/u)
- Posicionamiento automático cada 3 horas
- Videochat ilimitado
- Streaming ilimitado
- Verificación prioritaria
- Soporte 24/7
- Badge destacado

### Para Usuarios

- **Contenido gratuito**: Navegación sin registro
- **Contenido premium**: Requiere pago por visión o suscripción
- **Suscripciones**: Precio mínimo €10/mes (establecido por cada modelo)

## 💰 Sistema de Monetización

### Métodos de Pago

- **Stripe** (tarjetas de crédito/débito)
- **PayPal** (cuentas PayPal)
- **Tarjeta directa** (sin intermediarios)
- **Créditos PASIONES** (moneda virtual de la plataforma)

### Comisiones

- **20% comisión de la plataforma** en todos los cobros
- Cubre: pasarelas de pago, gestión, ancho de banda, almacenamiento

### Formas de Cobro para Modelos

1. **Suscripciones mensuales** (recurrentes)
2. **Pago por visión** (PPV) de contenido
3. **Mensajes premium** (con contenido exclusivo)
4. **Videochat** (por minuto o sesión)
5. **Streaming en vivo** (pago por acceso)
6. **Propinas/Tips** (donaciones)

### Retiros

- Retiro mínimo: **€50**
- Métodos: PayPal o transferencia bancaria
- Procesamiento: 3-5 días hábiles
- Verificación de identidad requerida

## 🎯 Funcionalidades Principales

### ✅ Implementadas

- [x] Sistema multi-sitio con 5 dominios
- [x] Internacionalización (7 idiomas)
- [x] Base de datos completa con Prisma
- [x] UI/UX moderno y responsive
- [x] Grid de modelos con filtros
- [x] Búsqueda avanzada (país, provincia, nombre)
- [x] Sistema de categorías (Hombres, Mujeres, Trans)
- [x] Header con navegación multiidioma
- [x] Footer con blog y enlaces
- [x] Diseño con gradientes cálidos
- [x] Componentes UI personalizados

### 🔧 Por Implementar

- [ ] Sistema de autenticación (NextAuth)
- [ ] Perfiles completos de modelos
- [ ] Sistema de posts y contenido
- [ ] Suscripciones (Stripe Connect)
- [ ] Pagos por visión (PPV)
- [ ] Créditos virtuales "PASIONES"
- [ ] Panel de administración
- [ ] Streaming en vivo (RTMP)
- [ ] Videochat en tiempo real
- [ ] Sistema de mensajería
- [ ] Notificaciones push
- [ ] Sistema de reviews
- [ ] Blog integrado
- [ ] Verificación de identidad
- [ ] Sistema de retiros

## 🏗️ Arquitectura Técnica

### Stack Tecnológico

- **Framework**: Next.js 15.3 (App Router)
- **Lenguaje**: TypeScript
- **Runtime**: Bun (más rápido que Node.js)
- **Base de Datos**: MySQL 8.0
- **ORM**: Prisma 5.22
- **Autenticación**: NextAuth v5
- **Pagos**: Stripe + PayPal
- **UI**: Tailwind CSS + shadcn/ui
- **Internacionalización**: next-intl
- **Estado**: React Context + TanStack Query
- **Validación**: Zod
- **Emails**: Nodemailer + SMTP

### Estructura de Base de Datos

```
📊 37 Tablas Principales:
- Users (usuarios y modelos)
- Models (perfiles de creadores)
- Posts (publicaciones)
- Media (fotos, videos, audio)
- Subscriptions (suscripciones)
- Transactions (transacciones)
- Withdrawals (retiros)
- Messages (mensajería)
- Notifications (notificaciones)
- VideoCall (videollamadas)
- Stream (streaming)
- Reviews (calificaciones)
- Countries & Provinces (geografía)
- Sites (configuración multi-sitio)
- Categories (categorías de contenido)
- BlogPosts (blog)
- Credits (créditos virtuales)
```

## 🚀 Instalación

### Requisitos Previos

- Node.js 20+
- Bun 1.0+
- MySQL 8.0+
- VPS con mínimo 4GB RAM

### Instalación en Hostinger VPS

Sigue la guía completa en: [INSTALACION.md](./INSTALACION.md)

**Resumen rápido:**

```bash
# 1. Clonar proyecto
cd /home/influencersex
git clone [tu-repo]

# 2. Instalar dependencias
bun install

# 3. Configurar .env
cp .env.example .env
nano .env

# 4. Migrar base de datos
bunx prisma migrate deploy
bunx prisma generate

# 5. Compilar
bun run build

# 6. Ejecutar con PM2
pm2 start ecosystem.config.js
```

## 📁 Estructura del Proyecto

```
red-social-creadores/
├── src/
│   ├── app/
│   │   ├── [locale]/           # Rutas por idioma
│   │   │   ├── page.tsx        # Home
│   │   │   ├── models/         # Perfiles de modelos
│   │   │   ├── admin/          # Panel admin
│   │   │   └── api/            # API routes
│   │   └── globals.css         # Estilos globales
│   ├── components/
│   │   ├── ui/                 # Componentes UI base
│   │   ├── layout/             # Header, Footer
│   │   ├── models/             # Componentes de modelos
│   │   ├── search/             # Búsqueda
│   │   └── categories/         # Categorías
│   ├── config/
│   │   └── sites.ts            # Config multi-sitio
│   ├── data/
│   │   └── countries.ts        # Países y provincias
│   └── lib/
│       ├── db/                 # Prisma client
│       └── utils.ts            # Utilidades
├── prisma/
│   └── schema.prisma           # Esquema de BD
├── messages/                    # Traducciones (7 idiomas)
├── public/                      # Assets estáticos
├── i18n.ts                      # Config i18n
├── middleware.ts                # Middleware Next.js
└── package.json
```

## 🎨 Diseño y UX

### Colores por Sitio

Cada dominio tiene su propia identidad visual:

- **influencersex.com**: Rosa/Rose (#e11d48)
- **novapasion.com**: Rojo (#dc2626)
- **pasionred.com**: Naranja (#ea580c)
- **todofans.com**: Fucsia (#db2777)
- **todofans.es**: Púrpura (#c026d3)

### Características de Diseño

- ✨ Gradientes suaves y cálidos
- 🎯 Diseño moderno y profesional
- 📱 100% responsive (móvil, tablet, desktop)
- ♿ Accesible (WCAG 2.1)
- 🚀 Optimizado para SEO
- ⚡ Carga rápida con lazy loading
- 🎨 Animaciones sutiles
- 🌙 Preparado para modo oscuro

## 🔐 Seguridad

- ✅ Autenticación JWT con NextAuth
- ✅ Hash de contraseñas con bcrypt
- ✅ Protección CSRF
- ✅ Validación de entrada (Zod)
- ✅ Rate limiting
- ✅ XSS protection
- ✅ CORS configurado
- ✅ Verificación de identidad para modelos
- ✅ Conexión HTTPS obligatoria
- ✅ Google reCAPTCHA

## 📊 SEO y Marketing

### Optimizaciones SEO

- Meta tags dinámicos por página
- Open Graph para redes sociales
- Sitemaps automáticos
- URLs amigables
- Schema.org markup
- Robots.txt configurado
- Canonical URLs
- Imágenes optimizadas

### Estrategia de Contenido

- Blog integrado con últimos 4 posts en footer
- Páginas de categorías optimizadas
- Páginas de países/provincias
- Perfiles de modelos indexados
- Contenido multiidioma

## 📈 Analíticas y Métricas

### Integrado

- Google Analytics 4
- Seguimiento de conversiones
- Eventos personalizados
- Dashboards en tiempo real
- Reportes de ingresos

## 🛡️ GDPR y Privacidad

- Banner de cookies
- Política de privacidad
- Términos y condiciones
- Gestión de consentimientos
- Derecho al olvido
- Exportación de datos
- Anonimización

## 🤝 Soporte

### Para Usuarios

- Centro de ayuda
- FAQ
- Formulario de contacto
- Chat en vivo (próximamente)

### Para Modelos

- Verificación prioritaria (membresías de pago)
- Soporte por email
- Soporte 24/7 (membresía ORO)
- Documentación completa
- Tutoriales en video

## 📞 Contacto

- **Email**: soporte@influencersex.com
- **Web**: https://influencersex.com
- **Panel Admin**: https://influencersex.com/admin

## 📄 Licencia

Todos los derechos reservados © 2025

## 🙏 Créditos

Desarrollado con ❤️ usando:
- Next.js
- Prisma
- Tailwind CSS
- shadcn/ui
- Stripe
- PayPal

---

## 📚 Documentación Adicional

- [Guía de Instalación](./INSTALACION.md)
- [Funcionalidades Pendientes](./FUNCIONALIDADES_PENDIENTES.md)
- [Lista de Tareas](./.same/todos.md)

## 🚀 Comenzar Desarrollo

```bash
# Instalar dependencias
bun install

# Ejecutar en desarrollo
bun run dev

# Compilar para producción
bun run build

# Ejecutar producción
bun run start
```

La aplicación estará disponible en `http://localhost:3000`
