<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Mi Negocio - Dashboard
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Información del Negocio y Suscripción -->
            <div class="grid lg:grid-cols-3 gap-6 mb-8">
                <!-- Card del Negocio -->
                <div class="lg:col-span-2 bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg">
                    <div class="p-6">
                        <div class="flex items-start justify-between">
                            <div class="flex items-center">
                                @if($business->logo)
                                <img src="{{ Storage::url($business->logo) }}" alt="{{ $business->name }}" class="w-20 h-20 rounded-full mr-4">
                                @else
                                <div class="w-20 h-20 rounded-full bg-gray-300 dark:bg-gray-600 mr-4"></div>
                                @endif
                                <div>
                                    <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ $business->name }}</h3>
                                    <p class="text-gray-600 dark:text-gray-400">{{ $business->category->name }}</p>
                                    <div class="flex items-center mt-2">
                                        @if($business->is_active)
                                        <span class="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Activo</span>
                                        @else
                                        <span class="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pendiente de Aprobación</span>
                                        @endif
                                    </div>
                                </div>
                            </div>
                            <a href="{{ route('owner.business.edit', $business) }}" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                                Editar
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Card de Suscripción -->
                <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg">
                    <div class="p-6">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Plan Actual</h3>
                        @if($subscription)
                        <div class="mb-4">
                            <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ $subscription->subscriptionPlan->name }}</p>
                            <p class="text-sm text-gray-600 dark:text-gray-400">€{{ number_format($subscription->subscriptionPlan->price, 2) }}/mes</p>
                        </div>
                        <div class="space-y-2 text-sm">
                            @if($subscription->subscriptionPlan->has_virtual_store)
                            <p class="text-gray-700 dark:text-gray-300">✓ Tienda Virtual</p>
                            <p class="text-gray-700 dark:text-gray-300">✓ Hasta {{ $subscription->subscriptionPlan->max_products }} productos</p>
                            @endif
                            @if($subscription->subscriptionPlan->has_ai_assistant)
                            <p class="text-gray-700 dark:text-gray-300">✓ Asistente IA</p>
                            @endif
                            <p class="text-gray-600 dark:text-gray-400 mt-3">Renovación: {{ $subscription->ends_at->format('d/m/Y') }}</p>
                        </div>
                        @else
                        <p class="text-gray-600 dark:text-gray-400 mb-4">No tienes una suscripción activa</p>
                        <a href="{{ route('plans') }}" class="block w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center transition">
                            Ver Planes
                        </a>
                        @endif
                    </div>
                </div>
            </div>

            <!-- Estadísticas -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Vistas Totales</p>
                            <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ $stats['total_views'] }}</p>
                        </div>
                        <svg class="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Productos</p>
                            <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ $stats['total_products'] }}</p>
                        </div>
                        <svg class="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                        </svg>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Productos Activos</p>
                            <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ $stats['active_products'] }}</p>
                        </div>
                        <svg class="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Calificación</p>
                            <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ number_format($stats['rating'], 1) }}</p>
                        </div>
                        <svg class="w-12 h-12 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                    </div>
                </div>
            </div>

            <div class="grid lg:grid-cols-2 gap-8">
                <!-- Acciones Rápidas -->
                <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg">
                    <div class="p-6">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Acciones Rápidas</h3>
                        
                        <div class="space-y-3">
                            <a href="{{ route('owner.business.edit', $business) }}" class="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                                <svg class="w-6 h-6 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                </svg>
                                <div>
                                    <p class="font-medium text-gray-900 dark:text-white">Editar Negocio</p>
                                    <p class="text-sm text-gray-600 dark:text-gray-400">Actualiza tu información</p>
                                </div>
                            </a>

                            @if($subscription && $subscription->subscriptionPlan->has_virtual_store)
                            <a href="{{ route('owner.products.create') }}" class="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                                <svg class="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                </svg>
                                <div>
                                    <p class="font-medium text-gray-900 dark:text-white">Agregar Producto</p>
                                    <p class="text-sm text-gray-600 dark:text-gray-400">Añade productos a tu tienda</p>
                                </div>
                            </a>

                            <a href="{{ route('owner.products.index') }}" class="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                                <svg class="w-6 h-6 text-purple-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                                </svg>
                                <div>
                                    <p class="font-medium text-gray-900 dark:text-white">Gestionar Productos</p>
                                    <p class="text-sm text-gray-600 dark:text-gray-400">Ver y editar tus productos</p>
                                </div>
                            </a>
                            @endif

                            <a href="{{ route('business.show', $business->slug) }}" target="_blank" class="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                                <svg class="w-6 h-6 text-orange-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                                </svg>
                                <div>
                                    <p class="font-medium text-gray-900 dark:text-white">Ver Página Pública</p>
                                    <p class="text-sm text-gray-600 dark:text-gray-400">Cómo ven los clientes tu negocio</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Productos Recientes -->
                <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg">
                    <div class="p-6">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Productos Recientes</h3>
                            @if($subscription && $subscription->subscriptionPlan->has_virtual_store)
                            <a href="{{ route('owner.products.index') }}" class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">Ver todos</a>
                            @endif
                        </div>
                        
                        @if($recentProducts->count() > 0)
                        <div class="space-y-3">
                            @foreach($recentProducts as $product)
                            <div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
                                <div class="flex items-center">
                                    @if($product->primaryImage)
                                    <img src="{{ Storage::url($product->primaryImage->image_path) }}" class="w-12 h-12 rounded object-cover mr-3" alt="{{ $product->name }}">
                                    @else
                                    <div class="w-12 h-12 rounded bg-gray-300 dark:bg-gray-600 mr-3"></div>
                                    @endif
                                    <div>
                                        <p class="text-sm font-medium text-gray-900 dark:text-white">{{ $product->name }}</p>
                                        <p class="text-xs text-gray-600 dark:text-gray-400">€{{ number_format($product->price, 2) }}</p>
                                    </div>
                                </div>
                                <div>
                                    @if($product->is_active)
                                    <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Activo</span>
                                    @else
                                    <span class="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">Inactivo</span>
                                    @endif
                                </div>
                            </div>
                            @endforeach
                        </div>
                        @else
                        <p class="text-gray-600 dark:text-gray-400">No tienes productos aún.</p>
                        @if($subscription && $subscription->subscriptionPlan->has_virtual_store)
                        <a href="{{ route('owner.products.create') }}" class="mt-4 block w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center transition">
                            Agregar Primer Producto
                        </a>
                        @endif
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
