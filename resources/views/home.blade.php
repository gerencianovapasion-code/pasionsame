<x-app-layout>
    <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <h1 class="text-4xl md:text-6xl font-bold mb-6">Descubre Negocios Locales</h1>
                <p class="text-xl md:text-2xl mb-8">Encuentra los mejores negocios cerca de ti</p>
                
                <!-- Barra de búsqueda -->
                <form action="{{ route('home') }}" method="GET" class="max-w-4xl mx-auto">
                    <div class="flex flex-col md:flex-row gap-4">
                        <input type="text" name="search" placeholder="¿Qué estás buscando?" 
                               value="{{ request('search') }}"
                               class="flex-1 px-6 py-4 rounded-lg text-gray-900 text-lg">
                        
                        <input type="text" name="city" placeholder="Ciudad" 
                               value="{{ request('city') }}"
                               class="md:w-48 px-6 py-4 rounded-lg text-gray-900 text-lg">
                        
                        <button type="submit" class="px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg text-lg transition">
                            Buscar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Categorías -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Explora por Categoría</h2>
        
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            @foreach($categories as $category)
            <a href="{{ route('home', ['category' => $category->id]) }}" 
               class="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition">
                <span class="text-4xl mb-2">{{ $category->icon }}</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white text-center">{{ $category->name }}</span>
            </a>
            @endforeach
        </div>
    </div>

    <!-- Negocios Destacados -->
    @if($featuredBusinesses->count() > 0)
    <div class="bg-gray-100 dark:bg-gray-900 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Negocios Destacados</h2>
            
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                @foreach($featuredBusinesses as $business)
                <a href="{{ route('business.show', $business->slug) }}" 
                   class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                    @if($business->cover_image)
                    <img src="{{ Storage::url($business->cover_image) }}" alt="{{ $business->name }}" class="w-full h-48 object-cover">
                    @else
                    <div class="w-full h-48 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    @endif
                    
                    <div class="p-6">
                        <div class="flex items-center mb-2">
                            @if($business->logo)
                            <img src="{{ Storage::url($business->logo) }}" alt="{{ $business->name }}" class="w-12 h-12 rounded-full mr-3">
                            @endif
                            <div>
                                <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ $business->name }}</h3>
                                <p class="text-sm text-gray-600 dark:text-gray-400">{{ $business->category->name }}</p>
                            </div>
                        </div>
                        <p class="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">{{ Str::limit($business->description, 100) }}</p>
                        <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                            </svg>
                            {{ $business->city }}, {{ $business->state }}
                        </div>
                    </div>
                </a>
                @endforeach
            </div>
        </div>
    </div>
    @endif

    <!-- Todos los Negocios -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            @if(request('search'))
                Resultados para "{{ request('search') }}"
            @else
                Todos los Negocios
            @endif
        </h2>
        
        @if($businesses->count() > 0)
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            @foreach($businesses as $business)
            <a href="{{ route('business.show', $business->slug) }}" 
               class="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                @if($business->cover_image)
                <img src="{{ Storage::url($business->cover_image) }}" alt="{{ $business->name }}" class="w-full h-40 object-cover">
                @else
                <div class="w-full h-40 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                @endif
                
                <div class="p-5">
                    <div class="flex items-center mb-2">
                        @if($business->logo)
                        <img src="{{ Storage::url($business->logo) }}" alt="{{ $business->name }}" class="w-10 h-10 rounded-full mr-2">
                        @endif
                        <div class="flex-1">
                            <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ $business->name }}</h3>
                            <p class="text-xs text-gray-600 dark:text-gray-400">{{ $business->category->name }}</p>
                        </div>
                    </div>
                    <p class="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">{{ Str::limit($business->description, 80) }}</p>
                    <div class="flex items-center text-xs text-gray-600 dark:text-gray-400">
                        <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                        </svg>
                        {{ $business->city }}
                    </div>
                </div>
            </a>
            @endforeach
        </div>

        <!-- Paginación -->
        <div class="mt-8">
            {{ $businesses->links() }}
        </div>
        @else
        <div class="text-center py-12">
            <p class="text-xl text-gray-600 dark:text-gray-400">No se encontraron negocios.</p>
        </div>
        @endif
    </div>
</x-app-layout>
