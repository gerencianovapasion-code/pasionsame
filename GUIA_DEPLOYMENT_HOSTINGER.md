# 🚀 GUÍA COMPLETA DE DEPLOYMENT EN HOSTINGER VPS

## 📋 Información de tu VPS

```
IP: 178.16.140.137
Panel: CyberPanel (Puerto 8090)
OS: AlmaLinux 9
RAM: 7682 MB
Disco: 99 GB
CPU: 2 núcleos
```

**Accesos:**
- CyberPanel: https://178.16.140.137:8090
- phpMyAdmin: https://178.16.140.137:8090/dataBases/phpMyAdmin
- SSH: `ssh root@178.16.140.137`

---

## ⏱️ Tiempo Estimado Total: 2-3 horas

- Preparación del servidor: 45 min
- Configuración de base de datos: 30 min
- Deploy de la aplicación: 45 min
- Configuración de dominios: 30 min
- Pruebas finales: 30 min

---

## 📌 FASE 1: PREPARACIÓN DEL SERVIDOR (45 min)

### Paso 1.1: Conectar por SSH

```bash
ssh root@178.16.140.137
```

### Paso 1.2: Actualizar el Sistema

```bash
# Actualizar paquetes
dnf update -y

# Instalar herramientas básicas
dnf install -y git curl wget nano htop
```

### Paso 1.3: Instalar Node.js 20

```bash
# Descargar e instalar Node.js 20.x
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
dnf install -y nodejs

# Verificar instalación
node --version   # Debe mostrar v20.x.x
npm --version    # Debe mostrar 10.x.x
```

### Paso 1.4: Instalar Bun

```bash
# Instalar Bun (más rápido que npm/yarn)
curl -fsSL https://bun.sh/install | bash

# Agregar Bun al PATH
echo 'export BUN_INSTALL="$HOME/.bun"' >> ~/.bashrc
echo 'export PATH="$BUN_INSTALL/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Verificar instalación
bun --version    # Debe mostrar 1.x.x
```

### Paso 1.5: Instalar PM2 (Gestor de Procesos)

```bash
npm install -g pm2

# Verificar
pm2 --version
```

### Paso 1.6: Crear Directorio del Proyecto

```bash
# Crear directorio
mkdir -p /home/pasionsame
cd /home/pasionsame

# Establecer permisos
chmod 755 /home/pasionsame
```

✅ **Checkpoint 1:** Servidor preparado con Node.js, Bun y PM2

---

## 📌 FASE 2: CLONAR PROYECTO DESDE GITHUB (10 min)

### Paso 2.1: Clonar Repositorio

```bash
cd /home/pasionsame

# Clonar el proyecto
git clone https://github.com/gerencianovapasion-code/pasionsame.git .

# Verificar archivos
ls -la
```

Deberías ver:
```
.env.example
package.json
prisma/
src/
README.md
... y otros archivos
```

### Paso 2.2: Instalar Dependencias

```bash
# Instalar todas las dependencias
bun install

# Esto tomará 2-3 minutos
```

✅ **Checkpoint 2:** Proyecto clonado y dependencias instaladas

---

## 📌 FASE 3: CONFIGURAR BASE DE DATOS (30 min)

### Paso 3.1: Crear Base de Datos en phpMyAdmin

1. **Abrir phpMyAdmin:**
   ```
   https://178.16.140.137:8090/dataBases/phpMyAdmin
   ```

2. **Iniciar sesión** con tus credenciales de CyberPanel

3. **Crear nueva base de datos:**
   - Click en "Nueva" (New)
   - Nombre: `pasiones_prod`
   - Cotejamiento: `utf8mb4_unicode_ci`
   - Click "Crear" (Create)

4. **Crear usuario de base de datos:**
   - Ir a la pestaña "Privilegios" (Privileges)
   - Click "Agregar cuenta de usuario" (Add user account)
   - Nombre de usuario: `pasiones_user`
   - Nombre del host: `localhost`
   - Contraseña: (genera una segura, guárdala)
   - Marcar: "Conceder todos los privilegios para la base de datos"
   - Click "Continuar"

