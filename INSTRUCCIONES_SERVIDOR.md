# 🎯 INSTRUCCIONES PARA TU SERVIDOR HOSTINGER

## 📍 ESTÁS AQUÍ

```
[root@srv729558 pasionsame]#
```

**Directorio actual:** `/home/pasionsame`
**Estado:** Proyecto clonado, dependencias instaladas, Prisma generado

---

## ✅ LO QUE YA HICISTE

1. ✅ Conectaste al servidor: `ssh root@178.16.140.137`
2. ✅ Clonaste el proyecto desde GitHub
3. ✅ Instalaste dependencias: `bun install`
4. ✅ Generaste cliente Prisma: `bunx prisma generate`

---

## 🚀 SIGUIENTE PASO: EJECUTAR DEPLOYMENT

### Comando a Ejecutar AHORA:

```bash
bash deploy.sh
```

### ¿Qué hará este comando?

El script `deploy.sh` es un **script de deployment automatizado** que:

1. ✅ Verifica que `.env` esté configurado
2. ✅ Reinstala dependencias (por seguridad)
3. ✅ Genera cliente Prisma
4. ✅ **Sincroniza la base de datos** (crea las 37 tablas)
5. ✅ **Compila la aplicación** (build de producción)
6. ✅ Crea directorios necesarios (uploads, logs)
7. ✅ Configura PM2
8. ✅ **Inicia Next.js** (puerto 3000)
9. ✅ **Inicia Socket.io** (puerto 3001)

**Tiempo estimado:** 5 minutos

### Durante la Ejecución

El script te preguntará:

```
¿Continuar con la sincronización de BD? (s/n):
```

**Responde:** `s` (sí)

Esto creará las **37 tablas** en tu base de datos MySQL.

---

## 🔍 VERIFICAR QUE FUNCIONÓ

Después de ejecutar `bash deploy.sh`, verifica:

### 1. Ver Estado de las Aplicaciones

```bash
pm2 status
```

**Deberías ver:**
```
┌─────┬──────────────┬─────────┬─────────┐
│ id  │ name         │ status  │ cpu     │
├─────┼──────────────┼─────────┼─────────┤
│ 0   │ nextjs-app   │ online  │ 0%      │
│ 1   │ socket-server│ online  │ 0%      │
└─────┴──────────────┴─────────┴─────────┘
```

✅ **BIEN:** Ambas apps muestran "online"
❌ **MAL:** Apps muestran "errored" o "stopped"

### 2. Ver Logs (Opcional)

```bash
pm2 logs --lines 20
```

**Deberías ver:** Mensajes de inicio sin errores críticos

Presiona `Ctrl+C` para salir

### 3. Verificar Base de Datos

```bash
mysql -u infl_pasiones_user -p infl_pasiones_prod -e "SHOW TABLES;"
```

**Deberías ver:** 37 tablas listadas

---

## ⏭️ DESPUÉS DEL DEPLOYMENT

Una vez que `bash deploy.sh` termine exitosamente:

### 1. Configurar Firewall (2 minutos)

```bash
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --permanent --add-port=3000/tcp
firewall-cmd --permanent --add-port=3001/tcp
firewall-cmd --reload
```

### 2. Configurar Dominios en CyberPanel (15 minutos)

Ver guía completa: **GUIA_DEPLOYMENT_HOSTINGER.md** - Sección "FASE 5"

---

## 🆘 SI ALGO SALE MAL

### Error: "Can't reach database server"

```bash
systemctl status mysqld
systemctl start mysqld
cat .env | grep DATABASE_URL
```

### Apps muestran "errored"

```bash
pm2 logs
pm2 delete all
bash deploy.sh
```

---

## 🎯 TU PRÓXIMO COMANDO

```bash
bash deploy.sh
```

**¡Ejecuta esto AHORA en tu servidor!** 🚀
