# 📦 Guía de Instalación en Hostinger VPS

## 🖥️ Requisitos del Sistema

Tu VPS de Hostinger ya tiene:
- **Sistema Operativo**: AlmaLinux 9
- **Panel de Control**: CyberPanel (https://178.16.140.137:8090)
- **phpMyAdmin**: https://178.16.140.137:8090/dataBases/phpMyAdmin
- **RAM**: 7682 MB
- **Disco**: 99 GB
- **CPU**: 2 núcleos

## 📝 Paso 1: Preparar el Entorno

### 1.1 Conectar por SSH

```bash
ssh root@178.16.140.137
```

### 1.2 Instalar Node.js y Bun

```bash
# Instalar Node.js 20.x
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
dnf install -y nodejs

# Instalar Bun
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc
```

### 1.3 Verificar Instalaciones

```bash
node --version  # Debería mostrar v20.x.x
bun --version   # Debería mostrar 1.x.x
```

## 📁 Paso 2: Subir el Proyecto

### 2.1 Crear Directorio del Proyecto

```bash
cd /home
mkdir -p influencersex
cd influencersex
```

### 2.2 Subir Archivos

Puedes usar una de estas opciones:

**Opción A: SFTP/SCP**
```bash
# Desde tu máquina local
scp -r red-social-creadores root@178.16.140.137:/home/influencersex/
```

**Opción B: Git**
```bash
# En el servidor
git clone https://tu-repositorio.git
```

**Opción C: Comprimir y Subir**
```bash
# En tu máquina local, comprimir el proyecto
cd red-social-creadores
tar -czf proyecto.tar.gz .

# Subir al servidor
scp proyecto.tar.gz root@178.16.140.137:/home/influencersex/

# En el servidor, descomprimir
cd /home/influencersex
tar -xzf proyecto.tar.gz
rm proyecto.tar.gz
```

## 🗄️ Paso 3: Configurar Base de Datos

### 3.1 Crear Base de Datos en phpMyAdmin

1. Accede a: https://178.16.140.137:8090/dataBases/phpMyAdmin
2. Crea una nueva base de datos llamada `pasiones_db`
3. Crea un usuario con todos los privilegios

### 3.2 Configurar Variables de Entorno

```bash
cd /home/influencersex/red-social-creadores
cp .env.example .env
nano .env
```

Actualiza estos valores en `.env`:

```env
# Base de datos
DATABASE_URL="mysql://usuario:contraseña@localhost:3306/pasiones_db"

# NextAuth (genera un secreto fuerte)
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="https://influencersex.com"

# Stripe (obtén las claves de tu cuenta Stripe)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# PayPal
PAYPAL_CLIENT_ID="tu_client_id"
PAYPAL_SECRET="tu_secret"
PAYPAL_MODE="live"

# SMTP (usa el SMTP de Hostinger)
SMTP_HOST="smtp.hostinger.com"
SMTP_PORT="465"
SMTP_USER="noreply@influencersex.com"
SMTP_PASSWORD="tu_password"
SMTP_FROM="Red Social <noreply@influencersex.com>"

# Almacenamiento
STORAGE_TYPE="local"
STORAGE_PATH="/home/influencersex/storage"

# Multi-sitio
SITES="influencersex.com,novapasion.com,pasionred.com,todofans.com,todofans.es"
```

### 3.3 Ejecutar Migraciones de Prisma

```bash
cd /home/influencersex/red-social-creadores

# Instalar dependencias
bun install

# Ejecutar migraciones
bunx prisma migrate deploy

# Generar cliente de Prisma
bunx prisma generate

# (Opcional) Seed de datos iniciales
bunx prisma db seed
```

## 🌐 Paso 4: Configurar Dominios en CyberPanel

### 4.1 Crear Sitios Web

1. Accede a CyberPanel: https://178.16.140.137:8090
2. Ve a **Websites** > **Create Website**
3. Crea un sitio para cada dominio:
   - influencersex.com
   - novapasion.com
   - pasionred.com
   - todofans.com
   - todofans.es

### 4.2 Configurar DNS

Para cada dominio, configura estos registros DNS:

```
Tipo A:  @ → 178.16.140.137
Tipo A:  www → 178.16.140.137
```

### 4.3 Instalar Certificados SSL

1. En CyberPanel, ve a **SSL** > **Issue SSL**
2. Emite certificados SSL gratuitos de Let's Encrypt para cada dominio

## 🚀 Paso 5: Compilar y Ejecutar

### 5.1 Compilar el Proyecto

```bash
cd /home/influencersex/red-social-creadores
bun run build
```

### 5.2 Configurar PM2 (Gestor de Procesos)

```bash
# Instalar PM2
npm install -g pm2

# Crear archivo de configuración PM2
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'red-social',
    script: 'bun',
    args: 'run start',
    cwd: '/home/influencersex/red-social-creadores',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# Iniciar aplicación
pm2 start ecosystem.config.js

# Configurar inicio automático
pm2 startup
pm2 save
```

## 🔧 Paso 6: Configurar Nginx/Proxy

### 6.1 Crear Configuración de Proxy Reverso

En CyberPanel, configura el proxy reverso para cada dominio:

1. Ve a **Websites** > Selecciona el dominio
2. Configura proxy a `http://localhost:3000`

O manualmente en Nginx:

```bash
nano /usr/local/lsws/conf/vhosts/influencersex.com/vhost.conf
```

Agrega:

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
```

Repite para todos los dominios.

### 6.2 Reiniciar Servicios

```bash
systemctl restart lsws  # OpenLiteSpeed
pm2 restart all
```

## ✅ Paso 7: Verificación

### 7.1 Verificar Estado

```bash
# Ver estado de la aplicación
pm2 status

# Ver logs en tiempo real
pm2 logs

# Ver recursos
pm2 monit
```

### 7.2 Probar Dominios

Abre cada dominio en tu navegador:
- https://influencersex.com
- https://novapasion.com
- https://pasionred.com
- https://todofans.com
- https://todofans.es

## 🛠️ Mantenimiento

### Actualizar la Aplicación

```bash
cd /home/influencersex/red-social-creadores
git pull  # Si usas Git
bun install
bun run build
pm2 restart red-social
```

### Ver Logs

```bash
pm2 logs red-social --lines 100
```

### Backups

```bash
# Backup de base de datos
mysqldump -u usuario -p pasiones_db > backup_$(date +%Y%m%d).sql

# Backup de uploads
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz /home/influencersex/storage
```

## 📊 Configuración Adicional Recomendada

### Firewall

```bash
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload
```

### Optimización de MySQL

Edita `/etc/my.cnf`:

```ini
[mysqld]
max_connections = 200
innodb_buffer_pool_size = 2G
innodb_log_file_size = 256M
```

Reinicia MySQL:

```bash
systemctl restart mysqld
```

### Monitoreo

```bash
# Instalar htop para monitoreo
dnf install -y htop

# Ver recursos
htop
```

## 🔐 Seguridad

1. **Cambiar contraseñas por defecto** de CyberPanel y MySQL
2. **Configurar firewall** para permitir solo puertos necesarios
3. **Backups automáticos** diarios
4. **Actualizaciones de seguridad** regulares

```bash
dnf update -y
```

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs: `pm2 logs`
2. Verifica el estado: `pm2 status`
3. Reinicia la aplicación: `pm2 restart red-social`
4. Contacta a Hostinger si hay problemas del servidor

## 🎉 ¡Listo!

Tu plataforma multi-sitio está ahora en funcionamiento. Puedes empezar a:

1. Crear usuarios administradores
2. Configurar las membresías
3. Agregar contenido inicial
4. Configurar las pasarelas de pago
5. ¡Empezar a recibir modelos y usuarios!
