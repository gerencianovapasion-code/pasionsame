# 📤 GUÍA COMPLETA: SUBIR PROYECTO A GITHUB

## ✅ Estado del Repositorio

```
✅ Git inicializado correctamente
✅ Repositorio remoto configurado
✅ 1 commit listo para push
✅ 102 archivos preparados
✅ Rama: main
✅ Remoto: https://github.com/gerencianovapasion-code/pasionsame.git
```

---

## 🚀 OPCIÓN 1: PUSH DESDE TERMINAL (Recomendado)

### Paso 1: Abrir Terminal

**Windows:**
```bash
# Git Bash o PowerShell
cd C:\ruta\a\red-social-creadores
```

**macOS/Linux:**
```bash
cd /ruta/a/red-social-creadores
```

### Paso 2: Verificar Estado

```bash
# Verificar que estás en la rama main
git branch

# Ver el estado
git status

# Ver los commits pendientes
git log --oneline -3
```

### Paso 3: Hacer Push

```bash
# Push inicial con tracking
git push -u origin main
```

**Te pedirá credenciales:**
- **Username:** `gerencianovapasion-code`
- **Password:** **[Tu Personal Access Token]** (NO tu contraseña de GitHub)

---

## 🔑 CREAR PERSONAL ACCESS TOKEN

### ¿Por qué necesitas un token?

GitHub ya no acepta contraseñas para operaciones Git. Necesitas un Personal Access Token (PAT).

### Pasos para crear el token:

1. **Ir a GitHub Settings:**
   ```
   https://github.com/settings/tokens
   ```

2. **Click en "Generate new token"**
   - Selecciona: **"Generate new token (classic)"**

3. **Configurar el token:**
   - **Note:** `Deployment PasionSame` (nombre descriptivo)
   - **Expiration:** `No expiration` o `90 days`
   - **Select scopes:** Marca **`repo`** (esto marca automáticamente todos los sub-items necesarios)

4. **Click "Generate token"**

5. **Copiar y guardar el token:**
   - El token se verá así: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - ⚠️ **MUY IMPORTANTE:** Cópialo ahora, solo lo verás una vez
   - Guárdalo en un lugar seguro (gestor de contraseñas)

6. **Usar el token:**
   - Cuando Git te pida "Password:", pega el token (no tu contraseña de GitHub)

### Ejemplo de token:
```
ghp_1234567890abcdefghijklmnopqrstuvwxyzABCD
```

---

## 🖥️ OPCIÓN 2: USAR GITHUB DESKTOP (Más Fácil)

### Paso 1: Descargar GitHub Desktop

```
https://desktop.github.com/
```

### Paso 2: Configurar

1. Abrir GitHub Desktop
2. Click en "File" → "Add local repository"
3. Seleccionar la carpeta `red-social-creadores`
4. Iniciar sesión con tu cuenta de GitHub

### Paso 3: Push

1. En la esquina superior derecha, click en "Publish branch"
2. Selecciona "Keep this code private" si quieres que sea privado
3. Click en "Publish repository"

✅ **¡Listo! GitHub Desktop se encarga de todo.**

---

## 📊 ¿QUÉ SE VA A SUBIR?

### Total: **102 archivos**

#### 📝 Documentación (14 archivos)
- ✅ README.md (descripción completa del proyecto)
- ✅ README_PUSH.md (esta guía)
- ✅ PUSH_A_GITHUB.md (guía alternativa)
- ✅ INSTALACION.md (instalación en VPS)
- ✅ INICIO_RAPIDO.md (despliegue rápido)
- ✅ GUIA_DEPLOYMENT_HOSTINGER.md (guía completa Hostinger)
- ✅ FUNCIONALIDADES_PENDIENTES.md
- ✅ FUNCIONALIDADES_AVANZADAS_IMPLEMENTADAS.md
- ✅ CONFIGURACION_STREAMING.md
- ✅ RESUMEN_FINAL.md
- ✅ PASOS_SIGUIENTES.md
- ✅ VERIFICACION_FINAL.md
- Y más...

