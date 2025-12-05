# 🚀 COMANDOS FINALES DE DEPLOYMENT

## ✅ ESTADO ACTUAL

**Proyecto:** 100% Completado y Verificado
**GitHub:** https://github.com/gerencianovapasion-code/pasionsame
**Último Commit:** 4103569
**Build:** ✅ EXITOSO - 62 páginas generadas
**APIs:** ✅ 13/13 implementadas
**Documentación:** ✅ 15+ archivos completos

---

## 📋 DEPLOYMENT EN SERVIDOR HOSTINGER

### 🔐 PASO 1: CONECTAR AL SERVIDOR

```bash
ssh root@178.16.140.137
```

---

### 📂 PASO 2: IR AL DIRECTORIO

```bash
cd /home/pasionsame
```

---

### 🔄 PASO 3: OBTENER ÚLTIMOS CAMBIOS

```bash
git pull origin main
```

**Deberías ver:**
```
Updating 0620b03..4103569
Fast-forward
 TRABAJO_COMPLETADO.md | 779 ++++++++++++++++++++++++++++++++++++++
 1 file changed, 779 insertions(+)
```

---

### ⚙️ PASO 4: CONFIGURAR VARIABLES DE ENTORNO

```bash
nano .env
```

**IMPORTANTE: Copiar y PERSONALIZAR este contenido:**

```env
# ============================================
# BASE DE DATOS MYSQL
# ============================================
DATABASE_URL="mysql://infl_pasiones_user:TU_PASSWORD_MYSQL@localhost:3306/infl_pasiones_prod"

# ============================================
# NEXTAUTH AUTHENTICATION
# ============================================
# Generar con: openssl rand -base64 32
NEXTAUTH_SECRET="EJECUTAR: openssl rand -base64 32 Y PEGAR AQUÍ"
NEXTAUTH_URL="https://influencersex.com"

# ============================================
# STRIPE (CLAVES REALES DE PRODUCCIÓN)
# ============================================
# Obtener de: https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY="sk_live_TU_CLAVE_SECRETA_REAL"
STRIPE_PUBLISHABLE_KEY="pk_live_TU_CLAVE_PUBLICA_REAL"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_TU_CLAVE_PUBLICA_REAL"

# ============================================
# OAUTH (OPCIONAL - Dejar vacío si no usas)
# ============================================
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
FACEBOOK_CLIENT_ID=""
FACEBOOK_CLIENT_SECRET=""

# ============================================
# EMAIL SMTP
# ============================================
SMTP_HOST="smtp.hostinger.com"
SMTP_PORT="465"
SMTP_USER="noreply@influencersex.com"
SMTP_PASSWORD="TU_PASSWORD_EMAIL"
SMTP_FROM="Influencers <noreply@influencersex.com>"

# ============================================
# PAYPAL (OPCIONAL)
# ============================================
PAYPAL_CLIENT_ID=""
PAYPAL_SECRET=""
PAYPAL_MODE="live"

# ============================================
# ALMACENAMIENTO
# ============================================
STORAGE_TYPE="local"
STORAGE_PATH="./public/uploads"

# ============================================
# MULTI-SITIO
# ============================================
SITES="influencersex.com,novapasion.com,pasionred.com,todofans.com,todofans.es"

# ============================================
# CONFIGURACIÓN DE LA PLATAFORMA
# ============================================
MINIMUM_WITHDRAWAL=50
PLATFORM_FEE=20

# ============================================
# SOCKET.IO
# ============================================
SOCKET_PORT="3001"
NEXT_PUBLIC_SOCKET_URL="https://influencersex.com"
NEXT_PUBLIC_APP_URL="https://influencersex.com"

# ============================================
# STRIPE WEBHOOKS (Configurar después)
# ============================================
STRIPE_WEBHOOK_SECRET=""
```

**Guardar:** Presionar `Ctrl+O`, luego `Enter`, luego `Ctrl+X`

---

### 🔑 PASO 4.1: GENERAR NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

**Copiar el resultado y actualizar en .env:**

```bash
nano .env
# Buscar NEXTAUTH_SECRET y pegar el valor generado
# Guardar: Ctrl+O, Enter, Ctrl+X
```

---

### 🚀 PASO 5: EJECUTAR DEPLOYMENT AUTOMÁTICO

```bash
bash deploy.sh
```

**Durante la ejecución:**

1. El script verificará archivos y dependencias
2. **PREGUNTARÁ:** `¿Continuar con la sincronización de BD? (s/n):`
   - **RESPONDER:** `s` y presionar Enter
3. Creará las 37 tablas en MySQL
4. Compilará la aplicación (~1-2 minutos)
5. Configurará PM2
6. Iniciará las aplicaciones

**Al finalizar deberías ver:**

```
════════════════════════════════════════════════════
✓ DEPLOYMENT COMPLETADO EXITOSAMENTE
════════════════════════════════════════════════════

✓ Next.js corriendo en: http://localhost:3000
✓ Socket.io corriendo en: http://localhost:3001

Comandos útiles:
  pm2 status          - Ver estado de apps
  pm2 logs            - Ver logs en tiempo real
  pm2 restart all     - Reiniciar todas las apps
  pm2 monit           - Monitor en tiempo real
```

