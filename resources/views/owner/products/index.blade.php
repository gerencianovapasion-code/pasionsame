<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between items-center">
            <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                Mis Productos
            </h2>
            @if($products->count() < $plan->max_products)
            <a href="{{ route('owner.products.create') }}" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                + Agregar Producto
            </a>
            @endif
        </div>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Plan Info -->
            <div class="mb-6 p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg">
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="text-lg font-semibold">Plan {{ $plan->name }}</h3>
                        <p class="text-sm opacity-90">{{ $products->total() }} de {{ $plan->max_products }} productos utilizados</p>
                    </div>
                    <div class="text-right">
                        @if($products->total() >= $plan->max_products)
                        <span class="px-3 py-1 bg-yellow-500 text-white rounded-full text-sm font-medium">
                            Límite Alcanzado
                        </span>
                        @else
                        <span class="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium">
                            {{ $plan->max_products - $products->total() }} disponibles
                        </span>
                        @endif
                    </div>
                </div>
                <div class="mt-2 bg-white bg-opacity-20 rounded-full h-2">
                    <div class="bg-white h-2 rounded-full" style="width: {{ ($products->total() / $plan->max_products) * 100 }}%"></div>
                </div>
            </div>

            @if($products->total() >= $plan->max_products)
            <div class="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p class="text-sm text-yellow-800 dark:text-yellow-200">
                    ⚠️ Has alcanzado el límite de productos de tu plan.
                    <a href="{{ route('owner.subscriptions.index') }}" class="font-semibold underline hover:no-underline">
                        Actualiza tu suscripción
                    </a> para agregar más productos.
                </p>
            </div>
            @endif

            @if($products->isEmpty())
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg p-12 text-center">
                <div class="text-gray-400 text-6xl mb-4">📦</div>
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No tienes productos</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-6">Comienza agregando tu primer producto a tu tienda virtual.</p>
                @if($products->count() < $plan->max_products)
                <a href="{{ route('owner.products.create') }}" class="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                    Crear Primer Producto
                </a>
                @endif
            </div>
            @else
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead class="bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Producto
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Tipo
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Precio
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            @foreach($products as $product)
                            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div class="h-10 w-10 flex-shrink-0 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                                            @if($product->type === 'physical')
                                            📦
                                            @else
                                            💾
                                            @endif
                                        </div>
                                        <div class="ml-4">
                                            <div class="text-sm font-medium text-gray-900 dark:text-white">
                                                {{ $product->name }}
                                            </div>
                                            @if($product->sku)
                                            <div class="text-xs text-gray-500 dark:text-gray-400">
                                                SKU: {{ $product->sku }}
                                            </div>
                                            @endif
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    @if($product->type === 'physical')
                                    <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                        Físico
                                    </span>
                                    @else
                                    <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                        Digital
                                    </span>
                                    @endif
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-900 dark:text-white">
                                        @if($product->on_sale && $product->sale_price)
                                        <span class="line-through text-gray-400">€{{ number_format($product->price, 2) }}</span>
                                        <span class="ml-2 text-red-600 font-semibold">€{{ number_format($product->sale_price, 2) }}</span>
                                        @else
                                        €{{ number_format($product->price, 2) }}
                                        @endif
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    @if($product->manage_stock)
                                    <div class="text-sm text-gray-900 dark:text-white">
                                        {{ $product->stock ?? 0 }} unidades
                                    </div>
                                    @else
                                    <span class="text-xs text-gray-500 dark:text-gray-400">Sin gestión</span>
                                    @endif
                                    <div class="text-xs">
                                        @if($product->stock_status === 'in_stock')
                                        <span class="text-green-600 dark:text-green-400">En stock</span>
                                        @elseif($product->stock_status === 'out_of_stock')
                                        <span class="text-red-600 dark:text-red-400">Agotado</span>
                                        @else
                                        <span class="text-yellow-600 dark:text-yellow-400">En reserva</span>
                                        @endif
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    @if($product->is_active)
                                    <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                        Activo
                                    </span>
                                    @else
                                    <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                        Inactivo
                                    </span>
                                    @endif
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div class="flex gap-2">
                                        <a href="{{ route('owner.products.edit', $product) }}" class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                                            Editar
                                        </a>
                                        <form action="{{ route('owner.products.destroy', $product) }}" method="POST" class="inline" onsubmit="return confirm('¿Estás seguro de eliminar este producto?');">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                                Eliminar
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>

                @if($products->hasPages())
                <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                    {{ $products->links() }}
                </div>
                @endif
            </div>
            @endif
        </div>
    </div>
</x-app-layout>
