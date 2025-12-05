# 🚧 Funcionalidades Pendientes - Guía de Implementación

## 📋 Resumen

Esta aplicación tiene la **estructura base completa** con:
- ✅ Sistema multi-sitio (5 dominios)
- ✅ Internacionalización (7 idiomas)
- ✅ Base de datos completa con Prisma
- ✅ UI/UX moderno y responsive
- ✅ Sistema de búsqueda
- ✅ Estructura de países y provincias

**Funcionalidades que requieren implementación adicional:**

## 1. Sistema de Autenticación 🔐

### Usando NextAuth v5

**Archivos a crear:**

`src/app/api/auth/[...nextauth]/route.ts`:
```typescript
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import { prisma } from '@/lib/db/prisma';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { model: true }
        });

        if (user && await bcrypt.compare(credentials.password, user.password)) {
          return { ...user, role: user.role };
        }
        return null;
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!
    })
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
});
```

### Páginas de Login y Registro

Ya existe la estructura de rutas. Crear:
- `src/app/[locale]/login/page.tsx`
- `src/app/[locale]/register/page.tsx`
- `src/app/[locale]/register/model/page.tsx` (registro de modelos)

## 2. Panel de Administración 👨‍💼

### Rutas Protegidas

Crear middleware para proteger rutas admin:

`src/middleware.ts` (actualizar):
```typescript
import { auth } from './auth';

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Proteger rutas de admin
  if (pathname.startsWith('/admin')) {
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Proteger rutas de modelo
  if (pathname.includes('/dashboard')) {
    if (!session || session.user.role !== 'MODEL') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return intlMiddleware(request);
}
```

### Estructura del Panel Admin

Crear en `src/app/[locale]/admin/`:
- `dashboard/page.tsx` - Estadísticas generales
- `models/page.tsx` - Gestión de modelos
- `users/page.tsx` - Gestión de usuarios
- `verifications/page.tsx` - Verificaciones pendientes
- `withdrawals/page.tsx` - Retiros pendientes
- `settings/page.tsx` - Configuración del sistema
- `banners/page.tsx` - Gestión de banners por sitio
- `blog/page.tsx` - Gestión del blog

## 3. Perfil de Modelo Completo 👤

### Página de Perfil

`src/app/[locale]/models/[username]/page.tsx`:
```typescript
import { prisma } from '@/lib/db/prisma';
import { ModelProfile } from '@/components/models/ModelProfile';
import { ModelPosts } from '@/components/models/ModelPosts';
import { ModelMedia } from '@/components/models/ModelMedia';

export default async function ModelPage({ params }) {
  const { username } = await params;

  const model = await prisma.model.findUnique({
    where: { username },
    include: {
      user: true,
      country: true,
      province: true,
      posts: { take: 10, orderBy: { createdAt: 'desc' } },
      media: { take: 20, where: { isPremium: false } }
    }
  });

  if (!model) notFound();

  return (
    <div>
      <ModelProfile model={model} />
      <ModelPosts posts={model.posts} />
      <ModelMedia media={model.media} />
    </div>
  );
}
```

## 4. Sistema de Suscripciones y Pagos 💰

### Integración de Stripe

`src/app/api/subscriptions/create/route.ts`:
```typescript
import Stripe from 'stripe';
import { auth } from '@/auth';
import { prisma } from '@/lib/db/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return new Response('Unauthorized', { status: 401 });

  const { modelId } = await req.json();

  const model = await prisma.model.findUnique({
    where: { id: modelId }
  });

  // Crear suscripción en Stripe
  const subscription = await stripe.subscriptions.create({
    customer: session.user.stripeCustomerId,
    items: [{ price: model.stripePriceId }],
    expand: ['latest_invoice.payment_intent'],
  });

  // Guardar en base de datos
  await prisma.subscription.create({
    data: {
      userId: session.user.id,
      modelId,
      price: model.subscriptionPrice,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      stripeSubscriptionId: subscription.id
    }
  });

  return Response.json({ subscription });
}
```