---

### ✅ PASO 6: VERIFICAR QUE TODO FUNCIONA

```bash
pm2 status
```

**Resultado esperado:**

```
┌─────┬──────────────┬─────────┬─────────┬─────────┐
│ id  │ name         │ status  │ cpu     │ memory  │
├─────┼──────────────┼─────────┼─────────┼─────────┤
│ 0   │ nextjs-app   │ online  │ 0%      │ 150 MB  │
│ 1   │ socket-server│ online  │ 0%      │ 50 MB   │
└─────┴──────────────┴─────────┴─────────┴─────────┘
```

**✅ Si ambas apps muestran "online": ¡PERFECTO!**

---

### 📊 PASO 7: VERIFICAR BASE DE DATOS

```bash
mysql -u infl_pasiones_user -p infl_pasiones_prod
```

**Dentro de MySQL:**

```sql
-- Ver tablas (deberían ser 37)
SHOW TABLES;

-- Salir
exit
```

---

### 🔥 PASO 8: CONFIGURAR FIREWALL

```bash
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --permanent --add-port=3000/tcp
firewall-cmd --permanent --add-port=3001/tcp
firewall-cmd --reload
```

**Deberías ver "success" 5 veces**

---

## 🌐 CONFIGURACIÓN DE DOMINIOS EN CYBERPANEL

### PASO 9: ACCEDER A CYBERPANEL

**URL:** https://178.16.140.137:8090

**Login:**
- Usuario: `admin` o `root`
- Password: (tu password de CyberPanel)

---

### PASO 10: CREAR 5 SITIOS WEB

Para **CADA** dominio, repetir estos pasos:

1. **Websites → Create Website**
2. Configurar:
   - Package: `Default`
   - Owner: `admin`
   - Domain Name:
     - `influencersex.com`
     - `novapasion.com`
     - `pasionred.com`
     - `todofans.com`
     - `todofans.es`
   - Email: `tu@email.com`
   - PHP: `Ninguno`
3. Click **Create Website**

---

### PASO 11: CONFIGURAR PROXY REVERSO

Para **CADA** dominio creado:

1. **Websites → List Websites**
2. Click **Manage** en el dominio
3. Click **vHost Conf**
4. Buscar `</VirtualHost>` al final del archivo
5. **ANTES** de `</VirtualHost>`, agregar este código:

```apache
# Proxy para Next.js
ProxyPreserveHost On
ProxyPass / http://localhost:3000/
ProxyPassReverse / http://localhost:3000/

# Proxy para Socket.io
ProxyPass /socket.io/ http://localhost:3001/socket.io/
ProxyPassReverse /socket.io/ http://localhost:3001/socket.io/

# WebSocket support
RewriteEngine On
RewriteCond %{HTTP:Upgrade} websocket [NC]
RewriteCond %{HTTP:Connection} upgrade [NC]
RewriteRule ^/?(.*) "ws://localhost:3001/$1" [P,L]
```

6. Click **Save vHost Conf**
7. Repetir para los otros 4 dominios

---

### PASO 12: INSTALAR SSL (Let's Encrypt)

Para **CADA** dominio:

1. **Websites → List Websites**
2. Click **Manage** en el dominio
3. Click **Manage SSL**
4. Click **Issue SSL**
5. Esperar ~30 segundos
6. Debería decir: **"SSL issued successfully"**
7. Repetir para los otros 4 dominios

---

### PASO 13: REINICIAR SERVIDOR WEB

```bash
systemctl restart lsws
```

**Verificar:**

```bash
systemctl status lsws
```

**Debería decir:** `active (running)`

---

## ✅ VERIFICACIÓN FINAL

### PASO 14: PROBAR LOS 5 DOMINIOS

Abrir en tu navegador:

1. https://influencersex.com
2. https://novapasion.com
3. https://pasionred.com
4. https://todofans.com
5. https://todofans.es

**Verificar en CADA sitio:**
- ✅ Página carga correctamente
- ✅ HTTPS funciona (candado verde)
- ✅ Imágenes se ven
- ✅ Selector de idioma funciona
- ✅ Búsqueda funciona

---

### PASO 15: PROBAR FUNCIONALIDADES

#### Registro de Modelo

1. Ir a: https://influencersex.com/register/model
2. Llenar el formulario
3. Registrarse
4. Verificar que redirige a login

#### Login

1. Ir a: https://influencersex.com/login
2. Ingresar credenciales
3. Verificar que inicia sesión

#### Dashboard

1. Ir a: https://influencersex.com/dashboard
2. Verificar que muestra el panel

---

### PASO 16: CREAR USUARIO ADMINISTRADOR

```bash
mysql -u infl_pasiones_user -p infl_pasiones_prod
```

```sql
-- Ver usuarios
SELECT id, email, role FROM User;

-- Convertir un usuario a ADMIN
UPDATE User SET role = 'ADMIN' WHERE email = 'tu@email.com';

-- Verificar
SELECT id, email, role FROM User WHERE role = 'ADMIN';

-- Salir
exit
```

