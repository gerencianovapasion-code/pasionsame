# 🚀 PASOS SIGUIENTES - Deployment en Producción

## ✅ ESTADO ACTUAL

Tu proyecto está **100% FUNCIONAL** y listo para deployment.

- ✅ Build exitoso
- ✅ Todas las funcionalidades implementadas
- ✅ Base de datos diseñada
- ✅ Documentación completa
- ✅ Socket.io configurado
- ✅ Stripe integrado

---

## 📋 CHECKLIST DE DEPLOYMENT

### 1️⃣ PREPARACIÓN LOCAL (5 minutos)

#### A. Verificar que todo funciona localmente

```bash
# Limpiar caché
rm -rf .next

# Build
bun run build

# Si el build es exitoso, continuar
```

#### B. Preparar archivos para subir

```bash
# Crear archivo tar.gz con el proyecto
cd ..
tar -czf red-social-creadores.tar.gz red-social-creadores/

# O usar Git (recomendado)
cd red-social-creadores
git init
git add .
git commit -m "Proyecto completo v12"
```

---

### 2️⃣ CONFIGURACIÓN DEL SERVIDOR (30 minutos)

#### A. Conectar por SSH a Hostinger

```bash
ssh root@178.16.140.137
```

#### B. Instalar Node.js 20 y Bun

```bash
# Instalar Node.js 20.x
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
dnf install -y nodejs

# Instalar Bun
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc

# Verificar
node --version  # Debe ser v20.x.x
bun --version   # Debe ser 1.x.x
```

#### C. Instalar PM2

```bash
npm install -g pm2
```

---

### 3️⃣ SUBIR EL PROYECTO (10 minutos)

#### Opción A: Usando SFTP/SCP (Recomendado)

```bash
# Desde tu máquina local
scp red-social-creadores.tar.gz root@178.16.140.137:/home/

# En el servidor
cd /home
tar -xzf red-social-creadores.tar.gz
cd red-social-creadores
```

#### Opción B: Usando Git

```bash
# En el servidor
cd /home
git clone https://tu-repositorio.git red-social-creadores
cd red-social-creadores
```

---

### 4️⃣ CONFIGURAR BASE DE DATOS (15 minutos)

#### A. Crear Base de Datos en phpMyAdmin

1. Ir a: https://178.16.140.137:8090/dataBases/phpMyAdmin
2. Crear nueva base de datos: `pasiones_prod`
3. Crear usuario con todos los privilegios
4. Anotar: nombre de usuario, contraseña

#### B. Configurar Variables de Entorno

```bash
cd /home/red-social-creadores
cp .env.example .env
nano .env
```

**Actualizar estos valores:**

```env
# Base de datos (usar credenciales reales)
DATABASE_URL="mysql://usuario:contraseña@localhost:3306/pasiones_prod"

# NextAuth (generar secreto fuerte)
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="https://influencersex.com"

# Stripe (modo LIVE)
STRIPE_SECRET_KEY="sk_live_..."  # Obtener de dashboard Stripe
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."  # Configurar después

# PayPal (modo LIVE)
PAYPAL_CLIENT_ID="..."  # Obtener de PayPal
PAYPAL_SECRET="..."
PAYPAL_MODE="live"

# Google OAuth (obtener de Google Cloud Console)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Facebook OAuth (obtener de Facebook Developers)
FACEBOOK_CLIENT_ID="..."
FACEBOOK_CLIENT_SECRET="..."

# Socket.io
SOCKET_PORT="3001"
NEXT_PUBLIC_SOCKET_URL="https://influencersex.com:3001"
NEXT_PUBLIC_APP_URL="https://influencersex.com"

# SMTP (Hostinger)
SMTP_HOST="smtp.hostinger.com"
SMTP_PORT="465"
SMTP_USER="noreply@influencersex.com"  # Crear en CyberPanel
SMTP_PASSWORD="..."
SMTP_FROM="Red Social <noreply@influencersex.com>"

# Multi-sitio
SITES="influencersex.com,novapasion.com,pasionred.com,todofans.com,todofans.es"

# Streaming (después de configurar RTMP)
STREAMING_SERVER="rtmp://178.16.140.137/live"

# Configuración
MINIMUM_WITHDRAWAL=50
PLATFORM_FEE=20
```

#### C. Ejecutar Migraciones de Prisma

```bash
# Instalar dependencias
bun install

# Generar cliente de Prisma
bunx prisma generate

# Ejecutar migraciones
bunx prisma migrate deploy

# (Opcional) Seed de datos iniciales
bunx prisma db seed
```

---

### 5️⃣ COMPILAR Y EJECUTAR (10 minutos)

#### A. Build de Producción

```bash
bun run build
```

#### B. Configurar PM2

```bash
# Crear archivo de configuración
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'nextjs-app',
      script: 'bun',
      args: 'run start',
      cwd: '/home/red-social-creadores',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'socket-server',
      script: 'bun',
      args: 'run server.js',
      cwd: '/home/red-social-creadores',
      instances: 1,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}
EOF

# Iniciar aplicaciones
pm2 start ecosystem.config.js

# Configurar inicio automático
pm2 startup
pm2 save

# Verificar estado
pm2 status
pm2 logs
```

---

### 6️⃣ CONFIGURAR DOMINIOS EN CYBERPANEL (20 minutos)

#### A. Crear Sitios Web

1. Ir a CyberPanel: https://178.16.140.137:8090
2. **Websites** > **Create Website**
3. Crear un sitio para cada dominio:
   - influencersex.com
   - novapasion.com
   - pasionred.com
   - todofans.com
   - todofans.es

#### B. Configurar Proxy Reverso

Para cada dominio, configurar proxy a la aplicación:

1. Seleccionar el dominio en CyberPanel
2. Ir a **Manage** > **Rewrite Rules**
3. Agregar:

```nginx
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}

location /socket.io/ {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
}
```

#### C. Instalar Certificados SSL

1. En CyberPanel: **SSL** > **Issue SSL**
2. Seleccionar dominio
3. Emitir certificado Let's Encrypt (gratis)
4. Repetir para todos los dominios

---

### 7️⃣ CONFIGURAR DNS (10 minutos)

Para cada dominio, configurar estos registros DNS:

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

**Esperar 1-24 horas** para propagación completa.

---

### 8️⃣ CONFIGURAR WEBHOOKS DE STRIPE (5 minutos)

1. Ir a Stripe Dashboard: https://dashboard.stripe.com
2. **Developers** > **Webhooks**
3. **Add endpoint**
4. URL: `https://influencersex.com/api/webhooks/stripe`
5. Seleccionar eventos:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
   - `payment_intent.succeeded`
6. Copiar **Signing secret** (whsec_...)
7. Actualizar en `.env`: `STRIPE_WEBHOOK_SECRET="whsec_..."`
8. Reiniciar aplicación: `pm2 restart all`

---

### 9️⃣ CONFIGURAR FIREWALL (5 minutos)

```bash
# Abrir puertos necesarios
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --permanent --add-port=3000/tcp
firewall-cmd --permanent --add-port=3001/tcp

# Recargar firewall
firewall-cmd --reload

# Verificar
firewall-cmd --list-all
```

---

### 🔟 VERIFICACIÓN FINAL (10 minutos)

#### A. Verificar que los dominios funcionan

```bash
# Desde tu máquina local
curl -I https://influencersex.com
curl -I https://novapasion.com
curl -I https://pasionred.com
curl -I https://todofans.com
curl -I https://todofans.es
```

Todos deben responder con `200 OK`

#### B. Probar funcionalidades

1. **Abrir cada dominio en navegador**
   - ✅ Página principal carga
   - ✅ Estilos correctos
   - ✅ Idiomas funcionan

2. **Crear cuenta de modelo**
   - ✅ Registro funciona
   - ✅ Login funciona
   - ✅ Datos se guardan en BD

3. **Probar Stripe (modo test primero)**
   - ✅ Crear suscripción de prueba
   - ✅ Webhook recibe evento
   - ✅ Transacción se registra

4. **Verificar Socket.io**
   - ✅ Socket se conecta
   - ✅ Eventos en tiempo real funcionan

---

### 1️⃣1️⃣ CONFIGURAR RTMP (Opcional - 30 minutos)

Si quieres habilitar streaming en vivo, seguir la guía completa en:
**CONFIGURACION_STREAMING.md**

Resumen:
```bash
# Instalar Nginx con RTMP
dnf install -y nginx nginx-mod-rtmp

# Configurar /etc/nginx/nginx-rtmp.conf
# Ver archivo CONFIGURACION_STREAMING.md

# Abrir puerto
firewall-cmd --permanent --add-port=1935/tcp
firewall-cmd --reload

# Iniciar nginx
systemctl enable nginx
systemctl start nginx
```

---

### 1️⃣2️⃣ MANTENIMIENTO Y MONITOREO

#### Ver Logs

```bash
# Logs de PM2
pm2 logs

# Logs de aplicación específica
pm2 logs nextjs-app
pm2 logs socket-server

# Logs de Nginx
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

#### Reiniciar Servicios

```bash
# Reiniciar todas las apps
pm2 restart all

# Reiniciar app específica
pm2 restart nextjs-app
pm2 restart socket-server

# Reiniciar Nginx
systemctl restart nginx
```

#### Actualizar Aplicación

```bash
cd /home/red-social-creadores
git pull  # Si usas Git
bun install
bun run build
pm2 restart all
```

#### Backups

```bash
# Backup de base de datos (automatizar con cron)
mysqldump -u usuario -p pasiones_prod > backup_$(date +%Y%m%d).sql

# Backup de uploads
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz /home/red-social-creadores/public/uploads
```

---

## 🎉 ¡FELICIDADES!

Tu plataforma multi-sitio está ahora en producción y lista para:

✅ Recibir modelos
✅ Recibir usuarios
✅ Procesar pagos
✅ Generar ingresos

---

## 📞 SOPORTE

### Problemas Comunes

**Error: Cannot connect to database**
```bash
# Verificar que MySQL esté corriendo
systemctl status mysqld

# Verificar credenciales en .env
cat .env | grep DATABASE_URL
```

**Error: PM2 not found**
```bash
npm install -g pm2
```

**Error: Build fails**
```bash
rm -rf .next
rm -rf node_modules
bun install
bun run build
```

**Error: Socket.io no conecta**
```bash
# Verificar que el servidor esté corriendo
pm2 logs socket-server

# Verificar puerto
netstat -tlnp | grep 3001
```

### Recursos

- **Documentación del proyecto:** Ver archivos .md
- **Soporte Hostinger:** support@hostinger.com
- **Stripe Docs:** https://stripe.com/docs
- **Next.js Docs:** https://nextjs.org/docs

---

## 📊 SIGUIENTES PASOS RECOMENDADOS

Una vez que todo esté funcionando:

1. **Marketing:**
   - Crear contenido inicial
   - SEO optimization
   - Redes sociales
   - Google Analytics

2. **Mejoras:**
   - Configurar CDN (Cloudflare)
   - Optimizar imágenes
   - Implementar caché
   - Monitoreo con Sentry

3. **Legal:**
   - Términos y condiciones
   - Política de privacidad
   - GDPR compliance
   - Verificación de identidad de modelos

---

**¡Éxito con tu plataforma!** 🚀