**IMPORTANTE:** Anota estas credenciales:
```
Base de datos: pasiones_prod
Usuario: pasiones_user
Contraseña: [TU_CONTRASEÑA_AQUÍ]
Host: localhost
```

### Paso 3.2: Configurar Variables de Entorno

```bash
cd /home/pasionsame

# Copiar archivo de ejemplo
cp .env.example .env

# Editar archivo .env
nano .env
```

**Configurar las siguientes variables:**

```env
# ============================================
# BASE DE DATOS
# ============================================
DATABASE_URL="mysql://pasiones_user:TU_CONTRASEÑA@localhost:3306/pasiones_prod"

# ============================================
# NEXTAUTH
# ============================================
# Generar secreto seguro (ejecutar: openssl rand -base64 32)
NEXTAUTH_SECRET="TU_SECRETO_GENERADO_AQUÍ"
NEXTAUTH_URL="https://influencersex.com"

# ============================================
# STRIPE (Modo Live)
# ============================================
# Obtener de: https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."  # Configurar después

# ============================================
# PAYPAL (Modo Live)
# ============================================
# Obtener de: https://developer.paypal.com/
PAYPAL_CLIENT_ID="..."
PAYPAL_SECRET="..."
PAYPAL_MODE="live"

# ============================================
# GOOGLE OAUTH
# ============================================
# Obtener de: https://console.cloud.google.com/
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# ============================================
# FACEBOOK OAUTH
# ============================================
# Obtener de: https://developers.facebook.com/
FACEBOOK_CLIENT_ID="..."
FACEBOOK_CLIENT_SECRET="..."

# ============================================
# SMTP (Hostinger)
# ============================================
SMTP_HOST="smtp.hostinger.com"
SMTP_PORT="465"
SMTP_USER="noreply@influencersex.com"  # Crear después
SMTP_PASSWORD="..."
SMTP_FROM="Red Social <noreply@influencersex.com>"

# ============================================
# SOCKET.IO
# ============================================
SOCKET_PORT="3001"
NEXT_PUBLIC_SOCKET_URL="https://influencersex.com:3001"
NEXT_PUBLIC_APP_URL="https://influencersex.com"

# ============================================
# ALMACENAMIENTO
# ============================================
STORAGE_TYPE="local"
STORAGE_PATH="/home/pasionsame/public/uploads"

# ============================================
# MULTI-SITIO
# ============================================
SITES="influencersex.com,novapasion.com,pasionred.com,todofans.com,todofans.es"

# ============================================
# STREAMING (Configurar después)
# ============================================
STREAMING_SERVER="rtmp://178.16.140.137/live"
HLS_SERVER="http://178.16.140.137:8080/hls"

# ============================================
# CONFIGURACIÓN
# ============================================
MINIMUM_WITHDRAWAL=50
PLATFORM_FEE=20
```

**Guardar:** `Ctrl + O`, `Enter`, `Ctrl + X`

### Paso 3.3: Generar Secreto de NextAuth

```bash
# Generar secreto
openssl rand -base64 32

# Copiar el resultado y pegarlo en .env en NEXTAUTH_SECRET
```

### Paso 3.4: Ejecutar Migraciones de Prisma

```bash
cd /home/pasionsame

# Generar cliente de Prisma
bunx prisma generate

# Ejecutar migraciones (crear todas las 37 tablas)
bunx prisma migrate deploy

# Verificar que se crearon las tablas
bunx prisma studio &
# Abrir en navegador: http://178.16.140.137:5555
```

**Deberías ver 37 tablas creadas:**
- User, Model, Post, Media
- Subscription, Purchase, Transaction
- Withdrawal, VideoCall, Stream
- Message, Notification, etc.

✅ **Checkpoint 3:** Base de datos configurada con 37 tablas

---

## 📌 FASE 4: COMPILAR Y EJECUTAR (20 min)

### Paso 4.1: Build de Producción

```bash
cd /home/pasionsame

# Compilar aplicación
bun run build

# Esto tomará 2-3 minutos
# Deberías ver: "✓ Compiled successfully"
```

### Paso 4.2: Configurar PM2

