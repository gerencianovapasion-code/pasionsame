'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';

export function Footer() {
  const locale = useLocale();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t mt-16">
      <div className="container mx-auto px-4 py-12">
        {/* Blog Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Últimas del Blog</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Link
                key={i}
                href={`/${locale}/blog/post-${i}`}
                className="group"
              >
                <div className="bg-gradient-to-br from-pink-100 to-rose-100 rounded-lg h-32 mb-3 group-hover:from-pink-200 group-hover:to-rose-200 transition-all" />
                <h4 className="font-semibold text-gray-800 group-hover:text-pink-600 transition-colors">
                  Título del Post {i}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  Descripción breve del artículo del blog...
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-bold text-gray-800 mb-4">Sobre Nosotros</h4>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/about`} className="text-gray-600 hover:text-pink-600 transition-colors">
                  Quiénes Somos
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/how-it-works`} className="text-gray-600 hover:text-pink-600 transition-colors">
                  Cómo Funciona
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/careers`} className="text-gray-600 hover:text-pink-600 transition-colors">
                  Trabaja con Nosotros
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-800 mb-4">Para Creadores</h4>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/become-creator`} className="text-gray-600 hover:text-pink-600 transition-colors">
                  Ser Creador
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/pricing`} className="text-gray-600 hover:text-pink-600 transition-colors">
                  Precios
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/resources`} className="text-gray-600 hover:text-pink-600 transition-colors">
                  Recursos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-800 mb-4">Soporte</h4>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/help`} className="text-gray-600 hover:text-pink-600 transition-colors">
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="text-gray-600 hover:text-pink-600 transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/faq`} className="text-gray-600 hover:text-pink-600 transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-800 mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/terms`} className="text-gray-600 hover:text-pink-600 transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/privacy`} className="text-gray-600 hover:text-pink-600 transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/cookies`} className="text-gray-600 hover:text-pink-600 transition-colors">
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">
              © {currentYear} Pasiones Red Social. Todos los derechos reservados.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-pink-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-pink-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-pink-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href={`/${locale}/contact`} className="text-gray-600 hover:text-pink-600 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
