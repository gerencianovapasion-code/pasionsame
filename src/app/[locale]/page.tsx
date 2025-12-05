import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ModelGrid } from '@/components/models/ModelGrid';
import { SearchBar } from '@/components/search/SearchBar';
import { CategoryTabs } from '@/components/categories/CategoryTabs';
import { CountrySelector } from '@/components/countries/CountrySelector';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-pink-50 to-rose-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center py-12 mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            Descubre Creadores Increíbles
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Conecta con creadores de contenido exclusivo de todo el mundo
          </p>

          {/* Barra de búsqueda principal */}
          <div className="max-w-4xl mx-auto mb-6">
            <SearchBar />
          </div>

          {/* Selector de país y categorías */}
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <CountrySelector />
            <CategoryTabs />
          </div>
        </section>

        {/* Grid de Modelos */}
        <section>
          <ModelGrid section="most-active" />
        </section>

        {/* Secciones adicionales */}
        <section className="mt-12">
          <h2 className="text-3xl font-bold mb-6">En Línea Ahora</h2>
          <ModelGrid section="online" />
        </section>

        <section className="mt-12">
          <h2 className="text-3xl font-bold mb-6">Últimas Publicaciones</h2>
          <ModelGrid section="latest-posts" />
        </section>

        <section className="mt-12">
          <h2 className="text-3xl font-bold mb-6">Mejor Valorados</h2>
          <ModelGrid section="top-rated" />
        </section>

        <section className="mt-12">
          <h2 className="text-3xl font-bold mb-6">Nuevos Miembros</h2>
          <ModelGrid section="new-members" />
        </section>
      </main>

      <Footer />
    </div>
  );
}