```bash
# Crear archivo de configuración PM2
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'nextjs-app',
      script: 'bun',
      args: 'run start',
      cwd: '/home/pasionsame',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/home/pasionsame/logs/nextjs-error.log',
      out_file: '/home/pasionsame/logs/nextjs-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    },
    {
      name: 'socket-server',
      script: 'bun',
      args: 'run server.js',
      cwd: '/home/pasionsame',
      instances: 1,
      env: {
        NODE_ENV: 'production'
      },
      error_file: '/home/pasionsame/logs/socket-error.log',
      out_file: '/home/pasionsame/logs/socket-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
}
EOF

# Crear directorio de logs
mkdir -p /home/pasionsame/logs
```

### Paso 4.3: Iniciar Aplicaciones con PM2

```bash
# Iniciar todas las aplicaciones
pm2 start ecosystem.config.js

# Verificar estado
pm2 status

# Deberías ver:
# ┌─────┬──────────────┬─────────┬─────────┬─────────┐
# │ id  │ name         │ status  │ cpu     │ memory  │
# ├─────┼──────────────┼─────────┼─────────┼─────────┤
# │ 0   │ nextjs-app   │ online  │ 0%      │ 150 MB  │
# │ 1   │ socket-server│ online  │ 0%      │ 50 MB   │
# └─────┴──────────────┴─────────┴─────────┴─────────┘
```

### Paso 4.4: Configurar Inicio Automático

```bash
# Configurar PM2 para iniciar al arrancar el sistema
pm2 startup

# Copiar y ejecutar el comando que aparece (similar a):
# sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u root --hp /root

# Guardar lista de procesos
pm2 save
```

### Paso 4.5: Verificar que las Aplicaciones Funcionen

```bash
# Ver logs en tiempo real
pm2 logs

# Probar Next.js (debería responder)
curl http://localhost:3000

# Probar Socket.io (debería responder)
curl http://localhost:3001

# Si ambos responden, todo está bien ✅
```

✅ **Checkpoint 4:** Aplicaciones compiladas y ejecutándose

---

## 📌 FASE 5: CONFIGURAR DOMINIOS (40 min)

### Paso 5.1: Configurar DNS de los Dominios

**Para CADA uno de los 5 dominios, configurar en tu proveedor de DNS:**

Dominios:
1. influencersex.com
2. novapasion.com
3. pasionred.com
4. todofans.com
5. todofans.es

**Registros DNS a crear:**

```
Tipo: A
Nombre: @
Valor: 178.16.140.137
TTL: 3600

Tipo: A
Nombre: www
Valor: 178.16.140.137
TTL: 3600
```

**NOTA:** La propagación DNS puede tardar 1-24 horas.

### Paso 5.2: Crear Sitios Web en CyberPanel

1. **Abrir CyberPanel:**
   ```
   https://178.16.140.137:8090
   ```

2. **Para cada dominio, crear sitio web:**

   - Ir a: **Websites** → **Create Website**

   **Dominio 1: influencersex.com**
   ```
   Select Package: Default
   Owner: admin
   Domain Name: influencersex.com
   Email: admin@influencersex.com
   PHP: 8.1
   SSL: Let's Encrypt (marcar)
   DKIM Support: (marcar)
   Open BaseDIR: (desmarcar)
   ```
   - Click **Create Website**

   **Repetir para:**
   - novapasion.com
   - pasionred.com
   - todofans.com
   - todofans.es

### Paso 5.3: Configurar Proxy Reverso

**Para CADA dominio:**

1. Ir a: **Websites** → **List Websites**
2. Click en el dominio
3. Ir a: **vHost Conf**
4. Agregar antes de la última llave de cierre `}`:

```nginx
# Proxy para Next.js
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Hostname $host;
    proxy_cache_bypass $http_upgrade;
    proxy_read_timeout 300s;
    proxy_connect_timeout 75s;
}

# Proxy para Socket.io
location /socket.io/ {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# Cache estático
location /_next/static {
    proxy_cache STATIC;
    proxy_pass http://localhost:3000;
    add_header Cache-Control "public, max-age=31536000, immutable";
}

# Uploads
location /uploads {
    alias /home/pasionsame/public/uploads;
    expires 30d;
    add_header Cache-Control "public, no-transform";
}
```