### Webhooks de Stripe

`src/app/api/webhooks/stripe/route.ts`:
```typescript
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { prisma } from '@/lib/db/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Manejar diferentes eventos
  switch (event.type) {
    case 'subscription.created':
    case 'subscription.updated':
      // Actualizar suscripción
      break;
    case 'subscription.deleted':
      // Cancelar suscripción
      break;
    case 'invoice.paid':
      // Registrar pago
      break;
    case 'payment_intent.succeeded':
      // Pago exitoso
      break;
  }

  return Response.json({ received: true });
}
```

## 5. Sistema de Posts y Contenido 📝

### API para Crear Posts

`src/app/api/posts/create/route.ts`:
```typescript
import { auth } from '@/auth';
import { prisma } from '@/lib/db/prisma';

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== 'MODEL') {
    return new Response('Unauthorized', { status: 401 });
  }

  const { content, isPremium, price, mediaUrls } = await req.json();

  // Verificar límites de membresía
  const model = await prisma.model.findUnique({
    where: { userId: session.user.id },
    include: { _count: { select: { posts: true } } }
  });

  const limits = {
    FREE: { postsPerDay: 3, maxPhotos: 10, maxVideos: 5 },
    BRONZE: { postsPerDay: 5, maxPhotos: 20, maxVideos: 20 },
    SILVER: { postsPerDay: 10, maxPhotos: 40, maxVideos: 40 },
    GOLD: { postsPerDay: 20, maxPhotos: 80, maxVideos: 80 }
  };

  const limit = limits[model.membershipType];

  // Verificar límites...

  // Crear post
  const post = await prisma.post.create({
    data: {
      modelId: model.id,
      content,
      isPremium,
      price: isPremium ? price : null,
      media: {
        create: mediaUrls.map(url => ({
          url,
          type: 'IMAGE',
          modelId: model.id
        }))
      }
    },
    include: { media: true }
  });

  return Response.json(post);
}
```

## 6. Streaming en Vivo 🎥

### Configuración del Servidor RTMP

Necesitarás instalar un servidor RTMP en tu VPS:

```bash
# Instalar nginx-rtmp
dnf install nginx-rtmp-module

# Configurar /etc/nginx/nginx.conf
rtmp {
    server {
        listen 1935;
        chunk_size 4096;

        application live {
            live on;
            record off;

            # Autenticación
            on_publish http://localhost:3000/api/stream/auth;
            on_publish_done http://localhost:3000/api/stream/done;
        }
    }
}
```

### API de Streaming

`src/app/api/stream/start/route.ts`:
```typescript
import { auth } from '@/auth';
import { prisma } from '@/lib/db/prisma';
import { randomBytes } from 'crypto';

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== 'MODEL') {
    return new Response('Unauthorized', { status: 401 });
  }

  const { title, description, pricePerView } = await req.json();

  const streamKey = randomBytes(16).toString('hex');

  const stream = await prisma.stream.create({
    data: {
      modelId: session.user.model.id,
      title,
      description,
      pricePerView,
      streamKey,
      streamUrl: `rtmp://178.16.140.137/live/${streamKey}`,
      isLive: false
    }
  });

  return Response.json({ stream });
}
```

### Componente de Reproductor

`src/components/streaming/StreamPlayer.tsx`:
```typescript
'use client';

import { useEffect, useRef } from 'react';
import videojs from 'video.js';

