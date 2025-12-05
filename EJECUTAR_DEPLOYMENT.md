# 🚀 EJECUTAR DEPLOYMENT - PASO A PASO

## 📌 ESTADO ACTUAL DEL PROYECTO

✅ **Build:** Compila sin errores - 62 páginas generadas
✅ **APIs:** 13 endpoints implementados y funcionando
✅ **Base de Datos:** Prisma configurado con 37 tablas
✅ **Scripts:** deploy.sh y verify-system.sh listos
✅ **Documentación:** Completa y verificada

**TODO ESTÁ LISTO PARA HACER DEPLOYMENT** 🎯

---

## 🎯 DEPLOYMENT EN 3 FASES

### FASE 1: VERIFICACIÓN LOCAL (5 minutos)

#### Paso 1.1: Verificar que el build funciona

```bash
cd red-social-creadores
bash verify-system.sh
```

**Resultado esperado:**
```
✓ SISTEMA 100% VERIFICADO!
No se encontraron errores
✅ El sistema está listo para deployment
```

#### Paso 1.2: Verificar variables de entorno

```bash
cat .env
```

**Asegúrate de tener configurado:**
- ✅ DATABASE_URL
- ✅ NEXTAUTH_SECRET
- ✅ NEXTAUTH_URL
- ✅ STRIPE_SECRET_KEY
- ✅ STRIPE_PUBLISHABLE_KEY

---

### FASE 2: SUBIR A GITHUB (5 minutos)

#### Paso 2.1: Hacer commit de últimos cambios

```bash
git add .
git commit -m "✅ Versión 16 Final - Sistema 100% funcional listo para deployment

- 13 APIs implementadas
- 62 páginas generadas
- Scripts de deployment completos
- Documentación final completa"
```

#### Paso 2.2: Hacer push al repositorio

```bash
git push origin main
```

**Verificar en GitHub:**
- https://github.com/gerencianovapasion-code/pasionsame

---

### FASE 3: DEPLOYMENT EN SERVIDOR (15 minutos)

#### Paso 3.1: Conectar al servidor

```bash
ssh root@178.16.140.137
```

**Password:** (tu password de servidor)

#### Paso 3.2: Ir al directorio del proyecto

```bash
cd /home/pasionsame
```

#### Paso 3.3: Hacer pull de últimos cambios

```bash
git pull origin main
```

**Resultado esperado:**
```
Already up to date.
o
Updating xxxxx..yyyyy
Fast-forward
 ... archivos actualizados ...
```

#### Paso 3.4: Verificar archivo .env

```bash
cat .env
```

**Si el archivo NO existe o tiene valores de ejemplo:**

```bash
nano .env
```

**Copiar y PERSONALIZAR estas variables:**

```env
# Base de datos MySQL
DATABASE_URL="mysql://infl_pasiones_user:TU_PASSWORD_REAL@localhost:3306/infl_pasiones_prod"

# NextAuth - GENERAR NUEVO SECRET
NEXTAUTH_SECRET="EJECUTA: openssl rand -base64 32"
NEXTAUTH_URL="https://influencersex.com"

# Stripe - CLAVES REALES (NO DE TEST)
STRIPE_SECRET_KEY="sk_live_TU_CLAVE_SECRETA_REAL"
STRIPE_PUBLISHABLE_KEY="pk_live_TU_CLAVE_PUBLICA_REAL"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_TU_CLAVE_PUBLICA_REAL"

# OAuth (Opcional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
FACEBOOK_CLIENT_ID=""
FACEBOOK_CLIENT_SECRET=""

# Email SMTP
SMTP_HOST="smtp.hostinger.com"
SMTP_PORT="465"
SMTP_USER="noreply@influencersex.com"
SMTP_PASSWORD="TU_PASSWORD_EMAIL"
SMTP_FROM="Influencers <noreply@influencersex.com>"

# PayPal (Opcional)
PAYPAL_CLIENT_ID=""
PAYPAL_SECRET=""
PAYPAL_MODE="live"

# Almacenamiento
STORAGE_TYPE="local"
STORAGE_PATH="./public/uploads"

# Multi-sitio
SITES="influencersex.com,novapasion.com,pasionred.com,todofans.com,todofans.es"

# Configuración
MINIMUM_WITHDRAWAL=50
PLATFORM_FEE=20

# Socket.io
SOCKET_PORT="3001"
NEXT_PUBLIC_SOCKET_URL="https://influencersex.com"
NEXT_PUBLIC_APP_URL="https://influencersex.com"

# Stripe Webhooks (configurar después)
STRIPE_WEBHOOK_SECRET=""
```