5. Click **Save Changes**

### Paso 5.4: Instalar Certificados SSL

**Para CADA dominio:**

1. Ir a: **SSL** → **Manage SSL**
2. Seleccionar el dominio
3. Click **Issue SSL**
4. Seleccionar **Let's Encrypt**
5. Click **Issue Now**

Repetir para todos los dominios.

### Paso 5.5: Forzar HTTPS

1. Ir a: **Websites** → **List Websites**
2. Para cada dominio, click en **Manage**
3. Ir a **SSL**
4. Marcar **Force HTTPS**
5. Click **Save Changes**

### Paso 5.6: Reiniciar OpenLiteSpeed

```bash
systemctl restart lsws
```

✅ **Checkpoint 5:** Todos los dominios configurados con SSL

---

## 📌 FASE 6: CONFIGURAR FIREWALL (10 min)

```bash
# Verificar estado del firewall
firewall-cmd --state

# Abrir puertos necesarios
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --permanent --add-port=3000/tcp
firewall-cmd --permanent --add-port=3001/tcp
firewall-cmd --permanent --add-port=8090/tcp  # CyberPanel
firewall-cmd --permanent --add-port=3306/tcp  # MySQL (solo local)

# Para streaming (opcional, configurar después)
# firewall-cmd --permanent --add-port=1935/tcp  # RTMP
# firewall-cmd --permanent --add-port=8080/tcp  # HLS

# Recargar firewall
firewall-cmd --reload

# Verificar
firewall-cmd --list-all
```

✅ **Checkpoint 6:** Firewall configurado

---

## 📌 FASE 7: CONFIGURAR WEBHOOKS DE STRIPE (15 min)

### Paso 7.1: Crear Webhook en Stripe

1. **Ir a Stripe Dashboard:**
   ```
   https://dashboard.stripe.com/webhooks
   ```

2. **Click "Add endpoint"**

3. **Configurar:**
   ```
   Endpoint URL: https://influencersex.com/api/webhooks/stripe
   Description: Webhooks de producción
   Version: Latest API version
   ```

4. **Seleccionar eventos:**
   ```
   ✅ checkout.session.completed
   ✅ customer.subscription.created
   ✅ customer.subscription.updated
   ✅ customer.subscription.deleted
   ✅ invoice.paid
   ✅ invoice.payment_failed
   ✅ payment_intent.succeeded
   ```

5. **Click "Add endpoint"**

6. **Copiar el Signing secret** (empieza con `whsec_...`)

### Paso 7.2: Actualizar .env

```bash
nano /home/pasionsame/.env

# Actualizar:
STRIPE_WEBHOOK_SECRET="whsec_..."

# Guardar: Ctrl+O, Enter, Ctrl+X
```

### Paso 7.3: Reiniciar Aplicación

```bash
pm2 restart all
```

### Paso 7.4: Probar Webhook

1. En Stripe Dashboard, ir al webhook creado
2. Click en "Send test webhook"
3. Seleccionar evento: `customer.subscription.created`
4. Click "Send test webhook"
5. Verificar que responda: **200 OK**

✅ **Checkpoint 7:** Webhooks de Stripe funcionando

---

## 📌 FASE 8: VERIFICACIÓN FINAL (20 min)

### Paso 8.1: Verificar Dominios

**Abrir en navegador:**

```
https://influencersex.com
https://novapasion.com
https://pasionred.com
https://todofans.com
https://todofans.es
```

**Verificar en CADA dominio:**
- ✅ Página carga correctamente
- ✅ Candado SSL (HTTPS) verde
- ✅ Estilos se ven correctos
- ✅ No hay errores en consola

### Paso 8.2: Probar Funcionalidades Básicas

1. **Registro de modelo:**
   - Ir a: https://influencersex.com/es/register/model
   - Llenar formulario completo
   - Click "Crear Cuenta"
   - ✅ Debe crear cuenta sin errores

2. **Login:**
   - Ir a: https://influencersex.com/es/login
   - Iniciar sesión con cuenta creada
   - ✅ Debe iniciar sesión correctamente

