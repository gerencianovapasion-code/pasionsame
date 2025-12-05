import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Idiomas soportados
export const locales = ['es', 'pt', 'en', 'de', 'it', 'ro', 'fr'] as const;
export type Locale = (typeof locales)[number];

// Configuración de países y sus idiomas predeterminados
export const countryLocales: Record<string, Locale> = {
  ES: 'es', // España
  PT: 'pt', // Portugal
  FR: 'fr', // Francia
  DE: 'de', // Alemania
  IT: 'it', // Italia
  RO: 'ro', // Rumania
  GB: 'en', // Reino Unido
  US: 'en', // Estados Unidos
  CA: 'en', // Canadá
  MX: 'es', // México
  AR: 'es', // Argentina
  CO: 'es', // Colombia
  BR: 'pt', // Brasil
  CL: 'es', // Chile
  PE: 'es', // Perú
  VE: 'es', // Venezuela
  PY: 'es', // Paraguay
  UY: 'es', // Uruguay
};

export default getRequestConfig(async (params) => {
  const locale = params.locale;

  // Validar que el locale sea soportado
  if (!locale || !locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
