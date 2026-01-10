<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between items-center">
            <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                Detalles del Negocio
            </h2>
            <a href="{{ route('admin.businesses.index') }}" class="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition">
                ← Volver
            </a>
        </div>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <!-- Estado y Acciones -->
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg p-6">
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ $business->name }}</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Categoría: {{ $business->category->icon }} {{ $business->category->name }}
                        </p>
                    </div>
                    <div class="flex gap-2">
                        @if(!$business->is_active)
                        <form action="{{ route('admin.businesses.approve', $business) }}" method="POST">
                            @csrf
                            <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                                ✓ Aprobar Negocio
                            </button>
                        </form>
                        @else
                        <form action="{{ route('admin.businesses.reject', $business) }}" method="POST">
                            @csrf
                            <button type="submit" class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition">
                                ✗ Desactivar
                            </button>
                        </form>
                        @endif
                        <a href="{{ route('admin.businesses.edit', $business) }}" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                            Editar
                        </a>
                    </div>
                </div>

                <div class="mt-4 flex gap-2">
                    @if($business->is_active)
                    <span class="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm font-medium">
                        Activo
                    </span>
                    @else
                    <span class="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full text-sm font-medium">
                        Pendiente de Aprobación
                    </span>
                    @endif
                    @if($business->is_featured)
                    <span class="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full text-sm font-medium">
                        Destacado
                    </span>
                    @endif
                </div>
            </div>

            <!-- Información del Propietario -->
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg p-6">
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Propietario</h4>
                <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Nombre</p>
                        <p class="text-gray-900 dark:text-white font-medium">{{ $business->user->name }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Email</p>
                        <p class="text-gray-900 dark:text-white font-medium">{{ $business->user->email }}</p>
                    </div>
                    @if($business->user->phone)
                    <div>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Teléfono</p>
                        <p class="text-gray-900 dark:text-white font-medium">{{ $business->user->phone }}</p>
                    </div>
                    @endif
                </div>
            </div>

            <!-- Información del Negocio -->
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg p-6">
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Información del Negocio</h4>
                <div class="space-y-4">
                    <div>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Descripción</p>
                        <p class="text-gray-900 dark:text-white">{{ $business->description }}</p>
                    </div>
                    <div class="grid md:grid-cols-2 gap-4">
                        <div>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Dirección</p>
                            <p class="text-gray-900 dark:text-white">{{ $business->address }}</p>
                            <p class="text-gray-900 dark:text-white">{{ $business->city }}, {{ $business->state }}</p>
                            <p class="text-gray-900 dark:text-white">{{ $business->country }} {{ $business->postal_code }}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Contacto</p>
                            @if($business->phone)
                            <p class="text-gray-900 dark:text-white">📞 {{ $business->phone }}</p>
                            @endif
                            @if($business->email)
                            <p class="text-gray-900 dark:text-white">✉️ {{ $business->email }}</p>
                            @endif
                            @if($business->website)
                            <p class="text-gray-900 dark:text-white">🌐 <a href="{{ $business->website }}" target="_blank" class="text-indigo-600 hover:underline">{{ $business->website }}</a></p>
                            @endif
                        </div>
                    </div>
                </div>
            </div>

            <!-- Estadísticas -->
            <div class="grid md:grid-cols-4 gap-4">
                <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg p-6">
                    <p class="text-sm text-gray-600 dark:text-gray-400">Vistas</p>
                    <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ $business->views }}</p>
                </div>
                <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg p-6">
                    <p class="text-sm text-gray-600 dark:text-gray-400">Productos</p>
                    <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ $business->products->count() }}</p>
                </div>
                <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg p-6">
                    <p class="text-sm text-gray-600 dark:text-gray-400">Suscripciones</p>
                    <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ $business->subscriptions->count() }}</p>
                </div>
                <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg p-6">
                    <p class="text-sm text-gray-600 dark:text-gray-400">Valoración</p>
                    <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ number_format($business->rating, 1) }} ⭐</p>
                </div>
            </div>

            <!-- Productos -->
            @if($business->products->isNotEmpty())
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg p-6">
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Productos ({{ $business->products->count() }})</h4>
                <div class="grid md:grid-cols-3 gap-4">
                    @foreach($business->products->take(6) as $product)
                    <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <h5 class="font-medium text-gray-900 dark:text-white">{{ $product->name }}</h5>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">€{{ number_format($product->price, 2) }}</p>
                        <span class="inline-block mt-2 px-2 py-1 text-xs rounded-full {{ $product->is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800' }}">
                            {{ $product->is_active ? 'Activo' : 'Inactivo' }}
                        </span>
                    </div>
                    @endforeach
                </div>
            </div>
            @endif

            <!-- Suscripciones -->
            @if($business->subscriptions->isNotEmpty())
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg p-6">
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Historial de Suscripciones</h4>
                <div class="space-y-2">
                    @foreach($business->subscriptions->take(5) as $subscription)
                    <div class="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2">
                        <div>
                            <p class="font-medium text-gray-900 dark:text-white">{{ $subscription->subscriptionPlan->name }}</p>
                            <p class="text-sm text-gray-600 dark:text-gray-400">{{ $subscription->start_date }} - {{ $subscription->end_date }}</p>
                        </div>
                        <span class="px-2 py-1 text-xs rounded-full {{ $subscription->status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800' }}">
                            {{ ucfirst($subscription->status) }}
                        </span>
                    </div>
                    @endforeach
                </div>
            </div>
            @endif

            <!-- Información de Aprobación -->
            @if($business->is_active && $business->approved_at)
            <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p class="text-sm text-green-800 dark:text-green-200">
                    ✓ Negocio aprobado el {{ $business->approved_at->format('d/m/Y H:i') }}
                </p>
            </div>
            @endif
        </div>
    </div>
</x-app-layout>
