# 🎥 Configuración de Streaming en Vivo

## Servidor RTMP con Nginx en Hostinger

### 1. Instalar Nginx con módulo RTMP

```bash
# Conectar por SSH a tu VPS
ssh root@178.16.140.137

# Instalar dependencias
dnf install -y epel-release
dnf install -y nginx nginx-mod-rtmp ffmpeg

# O compilar Nginx con RTMP manualmente
git clone https://github.com/arut/nginx-rtmp-module.git
wget http://nginx.org/download/nginx-1.24.0.tar.gz
tar -xzf nginx-1.24.0.tar.gz
cd nginx-1.24.0

./configure --with-http_ssl_module --add-module=../nginx-rtmp-module
make
make install
```

### 2. Configurar Nginx RTMP

Editar `/etc/nginx/nginx.conf` o crear `/etc/nginx/nginx-rtmp.conf`:

```nginx
# Configuración RTMP
rtmp {
    server {
        listen 1935;
        chunk_size 4096;

        # Aplicación para streaming en vivo
        application live {
            live on;
            record off;

            # Permitir publicación desde localhost y tu servidor
            allow publish 127.0.0.1;
            allow publish 178.16.140.137;
            deny publish all;

            # Permitir reproducción desde cualquier lugar
            allow play all;

            # Webhook de autenticación
            on_publish http://localhost:3000/api/streaming/auth;
            on_publish_done http://localhost:3000/api/streaming/done;

            # Convertir RTMP a HLS para reproducción web
            hls on;
            hls_path /var/www/hls;
            hls_fragment 3;
            hls_playlist_length 60;

            # DASH (opcional)
            dash on;
            dash_path /var/www/dash;
        }

        # Aplicación para grabaciones
        application recorded {
            live on;
            record all;
            record_path /var/www/recordings;
            record_unique on;
        }
    }
}

# Servidor HTTP para servir HLS
http {
    server {
        listen 8080;

        # Servir archivos HLS
        location /hls {
            types {
                application/vnd.apple.mpegurl m3u8;
                video/mp2t ts;
            }
            root /var/www;
            add_header Cache-Control no-cache;
            add_header Access-Control-Allow-Origin *;
        }

        # Estadísticas RTMP
        location /stat {
            rtmp_stat all;
            rtmp_stat_stylesheet stat.xsl;
        }

        location /stat.xsl {
            root /usr/share/nginx/html;
        }
    }
}
```

### 3. Crear directorios necesarios

```bash
mkdir -p /var/www/hls
mkdir -p /var/www/dash
mkdir -p /var/www/recordings

chown -R nginx:nginx /var/www/hls
chown -R nginx:nginx /var/www/dash
chown -R nginx:nginx /var/www/recordings

chmod -R 755 /var/www/hls
chmod -R 755 /var/www/dash
chmod -R 755 /var/www/recordings
```

### 4. Configurar Firewall

```bash
# Abrir puerto RTMP (1935)
firewall-cmd --permanent --add-port=1935/tcp

# Abrir puerto HLS (8080)
firewall-cmd --permanent --add-port=8080/tcp

# Recargar firewall
firewall-cmd --reload
```

### 5. Iniciar Nginx

```bash
systemctl enable nginx
systemctl start nginx
systemctl status nginx

# Ver logs
tail -f /var/log/nginx/error.log
```

---

## Configuración de OBS Studio para Modelos

### 1. Instalar OBS Studio

Los modelos deben descargar OBS Studio desde:
https://obsproject.com/download

### 2. Configurar Streaming en OBS

1. **Abrir OBS Studio**

2. **Ir a Configuración → Transmisión**

3. **Configurar servidor:**
   - Servicio: Personalizado
   - Servidor: `rtmp://178.16.140.137/live`
   - Clave de transmisión: `[obtenida de la API al crear stream]`

4. **Configurar Salida (Output):**
   - Modo: Avanzado
   - Encoder: x264 o NVENC (si tiene GPU NVIDIA)
   - Bitrate de video: 2500-5000 kbps
   - Keyframe Interval: 2
   - Preset: veryfast

5. **Configurar Video:**
   - Resolución base: 1920x1080
   - Resolución de salida: 1280x720 (recomendado)
   - FPS: 30

6. **Configurar Audio:**
   - Bitrate de audio: 128-160 kbps
   - Canales: Stereo

### 3. Escenas y Fuentes

**Escena básica:**
- Fuente de video: Cámara web
- Fuente de audio: Micrófono
- Texto: Nombre del modelo
- Imagen: Logo o marca de agua

---

## API de Autenticación de Streaming

Crear endpoint para verificar stream key:

```typescript
// src/app/api/streaming/auth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(req: NextRequest) {
  try {
    // Nginx envía el stream key en el body
    const formData = await req.formData();
    const streamKey = formData.get('name') as string;

    // Verificar stream key en BD
    const stream = await prisma.stream.findUnique({
      where: { streamKey },
      include: { model: true },
    });

    if (!stream) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    // Verificar membresía del modelo
    if (stream.model.membershipType === 'FREE') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Activar stream
    await prisma.stream.update({
      where: { id: stream.id },
      data: { isLive: true, startedAt: new Date() },
    });

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('Error en autenticación de stream:', error);
    return new NextResponse('Error', { status: 500 });
  }
}
```

---

## Reproducción en el Frontend

### Usando HLS.js

```typescript
import Hls from 'hls.js';

const video = document.getElementById('video') as HTMLVideoElement;
const streamUrl = 'http://178.16.140.137:8080/hls/stream_key.m3u8';

if (Hls.isSupported()) {
  const hls = new Hls();
  hls.loadSource(streamUrl);
  hls.attachMedia(video);
  hls.on(Hls.Events.MANIFEST_PARSED, () => {
    video.play();
  });
} else if (video.canPlayType('application/vnd.apple.mpegurl')) {
  // Safari nativo
  video.src = streamUrl;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
}
```

---

## Monitoreo y Estadísticas

### Ver estadísticas de RTMP

Acceder a: `http://178.16.140.137:8080/stat`

Muestra:
- Streams activos
- Viewers conectados
- Bitrate
- FPS
- Tiempo de transmisión

---

## Alternativas Cloud (más fáciles pero de pago)

Si no quieres configurar tu propio servidor RTMP:

### 1. **Cloudflare Stream** (Recomendado)
- Pricing: $5/mes + $1 por 1000 minutos
- URL: https://cloudflare.com/products/cloudflare-stream/

### 2. **AWS IVS (Interactive Video Service)**
- Pricing: $2.20 por hora de streaming
- Latencia ultra-baja

### 3. **Mux**
- Pricing: $0.015 por minuto de video
- Fácil integración con API

### 4. **Agora.io**
- Especializado en videollamadas
- 10,000 minutos gratis/mes

---

## Configuración para Producción

### Variables de entorno

```env
# .env
STREAMING_SERVER="rtmp://178.16.140.137/live"
HLS_SERVER="http://178.16.140.137:8080/hls"
SOCKET_PORT="3001"
NEXT_PUBLIC_SOCKET_URL="https://influencersex.com:3001"
```

### Proxy reverso para Socket.io

En nginx config:

```nginx
location /socket.io/ {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
}
```

---

## Pruebas

### 1. Probar RTMP server

```bash
# Usar FFmpeg para simular streaming
ffmpeg -re -i test.mp4 -c copy -f flv rtmp://178.16.140.137/live/test_stream
```

### 2. Verificar HLS

Abrir en navegador:
```
http://178.16.140.137:8080/hls/test_stream.m3u8
```

### 3. Monitor en tiempo real

```bash
# Ver logs de nginx
tail -f /var/log/nginx/access.log

# Ver estadísticas
curl http://178.16.140.137:8080/stat
```

---

## Solución de Problemas

### Stream no se conecta
```bash
# Verificar que nginx esté corriendo
systemctl status nginx

# Verificar puertos
netstat -tlnp | grep 1935

# Ver logs de error
tail -f /var/log/nginx/error.log
```

### Sin video en el reproductor
```bash
# Verificar que HLS esté generando archivos
ls -la /var/www/hls/

# Permisos correctos
chmod -R 755 /var/www/hls/
chown -R nginx:nginx /var/www/hls/
```

### Alta latencia
- Reducir `hls_fragment` a 1-2 segundos
- Usar DASH en lugar de HLS
- Considerar WebRTC para latencia ultra-baja

---

## Seguridad

1. **Autenticación obligatoria** con webhook
2. **Rate limiting** para prevenir spam
3. **HTTPS** para HLS (usar Let's Encrypt)
4. **Firewall** configurado correctamente
5. **Backup** de configuraciones

---

## Costos Estimados

### Con servidor propio (Hostinger VPS):
- VPS: Ya incluido
- Ancho de banda: ~100GB por hora de streaming Full HD
- Sin costos adicionales

### Con servicios cloud:
- Cloudflare Stream: ~$50-200/mes dependiendo uso
- AWS IVS: ~$100-500/mes
- Mux: ~$75-250/mes

**Recomendación:** Usar servidor propio inicialmente, migrar a cloud si escala mucho.