#### 💻 Código Fuente (80+ archivos)
- ✅ src/app/ (páginas y API routes)
- ✅ src/components/ (componentes React)
- ✅ src/config/ (configuración multi-sitio)
- ✅ src/data/ (países, provincias)
- ✅ src/lib/ (utilidades, Prisma)
- ✅ prisma/schema.prisma (esquema de base de datos)
- ✅ messages/ (traducciones en 7 idiomas)
- ✅ server.js (servidor producción)
- ✅ middleware.ts (middleware Next.js)
- ✅ i18n.ts (configuración internacionalización)

#### ⚙️ Configuración (8 archivos)
- ✅ package.json (dependencias)
- ✅ .env.example (plantilla de variables de entorno)
- ✅ next.config.js (configuración Next.js)
- ✅ tailwind.config.ts (configuración Tailwind)
- ✅ tsconfig.json (configuración TypeScript)
- ✅ components.json (shadcn/ui)
- ✅ ecosystem.config.js (PM2)
- ✅ postcss.config.mjs

#### 🚫 NO se subirá:
- ❌ .env (credenciales reales - está en .gitignore)
- ❌ node_modules/ (dependencias - se reinstalan)
- ❌ .next/ (build - se regenera)
- ❌ .bun/ (caché)

---

## ✅ VERIFICAR QUE TODO SE SUBIÓ

### En GitHub Web:

1. **Ir a tu repositorio:**
   ```
   https://github.com/gerencianovapasion-code/pasionsame
   ```

2. **Deberías ver:**
   - ✅ ~102 archivos
   - ✅ README.md visible con la descripción del proyecto
   - ✅ Carpetas: src/, prisma/, messages/, public/
   - ✅ Archivos de configuración: package.json, next.config.js, etc.
   - ✅ Commit message: "🚀 Proyecto completo - Red Social Multi-Sitio"

3. **Verificar carpetas importantes:**
   - [ ] `src/app/` - Rutas y páginas
   - [ ] `src/components/` - Componentes UI
   - [ ] `prisma/` - Esquema de base de datos
   - [ ] `messages/` - Traducciones (es, en, pt, de, it, ro, fr)
   - [ ] `public/` - Assets estáticos

---

## 🔄 FUTURAS ACTUALIZACIONES

Cuando hagas cambios al proyecto:

```bash
# 1. Ver qué cambió
git status

# 2. Agregar archivos modificados
git add .

# 3. Hacer commit con mensaje descriptivo
git commit -m "Descripción de los cambios realizados"

# 4. Push a GitHub (ya no pedirá credenciales si usaste -u antes)
git push
```

### Ejemplo real:
```bash
git add .
git commit -m "feat: Agregar sistema de notificaciones push"
git push
```

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### ❌ Error: "Authentication failed"

**Causa:** Token incorrecto o sin permisos

**Solución:**
1. Verifica que estés usando el **Personal Access Token** (no tu contraseña)
2. Asegúrate que el token tenga el scope `repo` marcado
3. Si expira, crea un nuevo token

### ❌ Error: "Repository not found"

**Causa:** URL del remoto incorrecta

**Solución:**
```bash
# Ver remotos configurados
git remote -v

# Debe mostrar:
# origin  https://github.com/gerencianovapasion-code/pasionsame.git (fetch)
# origin  https://github.com/gerencianovapasion-code/pasionsame.git (push)

# Si está mal, corregir:
git remote set-url origin https://github.com/gerencianovapasion-code/pasionsame.git
```

### ❌ Error: "Updates were rejected"

**Causa:** El repositorio remoto tiene commits que no tienes localmente

**Solución:**
```bash
# Traer cambios del remoto
git pull origin main --allow-unrelated-histories

# Luego hacer push
git push -u origin main
```

### ❌ Error: "Permission denied (publickey)"

**Causa:** Intentando usar SSH sin configurar

**Solución:**
```bash
# Cambiar a HTTPS
git remote set-url origin https://github.com/gerencianovapasion-code/pasionsame.git

# Hacer push
git push -u origin main
```

### ❌ Error: "refusing to merge unrelated histories"

**Causa:** Repositorio remoto tiene historia diferente

**Solución:**
```bash
git pull origin main --allow-unrelated-histories --rebase
git push -u origin main
```