3. **Dashboard de modelo:**
   - Debe mostrar estadísticas
   - ✅ Página carga sin errores

4. **Cambiar idioma:**
   - Probar cambiar a portugués, inglés, etc.
   - ✅ Traducciones funcionan

5. **Cambiar dominio:**
   - Ir a novapasion.com
   - ✅ Debe mostrar colores rojos
   - Ir a pasionred.com
   - ✅ Debe mostrar colores naranjas

### Paso 8.3: Verificar Logs

```bash
# Ver logs de PM2
pm2 logs --lines 50

# No debe haber errores críticos
```

### Paso 8.4: Verificar Base de Datos

```bash
# Conectar a MySQL
mysql -u pasiones_user -p pasiones_prod

# Ver tablas
SHOW TABLES;

# Debe mostrar 37 tablas
# Salir: exit
```

### Paso 8.5: Verificar Rendimiento

```bash
# Ver uso de recursos
htop

# Presionar q para salir
```

✅ **Checkpoint 8:** Todo verificado y funcionando

---

## 📌 CONFIGURACIÓN ADICIONAL (OPCIONAL)

### Crear Cuenta de Email para SMTP

1. Ir a CyberPanel → **Email** → **Create Email**
2. Dominio: influencersex.com
3. Email: noreply@influencersex.com
4. Contraseña: (genera una segura)
5. Actualizar en `.env`:
   ```
   SMTP_USER="noreply@influencersex.com"
   SMTP_PASSWORD="..."
   ```
6. Reiniciar: `pm2 restart all`

### Configurar Backups Automáticos

```bash
# Crear script de backup
cat > /home/pasionsame/backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/backups"

# Crear directorio
mkdir -p $BACKUP_DIR

# Backup de base de datos
mysqldump -u pasiones_user -p'TU_CONTRASEÑA' pasiones_prod > $BACKUP_DIR/db_$DATE.sql

# Backup de uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /home/pasionsame/public/uploads

# Eliminar backups antiguos (más de 7 días)
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completado: $DATE"
EOF

# Dar permisos
chmod +x /home/pasionsame/backup.sh

# Agregar a crontab (diario a las 3 AM)
crontab -e
# Agregar línea:
0 3 * * * /home/pasionsame/backup.sh >> /home/pasionsame/logs/backup.log 2>&1
```

---

## 🎉 ¡DEPLOYMENT COMPLETADO!

Tu plataforma multi-sitio está ahora **100% OPERATIVA** en producción.

### 📊 Resumen de lo Configurado

✅ Servidor VPS preparado (Node.js, Bun, PM2)
✅ Proyecto clonado desde GitHub
✅ Base de datos con 37 tablas creadas
✅ Aplicaciones ejecutándose con PM2
✅ 5 dominios configurados con SSL
✅ Proxy reverso funcionando
✅ Firewall configurado
✅ Webhooks de Stripe activos

### 🚀 URLs de Acceso

**Sitios Web:**
- https://influencersex.com
- https://novapasion.com
- https://pasionred.com
- https://todofans.com
- https://todofans.es

**Panel de Control:**
- CyberPanel: https://178.16.140.137:8090
- phpMyAdmin: https://178.16.140.137:8090/dataBases/phpMyAdmin

---

## 📋 COMANDOS ÚTILES

### Gestión de PM2

```bash
# Ver estado
pm2 status

# Ver logs
pm2 logs

# Logs de app específica
pm2 logs nextjs-app
pm2 logs socket-server

# Reiniciar todas las apps
pm2 restart all

# Reiniciar app específica
pm2 restart nextjs-app

# Detener todas las apps
pm2 stop all

# Ver información detallada
pm2 info nextjs-app

# Monitoreo en tiempo real
pm2 monit
```

### Gestión de Base de Datos

```bash
# Conectar a MySQL
mysql -u pasiones_user -p pasiones_prod

# Backup manual
mysqldump -u pasiones_user -p pasiones_prod > backup.sql

# Restaurar backup
mysql -u pasiones_user -p pasiones_prod < backup.sql

# Ver tablas
mysql -u pasiones_user -p -e "USE pasiones_prod; SHOW TABLES;"
```

