import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales } from './i18n';
import { auth } from './src/lib/auth';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'es',
  localePrefix: 'as-needed',
});

export async function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;

  // Si es una ruta de API, no procesar con intl
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Verificar autenticación para rutas protegidas
  const session = await auth();

  // Proteger rutas de administración
  if (pathname.includes('/admin')) {
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Proteger dashboard de modelos
  if (pathname.includes('/dashboard')) {
    if (!session || session.user.role !== 'MODEL') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Procesar con internacionalización
  const response = intlMiddleware(request);
  response.headers.set('x-hostname', hostname);

  return response;
}

export const config = {
  matcher: ['/', '/(es|pt|en|de|it|ro|fr)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