export function StreamPlayer({ streamUrl }: { streamUrl: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const player = videojs(videoRef.current, {
      controls: true,
      autoplay: true,
      sources: [{
        src: streamUrl,
        type: 'application/x-mpegURL' // HLS
      }]
    });

    return () => player.dispose();
  }, [streamUrl]);

  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-big-play-centered" />
    </div>
  );
}
```

## 7. Sistema de Créditos "PASIONES" 💎

### Compra de Créditos

`src/app/api/credits/purchase/route.ts`:
```typescript
import Stripe from 'stripe';
import { auth } from '@/auth';
import { prisma } from '@/lib/db/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Paquetes de créditos
const packages = {
  small: { credits: 100, price: 9.99 },
  medium: { credits: 500, price: 39.99 },
  large: { credits: 1000, price: 69.99 }
};

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return new Response('Unauthorized', { status: 401 });

  const { package: pkg } = await req.json();
  const packageData = packages[pkg];

  // Crear pago en Stripe
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(packageData.price * 100),
    currency: 'eur',
    metadata: { userId: session.user.id, credits: packageData.credits }
  });

  return Response.json({ clientSecret: paymentIntent.client_secret });
}
```

## 8. Sistema de Mensajería 💬

### WebSocket con Pusher o Socket.io

`src/lib/pusher.ts`:
```typescript
import Pusher from 'pusher';
import PusherClient from 'pusher-js';

export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true
});

export const pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!
});
```

## 9. Sistema de Notificaciones 🔔

### API de Notificaciones

`src/app/api/notifications/route.ts`:
```typescript
import { auth } from '@/auth';
import { prisma } from '@/lib/db/prisma';
import { pusherServer } from '@/lib/pusher';

export async function GET() {
  const session = await auth();
  if (!session) return new Response('Unauthorized', { status: 401 });

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 20
  });

  return Response.json(notifications);
}

// Función helper para crear notificaciones
export async function createNotification(userId: string, type: string, data: any) {
  const notification = await prisma.notification.create({
    data: {
      userId,
      type,
      title: data.title,
      message: data.message,
      link: data.link
    }
  });

  // Enviar en tiempo real con Pusher
  await pusherServer.trigger(`user-${userId}`, 'notification', notification);

  return notification;
}
```

## 10. SEO Dinámico 🔍

### Generar Sitemap

`src/app/sitemap.ts`:
```typescript
import { prisma } from '@/lib/db/prisma';
import { countries } from '@/data/countries';

export default async function sitemap() {
  const models = await prisma.model.findMany({
    select: { username: true, updatedAt: true }
  });

  const modelUrls = models.map(model => ({
    url: `https://influencersex.com/models/${model.username}`,
    lastModified: model.updatedAt,
    changeFrequency: 'daily',
    priority: 0.8
  }));

  const countryUrls = countries.map(country => ({
    url: `https://influencersex.com/countries/${country.code}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7
  }));

  return [
    {
      url: 'https://influencersex.com',
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    },
    ...modelUrls,
    ...countryUrls
  ];
}
```

## 📦 Dependencias Adicionales Necesarias

```bash
bun add pusher pusher-js  # Para mensajería en tiempo real
bun add video.js  # Para streaming
bun add socket.io socket.io-client  # Alternativa a Pusher
bun add nodemailer  # Para envío de emails
bun add react-dropzone  # Para subida de archivos
bun add react-hook-form zod  # Para formularios
bun add @tanstack/react-query  # Para gestión de estado
bun add date-fns  # Para manejo de fechas
```

## 🎯 Prioridades de Implementación

1. **ALTA**: Autenticación y registro
2. **ALTA**: Sistema de suscripciones (Stripe/PayPal)
3. **ALTA**: Perfiles de modelo completos
4. **MEDIA**: Sistema de posts y contenido
5. **MEDIA**: Panel de administración
6. **MEDIA**: Sistema de créditos
7. **BAJA**: Streaming en vivo
8. **BAJA**: Videochat
9. **BAJA**: Mensajería avanzada

## 💡 Notas Importantes

- Todas las funcionalidades de pago deben cumplir con PCI DSS
- Implementar rate limiting para prevenir abuso
- Usar lazy loading para mejorar rendimiento
- Implementar caché con Redis para mejorar velocidad
- Configurar CDN para assets estáticos
- Monitorear con herramientas como Sentry

## 📚 Recursos Útiles

- [NextAuth Docs](https://next-auth.js.org/)
- [Stripe Docs](https://stripe.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Pusher Docs](https://pusher.com/docs)
