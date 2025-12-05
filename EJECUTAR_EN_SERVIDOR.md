# 🚀 EJECUTAR DEPLOYMENT EN SERVIDOR HOSTINGER

## ⚡ INICIO RÁPIDO (5 minutos)

### Paso 1: Conectar al servidor

```bash
ssh root@178.16.140.137
```

### Paso 2: Ir al directorio del proyecto

```bash
cd /home/pasionsame
```

### Paso 3: Ejecutar script de deployment

```bash
bash deploy.sh
```

El script automáticamente:
- ✅ Instala dependencias
- ✅ Genera cliente Prisma
- ✅ Crea las 37 tablas en la base de datos
- ✅ Compila la aplicación
- ✅ Configura y ejecuta PM2
- ✅ Inicia Next.js y Socket.io

---

## 📋 VERIFICAR QUE TODO FUNCIONA

```bash
# Ver estado de las apps
pm2 status

# Ver logs en tiempo real
pm2 logs

# Probar Next.js
curl http://localhost:3000

# Probar Socket.io
curl http://localhost:3001
```

Deberías ver:
```
┌─────┬──────────────┬─────────┬─────────┐
│ id  │ name         │ status  │ cpu     │
├─────┼──────────────┼─────────┼─────────┤
│ 0   │ nextjs-app   │ online  │ 0%      │
│ 1   │ socket-server│ online  │ 0%      │
└─────┴──────────────┴─────────┴─────────┘
```

---

## 🔧 SI YA CONFIGURASTE .env ANTES

Si ya tienes el archivo `.env` configurado con tus credenciales:

```bash
# Simplemente ejecuta
bash deploy.sh
```

## 🔧 SI ES LA PRIMERA VEZ

Antes de ejecutar `deploy.sh`, configura el archivo `.env`:

```bash
# 1. Copiar ejemplo
cp .env.example .env

# 2. Editar
nano .env

# 3. Configurar MÍNIMO estas variables:
# - DATABASE_URL (con tus credenciales de MySQL)
# - NEXTAUTH_SECRET (generar con: openssl rand -base64 32)
# - NEXTAUTH_URL (tu dominio principal)
# - STRIPE keys (de Stripe dashboard)

# 4. Guardar: Ctrl+O, Enter, Ctrl+X

# 5. Ejecutar deployment
bash deploy.sh
```

---

## 📊 DESPUÉS DEL DEPLOYMENT

### 1. Verificar Base de Datos

```bash
# Conectar a MySQL
mysql -u infl_pasiones_user -p infl_pasiones_prod

# Ver tablas (deberían ser 37)
SHOW TABLES;

# Salir
exit
```

### 2. Configurar Firewall

```bash
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --permanent --add-port=3000/tcp
firewall-cmd --permanent --add-port=3001/tcp
firewall-cmd --reload
```

### 3. Configurar Dominios en CyberPanel

Ver guía completa: **GUIA_DEPLOYMENT_HOSTINGER.md** - Sección "FASE 5"

Resumen:
1. Ir a CyberPanel → Websites → Create Website
2. Crear sitios para los 5 dominios
3. Configurar proxy reverso (vHost Conf)
4. Instalar SSL (Manage SSL)
5. Reiniciar: `systemctl restart lsws`

---

## 🔄 ACTUALIZAR LA APLICACIÓN

Cuando hagas cambios en el código:

```bash
cd /home/pasionsame

# Pull últimos cambios de GitHub
git pull origin main

# Re-ejecutar deployment
bash deploy.sh
```

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### Error: "Can't reach database server"

```bash
# Verificar que MySQL esté corriendo
systemctl status mysqld

# Si no está corriendo
systemctl start mysqld

# Verificar credenciales en .env
cat .env | grep DATABASE_URL
```

### Error: "PM2 not found"

```bash
npm install -g pm2
```

### Apps no inician

```bash
# Ver logs para identificar error
pm2 logs

# Reiniciar
pm2 restart all

# Si persiste, eliminar y recrear
pm2 delete all
bash deploy.sh
```

### Error: "Build failed"

```bash
# Limpiar caché
rm -rf .next
rm -rf node_modules

# Reinstalar
bun install
bun run build
```

---

## 📋 COMANDOS ÚTILES PM2

```bash
# Ver estado
pm2 status

# Ver logs en tiempo real
pm2 logs

# Ver logs de app específica
pm2 logs nextjs-app
pm2 logs socket-server

# Reiniciar todas las apps
pm2 restart all

# Reiniciar app específica
pm2 restart nextjs-app

# Detener todas las apps
pm2 stop all

# Ver info detallada
pm2 info nextjs-app

# Monitor en tiempo real
pm2 monit

# Ver uso de recursos
pm2 ls
```

---

## 📁 ESTRUCTURA DE ARCHIVOS EN SERVIDOR

```
/home/pasionsame/
├── .env                    # Variables de entorno (CONFIGURAR PRIMERO)
├── deploy.sh               # Script de deployment ⭐
├── ecosystem.config.js     # Config de PM2 (se crea automáticamente)
├── package.json
├── prisma/
│   └── schema.prisma
├── src/
├── public/
│   └── uploads/           # Directorio de archivos subidos
├── logs/                  # Logs de PM2
│   ├── nextjs-out.log
│   ├── nextjs-error.log
│   ├── socket-out.log
│   └── socket-error.log
└── .next/                 # Build de Next.js
```

---

## ✅ CHECKLIST POST-DEPLOYMENT

Después de ejecutar `deploy.sh`:

- [ ] Apps corriendo (`pm2 status` muestra "online")
- [ ] No hay errores en logs (`pm2 logs`)
- [ ] Base de datos tiene 37 tablas
- [ ] Firewall configurado
- [ ] Dominios creados en CyberPanel
- [ ] Proxy reverso configurado
- [ ] SSL instalado
- [ ] Sitios accesibles vía HTTPS

---

## 🎉 ¡LISTO!

Una vez completado:

1. **Probar en navegador:**
   - https://influencersex.com
   - https://novapasion.com
   - https://pasionred.com
   - https://todofans.com
   - https://todofans.es

2. **Crear cuenta de prueba**
3. **Configurar Stripe webhooks**
4. **¡Empezar a recibir usuarios!**

---

**Documentación completa:** GUIA_DEPLOYMENT_HOSTINGER.md
**Ayuda rápida:** Ver sección "SOLUCIÓN DE PROBLEMAS" arriba
