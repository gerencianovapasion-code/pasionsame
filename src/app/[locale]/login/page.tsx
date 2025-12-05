import { LoginForm } from '@/components/auth/LoginForm';
import { headers } from 'next/headers';
import { getSiteConfig } from '@/config/sites';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const headersList = await headers();
  const hostname = headersList.get('x-hostname') || 'influencersex.com';
  const siteConfig = getSiteConfig(hostname);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-pink-50 to-rose-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link href={`/${locale}`} className="inline-block">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-white font-bold text-3xl">P</span>
            </div>
          </Link>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link
              href={`/${locale}/register`}
              className="font-medium text-pink-600 hover:text-pink-500"
            >
              Regístrate gratis
            </Link>
          </p>
        </div>

        {/* Formulario de Login */}
        <LoginForm locale={locale} />

        {/* Separador */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gradient-to-br from-white via-pink-50 to-rose-50 text-gray-500">
              O continúa con
            </span>
          </div>
        </div>

        {/* Login Social */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 0C4.477 0 0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.879V12.89h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.989C16.343 19.128 20 14.991 20 10c0-5.523-4.477-10-10-10z" />
            </svg>
            <span className="ml-2">Facebook</span>
          </button>

          <button
            type="button"
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm3.5 6.5h-1.75c-.414 0-.75.336-.75.75v1h2.5l-.375 2.5h-2.125v6.25H8.5v-6.25H6.75V8.25H8.5v-1c0-1.654 1.346-3 3-3h1.75v2.25z" />
            </svg>
            <span className="ml-2">Google</span>
          </button>
        </div>

        {/* Link a registro de modelo */}
        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            ¿Eres creador de contenido?{' '}
            <Link
              href={`/${locale}/register/model`}
              className="font-medium text-pink-600 hover:text-pink-500"
            >
              Regístrate como modelo
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
