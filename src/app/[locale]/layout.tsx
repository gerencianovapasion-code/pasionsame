import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '../../../i18n';
import { getSiteConfig } from '@/config/sites';
import { headers } from 'next/headers';
import '../globals.css';
import ClientBody from '../ClientBody';
import Script from 'next/script';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const hostname = headersList.get('x-hostname') || 'influencersex.com';
  const siteConfig = getSiteConfig(hostname);

  return {
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: 'creadores, contenido, red social, suscripciones, streaming, videochat',
    authors: [{ name: siteConfig.name }],
    openGraph: {
      type: 'website',
      locale: 'es_ES',
      url: `https://${siteConfig.domain}`,
      siteName: siteConfig.name,
      title: siteConfig.name,
      description: siteConfig.description,
    },
    twitter: {
      card: 'summary_large_image',
      title: siteConfig.name,
      description: siteConfig.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validar que el locale sea válido
  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const headersList = await headers();
  const hostname = headersList.get('x-hostname') || 'influencersex.com';
  const siteConfig = getSiteConfig(hostname);

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <Script crossOrigin="anonymous" src="//unpkg.com/same-runtime/dist/index.global.js" />
        <style>{`
          :root {
            --primary: ${siteConfig.primaryColor};
            --secondary: ${siteConfig.secondaryColor};
            --accent: ${siteConfig.accentColor};
          }
        `}</style>
      </head>
      <body suppressHydrationWarning className="antialiased">
        <ClientBody>
          <NextIntlClientProvider messages={messages}>
            <div style={{ background: siteConfig.gradient }} className="min-h-screen">
              {children}
            </div>
          </NextIntlClientProvider>
        </ClientBody>
      </body>
    </html>
  );
}