---

## 🔒 GUARDAR CREDENCIALES (Opcional)

Para no tener que ingresar el token cada vez:

### Windows (Git Credential Manager):
```bash
git config --global credential.helper wincred
```

### macOS (Keychain):
```bash
git config --global credential.helper osxkeychain
```

### Linux (Cache temporal):
```bash
# Guardar por 1 hora
git config --global credential.helper 'cache --timeout=3600'

# Guardar por 24 horas
git config --global credential.helper 'cache --timeout=86400'
```

### Almacenar de forma permanente (NO recomendado):
```bash
git config --global credential.helper store
```
⚠️ **Cuidado:** Esto guarda el token en texto plano en tu disco

---

## 📱 OPCIÓN 3: DESDE MOBILE (GitHub Mobile App)

1. Descargar **GitHub Mobile** (iOS/Android)
2. Iniciar sesión
3. Navegar a tu repositorio
4. Ver commits, archivos, etc.

**Nota:** No puedes hacer push desde mobile, solo ver el código.

---

## 🌐 CLONAR EL REPOSITORIO EN OTRO EQUIPO

Una vez que hayas hecho push, puedes clonar en otros equipos:

```bash
# Clonar el repositorio
git clone https://github.com/gerencianovapasion-code/pasionsame.git

# Entrar al directorio
cd pasionsame

# Instalar dependencias
bun install

# Configurar .env (copiar de .env.example y completar)
cp .env.example .env
nano .env

# Ejecutar en desarrollo
bun run dev
```

---

## 📋 CHECKLIST FINAL

Antes de hacer push, verifica:

- [ ] ¿Eliminaste información sensible del código? (.env está en .gitignore)
- [ ] ¿El archivo .env.example tiene todas las variables necesarias?
- [ ] ¿El README.md está actualizado?
- [ ] ¿Funcionan los comandos de instalación?
- [ ] ¿Has probado el código localmente?

---

## 🎯 SIGUIENTES PASOS DESPUÉS DEL PUSH

### 1. Deployment en Hostinger VPS

Sigue la guía completa en:
- **Rápido (30 min):** `INICIO_RAPIDO.md`
- **Completo (paso a paso):** `GUIA_DEPLOYMENT_HOSTINGER.md`

### 2. Configurar GitHub Actions (Opcional)

Para CI/CD automático al hacer push:

```yaml
# .github/workflows/deploy.yml
name: Deploy to VPS

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /home/influencersex/red-social-creadores
            git pull
            bun install
            bun run build
            pm2 restart all
```

### 3. Proteger la rama main

En GitHub:
1. Settings → Branches
2. Add rule para `main`
3. Marcar:
   - [ ] Require pull request reviews
   - [ ] Require status checks
   - [ ] Include administrators

---

## 🔗 RECURSOS ÚTILES

- **Git Cheat Sheet:** https://education.github.com/git-cheat-sheet-education.pdf
- **GitHub Docs:** https://docs.github.com
- **Git Book (Español):** https://git-scm.com/book/es/v2
- **GitHub Desktop Docs:** https://docs.github.com/en/desktop

---

## 📞 SOPORTE

Si tienes problemas:

1. **Revisar esta guía completa**
2. **Buscar el error en Google**
3. **Stack Overflow:** https://stackoverflow.com
4. **GitHub Community:** https://github.community

---

## ✅ RESUMEN EJECUTIVO

### Para hacer push AHORA mismo:

```bash
# 1. Abrir terminal en la carpeta del proyecto
cd /ruta/a/red-social-creadores

# 2. Hacer push
git push -u origin main

# 3. Ingresar credenciales cuando te las pida:
# Username: gerencianovapasion-code
# Password: [Tu Personal Access Token de GitHub]

# 4. Verificar en:
# https://github.com/gerencianovapasion-code/pasionsame
```

---

**¡Listo para subir a GitHub!** 🚀

---

**Fecha de creación:** 26 de Noviembre de 2025
**Proyecto:** Red Social Multi-Sitio para Creadores de Contenido
**Repositorio:** https://github.com/gerencianovapasion-code/pasionsame
**Documentación:** Ver todos los archivos .md en el repositorio
