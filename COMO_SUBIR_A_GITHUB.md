# 🚀 CÓMO SUBIR A GITHUB - GUÍA SIMPLE

## ⚡ MÉTODO RÁPIDO: GitHub Desktop (Recomendado)

### 1. Descargar GitHub Desktop
```
https://desktop.github.com/
```

### 2. Pasos en GitHub Desktop:
1. Instalar y abrir
2. **Sign in** con cuenta `gerencianovapasion-code`
3. **File** → **Add local repository**
4. Seleccionar carpeta: `red-social-creadores`
5. **Publish repository**
   - Name: `pasionsame`
   - Description: Red Social Multi-Sitio
   - ☐ Keep this code private (DESMARCAR)
6. Click **Publish repository**

**¡LISTO!** Todo se sube automáticamente.

---

## 💻 MÉTODO ALTERNATIVO: Terminal

### 1. Crear Personal Access Token

1. Ir a: https://github.com/settings/tokens/new
2. Configurar:
   - Note: `PasionSame Deploy`
   - Expiration: `No expiration`
   - Scopes: Marcar `repo` (todos)
3. Generate token
4. **COPIAR** el token (empieza con `ghp_...`)

### 2. Push desde Terminal

```bash
cd ruta/a/red-social-creadores
git push -u origin main
```

**Credenciales:**
- Username: `gerencianovapasion-code`
- Password: `[TU TOKEN AQUÍ]` ⚠️ NO tu contraseña!

---

## ✅ Verificar que se Subió

Ir a:
```
https://github.com/gerencianovapasion-code/pasionsame
```

Deberías ver:
- ✅ ~102 archivos
- ✅ README.md visible
- ✅ Carpetas: src/, prisma/, messages/
- ✅ 2 commits

---

## 📞 Próximos Pasos

Después del push, seguir:
- **INICIO_RAPIDO.md** (deployment en 30 min)
- **GUIA_DEPLOYMENT_HOSTINGER.md** (guía completa)

---

**¡Éxito!** 🎉
