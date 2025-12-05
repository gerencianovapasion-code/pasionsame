#!/bin/bash

# 🔍 Script de Verificación Completa del Sistema
# Ejecutar antes del deployment para asegurar que todo funciona

set -e

echo "════════════════════════════════════════════════════"
echo "🔍 VERIFICACIÓN COMPLETA DEL SISTEMA"
echo "════════════════════════════════════════════════════"
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
    ((ERRORS++))
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# 1. VERIFICAR ARCHIVOS ESENCIALES
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Verificando archivos esenciales..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

files_to_check=(
    "package.json"
    ".env"
    "prisma/schema.prisma"
    "src/lib/auth.ts"
    "src/lib/db/prisma.ts"
    "src/app/api/auth/[...nextauth]/route.ts"
    "server.js"
    "middleware.ts"
    "i18n.ts"
    "next.config.js"
)

for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        log_success "$file existe"
    else
        log_error "$file NO EXISTE"
    fi
done

# 2. VERIFICAR DEPENDENCIAS
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. Verificando dependencias..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -d "node_modules" ]; then
    log_success "node_modules existe"

    # Verificar paquetes críticos
    critical_packages=(
        "next"
        "react"
        "@prisma/client"
        "next-auth"
        "stripe"
        "socket.io"
        "bcryptjs"
    )

    for pkg in "${critical_packages[@]}"; do
        if [ -d "node_modules/$pkg" ]; then
            log_success "Paquete $pkg instalado"
        else
            log_error "Paquete $pkg NO INSTALADO"
        fi
    done
else
    log_error "node_modules NO EXISTE - ejecuta bun install"
fi

# 3. VERIFICAR VARIABLES DE ENTORNO
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. Verificando variables de entorno..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f ".env" ]; then
    required_vars=(
        "DATABASE_URL"
        "NEXTAUTH_SECRET"
        "NEXTAUTH_URL"
        "STRIPE_SECRET_KEY"
        "STRIPE_PUBLISHABLE_KEY"
    )

    for var in "${required_vars[@]}"; do
        if grep -q "^${var}=" .env; then
            value=$(grep "^${var}=" .env | cut -d '=' -f 2)
            if [[ "$value" == *"ejemplo"* ]] || [[ "$value" == *"password"* ]] || [[ "$value" == *"temporal"* ]]; then
                log_warning "$var configurado pero usa valor de ejemplo"
            else
                log_success "$var configurado"
            fi
        else
            log_error "$var NO CONFIGURADO en .env"
        fi
    done
else
    log_error "Archivo .env NO EXISTE"
fi

# 4. VERIFICAR PRISMA
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4. Verificando Prisma..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if command -v bun &> /dev/null; then
    log_info "Generando cliente Prisma..."
    if bunx prisma generate > /dev/null 2>&1; then
        log_success "Cliente Prisma generado correctamente"
    else
        log_error "Error al generar cliente Prisma"
    fi
else
    log_warning "Bun no está instalado, usando npm"
    if npx prisma generate > /dev/null 2>&1; then
        log_success "Cliente Prisma generado correctamente"
    else
        log_error "Error al generar cliente Prisma"
    fi
fi

# 5. VERIFICAR ESTRUCTURA DE DIRECTORIOS
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5. Verificando estructura de directorios..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

directories=(
    "src/app"
    "src/app/api"
    "src/components"
    "src/lib"
    "public"
    "prisma"
)

for dir in "${directories[@]}"; do
    if [ -d "$dir" ]; then
        log_success "Directorio $dir existe"
    else
        log_error "Directorio $dir NO EXISTE"
    fi
done

# 6. COMPILAR TYPESCRIPT
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6. Verificando TypeScript..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

log_info "Compilando TypeScript (esto puede tardar)..."
if bunx tsc --noEmit > /dev/null 2>&1; then
    log_success "TypeScript compila sin errores"
else
    log_warning "TypeScript tiene algunos errores (no críticos si el build funciona)"
fi

# 7. BUILD DE NEXT.JS
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "7. Verificando build de Next.js..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

log_info "Compilando aplicación Next.js (esto puede tardar 1-2 min)..."
if bun run build > /tmp/build.log 2>&1; then
    log_success "Build de Next.js completado exitosamente"

    # Contar páginas generadas
    if [ -d ".next/server/app" ]; then
        page_count=$(find .next/server/app -name "*.html" -o -name "*.js" | wc -l)
        log_info "Páginas generadas: ~$page_count"
    fi
else
    log_error "Build de Next.js FALLÓ"
    log_info "Ver detalles en /tmp/build.log"
    tail -20 /tmp/build.log
fi

# 8. VERIFICAR APIS
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "8. Verificando API routes..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

api_routes=(
    "src/app/api/auth/[...nextauth]/route.ts"
    "src/app/api/register/route.ts"
    "src/app/api/models/update/route.ts"
    "src/app/api/upload/route.ts"
    "src/app/api/posts/create/route.ts"
    "src/app/api/subscriptions/create/route.ts"
    "src/app/api/webhooks/stripe/route.ts"
    "src/app/api/withdrawals/create/route.ts"
)

for route in "${api_routes[@]}"; do
    if [ -f "$route" ]; then
        log_success "API route: $route"
    else
        log_error "API route NO EXISTE: $route"
    fi
done

# 9. VERIFICAR SCRIPTS DE DEPLOYMENT
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "9. Verificando scripts de deployment..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

deployment_scripts=(
    "deploy.sh"
    "EJECUTA_AHORA.sh"
    "LEER_PRIMERO.md"
    "GUIA_DEPLOYMENT_HOSTINGER.md"
)

for script in "${deployment_scripts[@]}"; do
    if [ -f "$script" ]; then
        log_success "Script: $script"
    else
        log_warning "Script NO EXISTE: $script"
    fi
done

# RESUMEN FINAL
echo ""
echo "════════════════════════════════════════════════════"
echo "📊 RESUMEN DE VERIFICACIÓN"
echo "════════════════════════════════════════════════════"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ ¡SISTEMA 100% VERIFICADO!${NC}"
    echo "  No se encontraron errores ni advertencias"
    echo ""
    echo "✅ El sistema está listo para deployment"
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ SISTEMA VERIFICADO CON ADVERTENCIAS${NC}"
    echo "  Errores: $ERRORS"
    echo "  Advertencias: $WARNINGS"
    echo ""
    echo "⚠️  Revisa las advertencias antes de hacer deployment"
else
    echo -e "${RED}✗ SISTEMA CON ERRORES${NC}"
    echo "  Errores: $ERRORS"
    echo "  Advertencias: $WARNINGS"
    echo ""
    echo "❌ CORRIGE LOS ERRORES antes de hacer deployment"
    exit 1
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "🚀 PRÓXIMO PASO: bash deploy.sh"
echo "════════════════════════════════════════════════════"