**Guardar:** `Ctrl+O`, `Enter`, `Ctrl+X`

#### Paso 3.5: Generar NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

**Copiar el resultado y actualizar .env:**

```bash
nano .env
# Pegar el valor generado en NEXTAUTH_SECRET
```

#### Paso 3.6: Ejecutar deployment automático

```bash
bash deploy.sh
```

**Durante la ejecución:**

1. El script verificará archivos
2. Instalará dependencias
3. Generará cliente Prisma
4. **PREGUNTARÁ:** `¿Continuar con la sincronización de BD? (s/n):`
   - **RESPONDER:** `s`
5. Creará las 37 tablas en MySQL
6. Compilará la aplicación
7. Configurará PM2
8. Iniciará las aplicaciones

**Tiempo total:** ~5 minutos

**Resultado esperado al final:**

```
════════════════════════════════════════════════════
✓ DEPLOYMENT COMPLETADO EXITOSAMENTE
════════════════════════════════════════════════════

✓ Next.js corriendo en: http://localhost:3000
✓ Socket.io corriendo en: http://localhost:3001
```

#### Paso 3.7: Verificar que todo está corriendo

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

**✅ Si ves "online" en ambas apps: ¡PERFECTO!**

#### Paso 3.8: Ver logs (Opcional)

```bash
# Ver todas las apps
pm2 logs --lines 20

# Presiona Ctrl+C para salir
```

**Deberías ver:** Mensajes de inicio sin errores críticos

#### Paso 3.9: Verificar base de datos

```bash
mysql -u infl_pasiones_user -p infl_pasiones_prod
```

**Password:** (tu password de MySQL)

**Dentro de MySQL:**

```sql
-- Ver todas las tablas
SHOW TABLES;

-- Deberías ver 37 tablas:
-- Account, Category, Comment, Conversation, ...

-- Salir
exit
```

#### Paso 3.10: Configurar firewall

```bash
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --permanent --add-port=3000/tcp
firewall-cmd --permanent --add-port=3001/tcp
firewall-cmd --reload
```

**Resultado esperado:**
```
success
success
success
success
success
```

---

## 🌐 CONFIGURAR DOMINIOS (20 minutos)

### Paso 4.1: Acceder a CyberPanel

Abrir en navegador:
```
https://178.16.140.137:8090
```

**Login:**
- Usuario: `admin` o `root`
- Password: (tu password de CyberPanel)

### Paso 4.2: Crear Sitios Web

Para **CADA UNO** de los 5 dominios:

1. **Websites → Create Website**
2. Configurar:
   - **Select Package:** Default
   - **Select Owner:** admin
   - **Domain Name:** `influencersex.com` (cambiar según dominio)
   - **Email:** tu@email.com
   - **Select PHP:** Ninguno
3. Click **Create Website**
4. Repetir para:
   - `novapasion.com`
   - `pasionred.com`
   - `todofans.com`
   - `todofans.es`

### Paso 4.3: Configurar Proxy Reverso

Para **CADA** dominio:

1. **Websites → List Websites**
2. Click **Manage** en el dominio
3. Click **vHost Conf**
4. Buscar `</VirtualHost>` al final
5. **ANTES** de `</VirtualHost>`, agregar:

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

### Paso 4.4: Instalar SSL

Para **CADA** dominio:

1. **Websites → List Websites**
2. Click **Manage** en el dominio
3. Click **Manage SSL**
4. Click **Issue SSL** (Let's Encrypt)
5. Esperar confirmación (~30 segundos)
6. Debería decir: "SSL issued successfully"
7. Repetir para los otros 4 dominios

### Paso 4.5: Reiniciar Servidor Web

```bash
systemctl restart lsws
```

**Resultado esperado:**
```
(sin output = exitoso)
```

**Verificar estado:**
```bash
systemctl status lsws
```

**Debería decir:** `active (running)`

---

## ✅ VERIFICACIÓN FINAL

### Paso 5.1: Probar dominios en navegador

Abrir en tu navegador:

1. https://influencersex.com
2. https://novapasion.com
3. https://pasionred.com
4. https://todofans.com
5. https://todofans.es

**Verificar en CADA sitio:**
- ✅ Página principal carga correctamente
- ✅ HTTPS funciona (candado verde en navegador)
- ✅ Imágenes se ven correctamente
- ✅ Selector de idioma funciona
- ✅ Selector de país funciona
- ✅ Búsqueda funciona

### Paso 5.2: Probar funcionalidades

#### Registro de Modelo:

1. Ir a: https://influencersex.com/register/model
2. Llenar formulario
3. Submit
4. Verificar que redirige a login

#### Login:

1. Ir a: https://influencersex.com/login
2. Intentar login con las credenciales creadas
3. Verificar que inicia sesión

#### Dashboard:

1. Una vez logueado como modelo
2. Ir a: https://influencersex.com/dashboard
3. Verificar que muestra el dashboard

### Paso 5.3: Crear usuario administrador

```bash
# En el servidor
mysql -u infl_pasiones_user -p infl_pasiones_prod
```

```sql
-- Ver usuarios existentes
SELECT id, email, role FROM User;

-- Convertir un usuario a ADMIN
UPDATE User SET role = 'ADMIN' WHERE email = 'tu@email.com';

-- Verificar
SELECT id, email, role FROM User WHERE role = 'ADMIN';

-- Salir
exit
```

### Paso 5.4: Probar panel de administración

1. Ir a: https://influencersex.com/admin
2. Debería mostrar el panel de administración
3. Verificar estadísticas, retiros, etc.

---

## 🎯 CONFIGURAR WEBHOOKS DE STRIPE

### Paso 6.1: Crear Webhook en Stripe

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

### Paso 6.2: Copiar Signing Secret

1. Click en el webhook creado
2. Copiar **Signing secret** (empieza con `whsec_`)

### Paso 6.3: Actualizar .env

```bash
# En el servidor
nano .env
```

Agregar:
```env
STRIPE_WEBHOOK_SECRET="whsec_TU_SECRET_COPIADO"
```

Guardar: `Ctrl+O`, `Enter`, `Ctrl+X`

### Paso 6.4: Reiniciar aplicación

```bash
pm2 restart nextjs-app
```

### Paso 6.5: Probar webhook

En Stripe dashboard:
1. Click en el webhook
2. Click **Send test webhook**
3. Seleccionar evento `checkout.session.completed`
4. Click **Send test event**
5. Debería mostrar: **200 OK**

---

## 📊 COMANDOS ÚTILES

### Ver logs en tiempo real:

```bash
# Todos los logs
pm2 logs

# Solo Next.js
pm2 logs nextjs-app

# Solo Socket.io
pm2 logs socket-server
```

### Reiniciar aplicaciones:

```bash
# Todas
pm2 restart all

# Solo Next.js
pm2 restart nextjs-app

# Solo Socket.io
pm2 restart socket-server
```

### Ver uso de recursos:

```bash
pm2 monit
```

### Ver estado detallado:

```bash
pm2 info nextjs-app
```

### Detener aplicaciones:

```bash
pm2 stop all
```

### Iniciar aplicaciones:

```bash
pm2 start all
```

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### Error: "Can't reach database server"

```bash
# Verificar MySQL
systemctl status mysqld

# Si no está corriendo
systemctl start mysqld

# Verificar credenciales en .env
cat .env | grep DATABASE_URL
```

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

### Error 502 Bad Gateway

```bash
# Verificar apps
pm2 status

# Verificar servidor web
systemctl status lsws

# Reiniciar servidor web
systemctl restart lsws
```

### Sitio no carga con HTTPS

```bash
# Ver logs del servidor web
tail -f /usr/local/lsws/logs/error.log

# Verificar configuración SSL
ls -la /etc/letsencrypt/live/

# Reiniciar
systemctl restart lsws
```

---

## ✅ CHECKLIST FINAL DE DEPLOYMENT

Marca cada item una vez completado:

### Servidor
- [ ] SSH funcionando
- [ ] Directorio /home/pasionsame existe
- [ ] Código actualizado desde GitHub
- [ ] .env configurado con valores reales
- [ ] MySQL corriendo
- [ ] Base de datos creada (37 tablas)

### Aplicación
- [ ] `pm2 status` muestra ambas apps "online"
- [ ] Logs sin errores críticos
- [ ] Puertos 3000 y 3001 accesibles

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

Si todos los items del checklist están marcados:

**¡FELICITACIONES! Tu red social multi-sitio está 100% funcional y en producción** 🚀

**URLs activas:**
- https://influencersex.com
- https://novapasion.com
- https://pasionred.com
- https://todofans.com
- https://todofans.es

**Próximos pasos:**
1. Crear contenido de prueba
2. Configurar backups automáticos
3. Monitorear logs y performance
4. ¡Empezar a recibir usuarios!

---

**Documentación completa en:**
- `README_FINAL_DEPLOYMENT.md`
- `IMPLEMENTACION_COMPLETA.md`
- `GUIA_DEPLOYMENT_HOSTINGER.md`