---

### PASO 17: PROBAR PANEL ADMIN

1. Ir a: https://influencersex.com/admin
2. Verificar que muestra el panel de administración
3. Verificar estadísticas

---

## 💳 CONFIGURAR WEBHOOKS DE STRIPE

### PASO 18: CREAR WEBHOOK EN STRIPE

1. Ir a: https://dashboard.stripe.com/webhooks
2. Click **Add endpoint**
3. **Endpoint URL:** `https://influencersex.com/api/webhooks/stripe`
4. **Events to send:**
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
5. Click **Add endpoint**

---

### PASO 19: CONFIGURAR WEBHOOK SECRET

1. Click en el webhook creado
2. Copiar **Signing secret** (empieza con `whsec_`)
3. En el servidor:

```bash
nano .env
```

4. Agregar al final:

```env
STRIPE_WEBHOOK_SECRET="whsec_TU_SECRET_COPIADO"
```

5. Guardar: `Ctrl+O`, `Enter`, `Ctrl+X`

6. Reiniciar aplicación:

```bash
pm2 restart nextjs-app
```

---

### PASO 20: PROBAR WEBHOOK

En Stripe Dashboard:

1. Click en el webhook
2. Click **Send test webhook**
3. Seleccionar `checkout.session.completed`
4. Click **Send test event**
5. Debería mostrar: **200 OK**

---

## 📊 COMANDOS ÚTILES PM2

### Ver estado

```bash
pm2 status
```

### Ver logs en tiempo real

```bash
pm2 logs
```

### Reiniciar aplicaciones

```bash
pm2 restart all
```

### Ver uso de recursos

```bash
pm2 monit
```

### Detener aplicaciones

```bash
pm2 stop all
```

### Ver info detallada

```bash
pm2 info nextjs-app
```

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### Error: "Can't reach database server"

```bash
# Verificar MySQL
systemctl status mysqld

# Si no está corriendo
systemctl start mysqld

# Verificar credenciales
cat .env | grep DATABASE_URL
```

---

### Apps en estado "errored"

```bash
# Ver logs
pm2 logs --lines 50

# Reiniciar
pm2 restart all

# Si persiste, eliminar y recrear
pm2 delete all
bash deploy.sh
```

---

### Error 502 Bad Gateway

```bash
# Verificar apps
pm2 status

# Verificar servidor web
systemctl status lsws

# Reiniciar servidor web
systemctl restart lsws
```

---

### Sitio no carga con HTTPS

```bash
# Ver logs del servidor web
tail -f /usr/local/lsws/logs/error.log

# Verificar SSL
ls -la /etc/letsencrypt/live/

# Reiniciar
systemctl restart lsws
```

---

## ✅ CHECKLIST FINAL

Marca cada item:

### Servidor
- [ ] SSH funcionando
- [ ] Código actualizado (`git pull`)
- [ ] .env configurado con valores reales
- [ ] MySQL corriendo
- [ ] Base de datos creada (37 tablas)

### Aplicación
- [ ] `pm2 status` muestra "online" en ambas apps
- [ ] Logs sin errores críticos
- [ ] Puertos 3000 y 3001 funcionando

### Firewall
- [ ] HTTP abierto
- [ ] HTTPS abierto
- [ ] Puerto 3000 abierto
- [ ] Puerto 3001 abierto

### Dominios
- [ ] 5 sitios creados en CyberPanel
- [ ] Proxy reverso configurado en los 5
- [ ] SSL instalado en los 5
- [ ] Servidor web reiniciado

### Verificación
- [ ] Los 5 dominios cargan con HTTPS
- [ ] Registro funciona
- [ ] Login funciona
- [ ] Dashboard funciona
- [ ] Admin panel accesible
- [ ] Stripe webhooks configurados

---

## 🎉 ¡DEPLOYMENT COMPLETADO!

Si todos los items están marcados:

**¡FELICITACIONES! Tu red social multi-sitio está 100% funcional** 🚀

### URLs Activas:
- https://influencersex.com
- https://novapasion.com
- https://pasionred.com
- https://todofans.com
- https://todofans.es

### Panel Admin:
- https://influencersex.com/admin

---

## 📞 DOCUMENTACIÓN ADICIONAL

Para más información, consultar:

- **EJECUTAR_DEPLOYMENT.md** - Guía detallada paso a paso
- **README_FINAL_DEPLOYMENT.md** - Referencia completa
- **TRABAJO_COMPLETADO.md** - Resumen de todo lo implementado
- **IMPLEMENTACION_COMPLETA.md** - Documentación técnica
- **GUIA_DEPLOYMENT_HOSTINGER.md** - Guía específica Hostinger

---

**Versión:** 17 - FINAL
**Estado:** ✅ PRODUCCIÓN LISTA
**GitHub:** https://github.com/gerencianovapasion-code/pasionsame
**Desarrollado con:** Next.js 15, React 18, TypeScript, Prisma, Socket.io, Stripe

---

**¡PROYECTO LISTO PARA RECIBIR USUARIOS!** 🎉🚀
