<x-app-layout>
    <div class="py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Hero Section con Portada -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden mb-8">
                @if($business->cover_image)
                <img src="{{ Storage::url($business->cover_image) }}" alt="{{ $business->name }}" class="w-full h-96 object-cover">
                @else
                <div class="w-full h-96 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                @endif
                
                <div class="p-8">
                    <div class="flex items-start justify-between">
                        <div class="flex items-center">
                            @if($business->logo)
                            <img src="{{ Storage::url($business->logo) }}" alt="{{ $business->name }}" class="w-24 h-24 rounded-full border-4 border-white dark:border-gray-700 -mt-16 mr-6">
                            @endif
                            <div>
                                <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">{{ $business->name }}</h1>
                                <div class="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                        {{ $business->category->name }}
                                    </span>
                                    @if($business->rating > 0)
                                    <div class="flex items-center">
                                        <svg class="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                        </svg>
                                        <span>{{ number_format($business->rating, 1) }}</span>
                                        <span class="ml-1">({{ $business->reviews_count }} reseñas)</span>
                                    </div>
                                    @endif
                                    <span>{{ $business->views_count }} visitas</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid lg:grid-cols-3 gap-8">
                <!-- Columna Principal -->
                <div class="lg:col-span-2 space-y-8">
                    <!-- Descripción -->
                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Acerca de</h2>
                        <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line">{{ $business->description }}</p>
                    </div>

                    <!-- Productos de la Tienda -->
                    @if($business->products->count() > 0)
                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Productos</h2>
                        
                        <div class="grid md:grid-cols-2 gap-6">
                            @foreach($business->products()->active()->limit(6)->get() as $product)
                            <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition">
                                @if($product->primaryImage)
                                <img src="{{ Storage::url($product->primaryImage->image_path) }}" alt="{{ $product->name }}" class="w-full h-48 object-cover">
                                @else
                                <div class="w-full h-48 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                                @endif
                                
                                <div class="p-4">
                                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">{{ $product->name }}</h3>
                                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{{ $product->description }}</p>
                                    
                                    <div class="flex items-center justify-between">
                                        <div>
                                            @if($product->on_sale && $product->sale_price)
                                            <span class="text-sm text-gray-500 line-through mr-2">€{{ number_format($product->price, 2) }}</span>
                                            <span class="text-xl font-bold text-red-600">€{{ number_format($product->sale_price, 2) }}</span>
                                            @else
                                            <span class="text-xl font-bold text-gray-900 dark:text-white">€{{ number_format($product->price, 2) }}</span>
                                            @endif
                                        </div>
                                        
                                        @if($product->stock_status === 'in_stock')
                                        <span class="text-sm text-green-600 dark:text-green-400">En stock</span>
                                        @else
                                        <span class="text-sm text-red-600 dark:text-red-400">Agotado</span>
                                        @endif
                                    </div>
                                </div>
                            </div>
                            @endforeach
                        </div>
                    </div>
                    @endif

                    <!-- Galería de Imágenes -->
                    @if($business->images->count() > 0)
                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Galería</h2>
                        
                        <div class="grid grid-cols-3 gap-4">
                            @foreach($business->images as $image)
                            <img src="{{ Storage::url($image->image_path) }}" alt="{{ $image->title }}" class="w-full h-40 object-cover rounded-lg hover:opacity-75 transition cursor-pointer">
                            @endforeach
                        </div>
                    </div>
                    @endif
                </div>

                <!-- Sidebar de Información -->
                <div class="space-y-6">
                    <!-- Información de Contacto -->
                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Información de Contacto</h3>
                        
                        <div class="space-y-3">
                            @if($business->phone)
                            <div class="flex items-start">
                                <svg class="w-5 h-5 text-gray-400 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                                </svg>
                                <a href="tel:{{ $business->phone }}" class="text-blue-600 hover:underline">{{ $business->phone }}</a>
                            </div>
                            @endif

                            @if($business->email)
                            <div class="flex items-start">
                                <svg class="w-5 h-5 text-gray-400 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                                </svg>
                                <a href="mailto:{{ $business->email }}" class="text-blue-600 hover:underline">{{ $business->email }}</a>
                            </div>
                            @endif

                            @if($business->website)
                            <div class="flex items-start">
                                <svg class="w-5 h-5 text-gray-400 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd"/>
                                </svg>
                                <a href="{{ $business->website }}" target="_blank" class="text-blue-600 hover:underline">Visitar sitio web</a>
                            </div>
                            @endif

                            <div class="flex items-start">
                                <svg class="w-5 h-5 text-gray-400 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                                </svg>
                                <div>
                                    <p class="text-gray-700 dark:text-gray-300">{{ $business->address }}</p>
                                    <p class="text-gray-700 dark:text-gray-300">{{ $business->city }}, {{ $business->state }}</p>
                                    <p class="text-gray-700 dark:text-gray-300">{{ $business->country }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Redes Sociales -->
                    @if($business->facebook || $business->instagram || $business->twitter || $business->whatsapp)
                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Redes Sociales</h3>
                        
                        <div class="flex gap-3">
                            @if($business->whatsapp)
                            <a href="https://wa.me/{{ $business->whatsapp }}" target="_blank" class="p-3 bg-green-500 hover:bg-green-600 text-white rounded-full transition">
                                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            </a>
                            @endif

                            @if($business->facebook)
                            <a href="{{ $business->facebook }}" target="_blank" class="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition">
                                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                            </a>
                            @endif

                            @if($business->instagram)
                            <a href="{{ $business->instagram }}" target="_blank" class="p-3 bg-pink-600 hover:bg-pink-700 text-white rounded-full transition">
                                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                            </a>
                            @endif

                            @if($business->twitter)
                            <a href="{{ $business->twitter }}" target="_blank" class="p-3 bg-sky-500 hover:bg-sky-600 text-white rounded-full transition">
                                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                            </a>
                            @endif
                        </div>
                    </div>
                    @endif

                    <!-- Mapa (Placeholder) -->
                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Ubicación</h3>
                        <div class="bg-gray-300 dark:bg-gray-700 h-64 rounded-lg flex items-center justify-center">
                            <p class="text-gray-600 dark:text-gray-400">Mapa (Google Maps Integration)</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Negocios Relacionados -->
            @if($relatedBusinesses->count() > 0)
            <div class="mt-12">
                <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Negocios Similares</h2>
                
                <div class="grid md:grid-cols-4 gap-6">
                    @foreach($relatedBusinesses as $related)
                    <a href="{{ route('business.show', $related->slug) }}" class="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition">
                        @if($related->cover_image)
                        <img src="{{ Storage::url($related->cover_image) }}" alt="{{ $related->name }}" class="w-full h-40 object-cover rounded-t-lg">
                        @else
                        <div class="w-full h-40 bg-gradient-to-r from-green-500 to-teal-500 rounded-t-lg"></div>
                        @endif
                        
                        <div class="p-4">
                            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">{{ $related->name }}</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400">{{ $related->city }}</p>
                        </div>
                    </a>
                    @endforeach
                </div>
            </div>
            @endif
        </div>
    </div>
</x-app-layout>
