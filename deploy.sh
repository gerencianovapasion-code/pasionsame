#!/bin/bash

# 🚀 Script de Deployment Automático para Hostinger VPS
# Ejecutar: bash deploy.sh

set -e  # Salir si hay error
set -o pipefail  # Capturar errores en pipes

echo "════════════════════════════════════════════════════"
echo "🚀 DEPLOYMENT - Red Social Multi-Sitio"
echo "════════════════════════════════════════════════════"
echo ""

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para log
log() {
    echo -e "${GREEN}✓${NC} $1"
}

error() {
    echo -e "${RED}✗${NC} $1"
}

info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    error "No se encuentra package.json. Ejecuta este script desde el directorio del proyecto."
    exit 1
fi

log "Directorio del proyecto detectado"

# PASO 1: Verificar archivo .env
echo ""
info "PASO 1/7: Verificando configuración..."

if [ ! -f ".env" ]; then
    error "Archivo .env no encontrado"
    warn "Copia .env.example a .env y configura las variables"
    warn "cp .env.example .env && nano .env"
    exit 1
fi

log "Archivo .env encontrado"

# PASO 2: Instalar dependencias
echo ""
info "PASO 2/7: Instalando dependencias..."

if command -v bun &> /dev/null; then
    bun install
    log "Dependencias instaladas con Bun"
else
    npm install
    log "Dependencias instaladas con npm"
fi

# PASO 3: Generar cliente Prisma
echo ""
info "PASO 3/7: Generando cliente Prisma..."

if command -v bun &> /dev/null; then
    bunx prisma generate
else
    npx prisma generate
fi

log "Cliente Prisma generado"

# PASO 4: Sincronizar base de datos
echo ""
info "PASO 4/7: Sincronizando base de datos..."
warn "Esto creará las 37 tablas en la base de datos"

read -p "¿Continuar con la sincronización de BD? (s/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Ss]$ ]]; then
    if command -v bun &> /dev/null; then
        bunx prisma db push --accept-data-loss
    else
        npx prisma db push --accept-data-loss
    fi
    log "Base de datos sincronizada (37 tablas creadas)"
else
    warn "Sincronización de BD omitida"
fi

# PASO 5: Build de producción
echo ""
info "PASO 5/7: Compilando aplicación..."

if command -v bun &> /dev/null; then
    bun run build
else
    npm run build
fi

log "Build completado exitosamente"

# PASO 6: Crear directorios necesarios
echo ""
info "PASO 6/7: Creando directorios..."

mkdir -p logs
mkdir -p public/uploads/profiles
mkdir -p public/uploads/covers
mkdir -p public/uploads/posts
mkdir -p public/uploads/videos

chmod -R 755 public/uploads
chmod -R 755 logs

log "Directorios creados"

# PASO 7: Configurar PM2
echo ""
info "PASO 7/7: Configurando PM2..."

# Verificar si PM2 está instalado
if ! command -v pm2 &> /dev/null; then
    warn "PM2 no está instalado. Instalando..."
    npm install -g pm2
fi

# Detener procesos existentes si existen
pm2 delete nextjs-app 2>/dev/null || true
pm2 delete socket-server 2>/dev/null || true

# Crear archivo de configuración PM2 si no existe
if [ ! -f "ecosystem.config.cjs" ]; then
    cat > ecosystem.config.cjs << 'EOL'
module.exports = {
  apps: [
    {
      name: 'nextjs-app',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: process.cwd(),
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/nextjs-error.log',
      out_file: './logs/nextjs-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '1G'
    },
    {
      name: 'socket-server',
      script: './server.js',
      cwd: process.cwd(),
      instances: 1,
      env: {
        NODE_ENV: 'production'
      },
      error_file: './logs/socket-error.log',
      out_file: './logs/socket-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      autorestart: true,
      max_memory_restart: '500M'
    }
  ]
}
EOL
    log "Archivo ecosystem.config.cjs creado"
fi

# Eliminar archivo antiguo si existe
rm -f ecosystem.config.js

# Iniciar aplicaciones
pm2 start ecosystem.config.cjs

# Guardar configuración PM2
pm2 save

log "Aplicaciones iniciadas con PM2"

# Mostrar estado
echo ""
info "Estado de las aplicaciones:"
pm2 status

# Mostrar logs
echo ""
info "Últimas líneas de logs:"
pm2 logs --lines 10 --nostream

# RESUMEN FINAL
echo ""
echo "════════════════════════════════════════════════════"
echo -e "${GREEN}✓ DEPLOYMENT COMPLETADO EXITOSAMENTE${NC}"
echo "════════════════════════════════════════════════════"
echo ""
log "Next.js corriendo en: http://localhost:3000"
log "Socket.io corriendo en: http://localhost:3001"
echo ""
info "Comandos útiles:"
echo "  pm2 status          - Ver estado de apps"
echo "  pm2 logs            - Ver logs en tiempo real"
echo "  pm2 restart all     - Reiniciar todas las apps"
echo "  pm2 monit           - Monitor en tiempo real"
echo ""
warn "PRÓXIMOS PASOS:"
echo "  1. Configurar dominios en CyberPanel"
echo "  2. Configurar proxy reverso (ver GUIA_DEPLOYMENT_HOSTINGER.md)"
echo "  3. Instalar certificados SSL"
echo "  4. Configurar firewall"
echo "  5. Configurar webhooks de Stripe"
echo ""
info "Documentación completa: GUIA_DEPLOYMENT_HOSTINGER.md"
echo ""
echo "════════════════════════════════════════════════════"
