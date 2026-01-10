<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Crear Nuevo Producto
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Plan Info -->
            <div class="mb-6 p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg">
                <p class="text-sm">
                    Plan {{ $plan->name }}: Usando {{ $business->products()->count() }} de {{ $plan->max_products }} productos
                </p>
            </div>

            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg">
                <div class="p-6">
                    <form action="{{ route('owner.products.store') }}" method="POST" class="space-y-6">
                        @csrf

                        <!-- Información Básica -->
                        <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Información Básica</h3>

                            <div class="space-y-6">
                                <div>
                                    <x-input-label for="name" value="Nombre del Producto *" />
                                    <x-text-input id="name" name="name" type="text" class="mt-1 block w-full" :value="old('name')" required />
                                    <x-input-error :messages="$errors->get('name')" class="mt-2" />
                                </div>

                                <div>
                                    <x-input-label for="description" value="Descripción *" />
                                    <textarea id="description" name="description" rows="4" required
                                              class="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm">{{ old('description') }}</textarea>
                                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Mínimo 20 caracteres</p>
                                    <x-input-error :messages="$errors->get('description')" class="mt-2" />
                                </div>

                                <div>
                                    <x-input-label for="type" value="Tipo de Producto *" />
                                    <select id="type" name="type" required
                                            class="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm">
                                        <option value="">Selecciona un tipo</option>
                                        <option value="physical" {{ old('type') === 'physical' ? 'selected' : '' }}>📦 Producto Físico</option>
                                        <option value="digital" {{ old('type') === 'digital' ? 'selected' : '' }}>💾 Producto Digital</option>
                                    </select>
                                    <x-input-error :messages="$errors->get('type')" class="mt-2" />
                                </div>

                                <div>
                                    <x-input-label for="sku" value="SKU" />
                                    <x-text-input id="sku" name="sku" type="text" class="mt-1 block w-full" :value="old('sku')" placeholder="Opcional" />
                                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Código único de producto (opcional)</p>
                                    <x-input-error :messages="$errors->get('sku')" class="mt-2" />
                                </div>
                            </div>
                        </div>

                        <!-- Precios -->
                        <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Precios</h3>

                            <div class="grid md:grid-cols-2 gap-6">
                                <div>
                                    <x-input-label for="price" value="Precio Regular *" />
                                    <div class="mt-1 relative rounded-md shadow-sm">
                                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span class="text-gray-500 dark:text-gray-400 sm:text-sm">€</span>
                                        </div>
                                        <input type="number" step="0.01" min="0" id="price" name="price" value="{{ old('price') }}" required
                                               class="pl-7 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm" />
                                    </div>
                                    <x-input-error :messages="$errors->get('price')" class="mt-2" />
                                </div>

                                <div>
                                    <x-input-label for="sale_price" value="Precio de Oferta" />
                                    <div class="mt-1 relative rounded-md shadow-sm">
                                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span class="text-gray-500 dark:text-gray-400 sm:text-sm">€</span>
                                        </div>
                                        <input type="number" step="0.01" min="0" id="sale_price" name="sale_price" value="{{ old('sale_price') }}"
                                               class="pl-7 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm" />
                                    </div>
                                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Debe ser menor que el precio regular</p>
                                    <x-input-error :messages="$errors->get('sale_price')" class="mt-2" />
                                </div>

                                <div class="md:col-span-2">
                                    <label class="flex items-center">
                                        <input type="checkbox" name="on_sale" value="1" {{ old('on_sale') ? 'checked' : '' }}
                                               class="rounded border-gray-300 dark:border-gray-700 text-indigo-600 shadow-sm focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:focus:ring-offset-gray-800">
                                        <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">Marcar como en oferta</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- Inventario -->
                        <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Inventario</h3>

                            <div class="space-y-6">
                                <div>
                                    <label class="flex items-center">
                                        <input type="checkbox" name="manage_stock" value="1" {{ old('manage_stock') ? 'checked' : '' }}
                                               class="rounded border-gray-300 dark:border-gray-700 text-indigo-600 shadow-sm focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:focus:ring-offset-gray-800"
                                               onchange="document.getElementById('stock').disabled = !this.checked">
                                        <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">Gestionar inventario de stock</span>
                                    </label>
                                </div>

                                <div>
                                    <x-input-label for="stock" value="Cantidad en Stock" />
                                    <x-text-input id="stock" name="stock" type="number" min="0" class="mt-1 block w-full" :value="old('stock', 0)" disabled />
                                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Solo si gestionas el inventario</p>
                                    <x-input-error :messages="$errors->get('stock')" class="mt-2" />
                                </div>

                                <div>
                                    <x-input-label for="stock_status" value="Estado de Stock *" />
                                    <select id="stock_status" name="stock_status" required
                                            class="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm">
                                        <option value="in_stock" {{ old('stock_status', 'in_stock') === 'in_stock' ? 'selected' : '' }}>En Stock</option>
                                        <option value="out_of_stock" {{ old('stock_status') === 'out_of_stock' ? 'selected' : '' }}>Agotado</option>
                                        <option value="on_backorder" {{ old('stock_status') === 'on_backorder' ? 'selected' : '' }}>En Reserva</option>
                                    </select>
                                    <x-input-error :messages="$errors->get('stock_status')" class="mt-2" />
                                </div>
                            </div>
                        </div>

                        <!-- Características Físicas -->
                        <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Características Físicas</h3>

                            <div>
                                <x-input-label for="weight" value="Peso (kg)" />
                                <x-text-input id="weight" name="weight" type="number" step="0.01" min="0" class="mt-1 block w-full" :value="old('weight')" placeholder="0.00" />
                                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Para cálculo de envíos (opcional)</p>
                                <x-input-error :messages="$errors->get('weight')" class="mt-2" />
                            </div>
                        </div>

                        <!-- Estado de Publicación -->
                        <div class="pb-6">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Publicación</h3>

                            <div>
                                <label class="flex items-center">
                                    <input type="checkbox" name="is_active" value="1" {{ old('is_active', true) ? 'checked' : '' }}
                                           class="rounded border-gray-300 dark:border-gray-700 text-indigo-600 shadow-sm focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:focus:ring-offset-gray-800">
                                    <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">Publicar producto (visible para clientes)</span>
                                </label>
                            </div>
                        </div>

                        <!-- Botones -->
                        <div class="flex items-center justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <a href="{{ route('owner.products.index') }}" class="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition">
                                Cancelar
                            </a>
                            <x-primary-button>
                                Crear Producto
                            </x-primary-button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Enable/disable stock input based on manage_stock checkbox
        document.addEventListener('DOMContentLoaded', function() {
            const manageStockCheckbox = document.querySelector('input[name="manage_stock"]');
            const stockInput = document.getElementById('stock');

            if (manageStockCheckbox && stockInput) {
                stockInput.disabled = !manageStockCheckbox.checked;
            }
        });
    </script>
</x-app-layout>
