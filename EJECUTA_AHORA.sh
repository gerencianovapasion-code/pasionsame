#!/bin/bash

# Script informativo - muestra qué hacer ahora
clear

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║                                                          ║"
echo "║      🚀 DEPLOYMENT AUTOMÁTICO - LISTO PARA EJECUTAR      ║"
echo "║                                                          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "📍 Estás en: $(pwd)"
echo "👤 Usuario: $(whoami)@$(hostname)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  🎯 SIGUIENTE PASO:"
echo ""
echo "     bash deploy.sh"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  ✅ Esto va a:"
echo "     • Crear 37 tablas en la base de datos"
echo "     • Compilar la aplicación"
echo "     • Configurar PM2"
echo "     • Iniciar Next.js y Socket.io"
echo ""
echo "  ⏱️  Tiempo estimado: 5 minutos"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  📚 Archivos de ayuda:"
echo "     • LEER_PRIMERO.md"
echo "     • AHORA_EJECUTA_ESTO.txt"
echo "     • GUIA_DEPLOYMENT_HOSTINGER.md"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
read -p "  ¿Ejecutar bash deploy.sh ahora? (s/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo ""
    echo "  🚀 Iniciando deployment..."
    echo ""
    bash deploy.sh
else
    echo ""
    echo "  ⏸️  Deployment cancelado."
    echo "  Ejecuta 'bash deploy.sh' cuando estés listo."
    echo ""
fi