### Actualizar la Aplicación

```bash
cd /home/pasionsame

# Pull últimos cambios
git pull origin main

# Instalar nuevas dependencias
bun install

# Ejecutar migraciones (si hay cambios en BD)
bunx prisma migrate deploy

# Rebuild
bun run build

# Reiniciar
pm2 restart all
```

### Ver Logs del Sistema

```bash
# Logs de Nginx/OpenLiteSpeed
tail -f /usr/local/lsws/logs/error.log

# Logs de MySQL
tail -f /var/log/mysqld.log

# Logs de aplicación
tail -f /home/pasionsame/logs/nextjs-out.log
tail -f /home/pasionsame/logs/socket-out.log

# Logs del sistema
journalctl -xe
```

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### Problema: "Cannot connect to database"

```bash
# Verificar que MySQL esté corriendo
systemctl status mysqld

# Si no está corriendo
systemctl start mysqld

# Verificar credenciales
cat /home/pasionsame/.env | grep DATABASE_URL

# Probar conexión
mysql -u pasiones_user -p
```

### Problema: "PM2 apps not running"

```bash
# Ver errores
pm2 logs --err

# Reiniciar
pm2 delete all
cd /home/pasionsame
pm2 start ecosystem.config.js
```

### Problema: "502 Bad Gateway"

```bash
# Verificar que Next.js esté corriendo
pm2 status

# Verificar puerto 3000
netstat -tlnp | grep 3000

# Reiniciar OpenLiteSpeed
systemctl restart lsws

# Reiniciar apps
pm2 restart all
```

### Problema: "SSL Certificate Error"

```bash
# Renovar certificados SSL
cd /root/.acme.sh/
./acme.sh --renew -d influencersex.com --force

# Reiniciar web server
systemctl restart lsws
```

### Problema: "Socket.io not connecting"

```bash
# Verificar que socket server esté corriendo
pm2 status socket-server

# Ver logs
pm2 logs socket-server

# Verificar puerto
netstat -tlnp | grep 3001

# Verificar firewall
firewall-cmd --list-all | grep 3001
```

---

## 📞 SOPORTE

### Recursos

- **Documentación del proyecto:** Ver archivos .md en `/home/pasionsame/`
- **Logs de aplicación:** `/home/pasionsame/logs/`
- **Soporte Hostinger:** https://www.hostinger.com/contact
- **CyberPanel Docs:** https://cyberpanel.net/docs/

### Contacto Hostinger

Si tienes problemas con el servidor:
- Support: https://www.hostinger.com/contact
- Live Chat: Disponible en el panel de Hostinger

---

## ✅ CHECKLIST POST-DEPLOYMENT

Después del deployment, asegúrate de:

- [ ] Cambiar contraseña de root del VPS
- [ ] Cambiar contraseña de CyberPanel
- [ ] Cambiar contraseña de MySQL
- [ ] Configurar backups automáticos
- [ ] Configurar monitoreo (Uptimerobot, etc.)
- [ ] Probar todos los flujos de usuario
- [ ] Probar pagos con Stripe (modo test primero)
- [ ] Configurar Google Analytics
- [ ] Crear contenido inicial
- [ ] Promocionar en redes sociales

---

## 🎯 PRÓXIMOS PASOS OPCIONALES

### 1. Configurar RTMP para Streaming

Ver guía completa en: **CONFIGURACION_STREAMING.md**

### 2. Optimización de Rendimiento

```bash
# Instalar Redis para caché
dnf install -y redis
systemctl enable redis
systemctl start redis
```

### 3. CDN con Cloudflare

1. Ir a Cloudflare.com
2. Agregar sitio
3. Cambiar nameservers del dominio
4. Habilitar caché y optimizaciones

### 4. Monitoreo con Sentry

Agregar Sentry para tracking de errores en producción.

---

**🎉 ¡Felicidades! Tu plataforma está en producción y lista para generar ingresos.**

**Versión:** 12
**Fecha:** Noviembre 2025
**Estado:** ✅ EN PRODUCCIÓN
