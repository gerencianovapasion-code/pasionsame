# ⚡ INICIO RÁPIDO - Deployment en 30 Minutos

## 🎯 Objetivo

Tener tu plataforma funcionando en producción lo más rápido posible.

---

## 📋 Antes de Empezar

**Necesitas tener:**
- ✅ Acceso SSH a tu VPS: `ssh root@178.16.140.137`
- ✅ Acceso a CyberPanel: https://178.16.140.137:8090
- ✅ Dominios apuntando a tu IP: 178.16.140.137
- ✅ Cuenta de Stripe (para pagos)

---

## 🚀 DEPLOYMENT EN 30 MINUTOS

### 1️⃣ Conectar al Servidor (1 min)

```bash
ssh root@178.16.140.137
```

### 2️⃣ Instalar Node.js y Bun (5 min)

```bash
# Node.js 20
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
dnf install -y nodejs

# Bun
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc

# PM2
npm install -g pm2
```

### 3️⃣ Clonar Proyecto (2 min)

```bash
mkdir -p /home/pasionsame
cd /home/pasionsame
git clone https://github.com/gerencianovapasion-code/pasionsame.git .
bun install
```

### 4️⃣ Crear Base de Datos (3 min)

1. Ir a: https://178.16.140.137:8090/dataBases/phpMyAdmin
2. Crear base de datos: `pasiones_prod`
3. Crear usuario: `pasiones_user` con contraseña segura
4. Anotar credenciales

### 5️⃣ Configurar .env (5 min)

```bash
cd /home/pasionsame
cp .env.example .env
nano .env
```

**Configurar SOLO estas variables esenciales:**

```env
# Base de datos
DATABASE_URL="mysql://pasiones_user:TU_CONTRASEÑA@localhost:3306/pasiones_prod"

# NextAuth
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="https://influencersex.com"

# Stripe (usar keys de test por ahora)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Socket.io
NEXT_PUBLIC_SOCKET_URL="https://influencersex.com:3001"
NEXT_PUBLIC_APP_URL="https://influencersex.com"
```

### 6️⃣ Migrar Base de Datos (3 min)

```bash
bunx prisma generate
bunx prisma migrate deploy
```

### 7️⃣ Build y Deploy (5 min)

```bash
# Build
bun run build

# Crear config de PM2
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
      env: { NODE_ENV: 'production', PORT: 3000 }
    },
    {
      name: 'socket-server',
      script: 'bun',
      args: 'run server.js',
      cwd: '/home/pasionsame',
      instances: 1,
      env: { NODE_ENV: 'production' }
    }
  ]
}
EOF

# Iniciar
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

### 8️⃣ Configurar Dominios en CyberPanel (10 min)

Para **CADA dominio**:

1. CyberPanel → **Websites** → **Create Website**
2. Crear: influencersex.com (repetir para los otros 4)
3. **SSL** → **Manage SSL** → Issue Let's Encrypt
4. **vHost Conf** → Agregar:

```nginx
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Hostname $host;
}

location /socket.io/ {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

5. Reiniciar: `systemctl restart lsws`

### 9️⃣ Abrir Firewall (1 min)

```bash
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --permanent --add-port=3000/tcp
firewall-cmd --permanent --add-port=3001/tcp
firewall-cmd --reload
```

---

## ✅ VERIFICAR QUE TODO FUNCIONA

```bash
# Ver estado de apps
pm2 status

# Ver logs
pm2 logs

# Probar dominios
curl -I https://influencersex.com  # Debe responder 200 OK
```

**Abrir en navegador:**
- https://influencersex.com ✅
- https://novapasion.com ✅
- https://pasionred.com ✅
- https://todofans.com ✅
- https://todofans.es ✅

---

## 🎉 ¡LISTO!

Tu plataforma está ahora en producción.

### Próximos Pasos

1. **Crear cuenta de modelo de prueba**
2. **Configurar Stripe en modo Live** (cuando estés listo)
3. **Configurar OAuth** (Google/Facebook)
4. **Agregar contenido inicial**
5. **Promocionar** 🚀

---

## 📚 Documentación Completa

Para deployment detallado paso a paso:
→ **GUIA_DEPLOYMENT_HOSTINGER.md**

Para configuración de streaming:
→ **CONFIGURACION_STREAMING.md**

Para troubleshooting:
→ **GUIA_DEPLOYMENT_HOSTINGER.md** (Sección "Solución de Problemas")

---

## 🆘 Ayuda Rápida

**Apps no inician:**
```bash
pm2 logs
pm2 restart all
```

**502 Bad Gateway:**
```bash
systemctl restart lsws
pm2 restart all
```

**Base de datos no conecta:**
```bash
systemctl status mysqld
cat .env | grep DATABASE_URL
```

---

**¡Éxito con tu plataforma!** 🚀
