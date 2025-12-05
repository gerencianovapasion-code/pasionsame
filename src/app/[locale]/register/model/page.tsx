import { ModelRegisterForm } from '@/components/auth/ModelRegisterForm';
import Link from 'next/link';

export default async function ModelRegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-pink-50 to-rose-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href={`/${locale}`} className="inline-block">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-white font-bold text-3xl">P</span>
            </div>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Conviértete en Creador
          </h1>
          <p className="text-lg text-gray-600">
            Monetiza tu contenido y conecta con tu audiencia
          </p>
        </div>

        {/* Beneficios */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">¿Por qué unirte?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
              </div>
              <div className="ml-3">
                <h3 className="font-semibold">Gana Dinero</h3>
                <p className="text-sm text-gray-600">
                  80% de comisión en todas tus ventas
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
              </div>
              <div className="ml-3">
                <h3 className="font-semibold">Control Total</h3>
                <p className="text-sm text-gray-600">
                  Tú decides tus precios y contenido
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
              </div>
              <div className="ml-3">
                <h3 className="font-semibold">Múltiples Formatos</h3>
                <p className="text-sm text-gray-600">
                  Fotos, videos, streaming y más
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
              </div>
              <div className="ml-3">
                <h3 className="font-semibold">Soporte 24/7</h3>
                <p className="text-sm text-gray-600">
                  Te ayudamos a crecer tu negocio
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <ModelRegisterForm locale={locale} />

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link
              href={`/${locale}/login`}
              className="font-medium text-pink-600 hover:text-pink-500"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
