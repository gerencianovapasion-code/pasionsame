<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between items-center">
            <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                Editar Negocio: {{ $business->name }}
            </h2>
            <a href="{{ route('admin.businesses.index') }}" class="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition">
                ← Volver
            </a>
        </div>
    </x-slot>

    <div class="py-12">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg">
                <div class="p-6">
                    <form action="{{ route('admin.businesses.update', $business) }}" method="POST" class="space-y-6">
                        @csrf
                        @method('PUT')

                        <!-- Información Básica -->
                        <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Información Básica</h3>

                            <div class="space-y-6">
                                <div>
                                    <x-input-label for="name" value="Nombre del Negocio *" />
                                    <x-text-input id="name" name="name" type="text" class="mt-1 block w-full" :value="old('name', $business->name)" required />
                                    <x-input-error :messages="$errors->get('name')" class="mt-2" />
                                </div>

                                <div>
                                    <x-input-label for="category_id" value="Categoría *" />
                                    <select id="category_id" name="category_id" required
                                            class="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm">
                                        <option value="">Selecciona una categoría</option>
                                        @foreach($categories as $category)
                                        <option value="{{ $category->id }}" {{ old('category_id', $business->category_id) == $category->id ? 'selected' : '' }}>
                                            {{ $category->icon }} {{ $category->name }}
                                        </option>
                                        @endforeach
                                    </select>
                                    <x-input-error :messages="$errors->get('category_id')" class="mt-2" />
                                </div>

                                <div>
                                    <x-input-label for="description" value="Descripción *" />
                                    <textarea id="description" name="description" rows="4" required
                                              class="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm">{{ old('description', $business->description) }}</textarea>
                                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Mínimo 50 caracteres</p>
                                    <x-input-error :messages="$errors->get('description')" class="mt-2" />
                                </div>
                            </div>
                        </div>

                        <!-- Estado del Negocio (Solo Admin) -->
                        <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Estado y Visibilidad</h3>

                            <div class="space-y-4">
                                <div>
                                    <label class="flex items-center">
                                        <input type="checkbox" name="is_active" value="1" {{ old('is_active', $business->is_active) ? 'checked' : '' }}
                                               class="rounded border-gray-300 dark:border-gray-700 text-indigo-600 shadow-sm focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:focus:ring-offset-gray-800">
                                        <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">Negocio activo y visible para clientes</span>
                                    </label>
                                    <p class="ml-6 mt-1 text-xs text-gray-500 dark:text-gray-400">Marca esto para aprobar y publicar el negocio</p>
                                </div>

                                <div>
                                    <label class="flex items-center">
                                        <input type="checkbox" name="is_featured" value="1" {{ old('is_featured', $business->is_featured) ? 'checked' : '' }}
                                               class="rounded border-gray-300 dark:border-gray-700 text-indigo-600 shadow-sm focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:focus:ring-offset-gray-800">
                                        <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">Destacar en la página principal</span>
                                    </label>
                                    <p class="ml-6 mt-1 text-xs text-gray-500 dark:text-gray-400">Los negocios destacados aparecen en la sección principal</p>
                                </div>
                            </div>
                        </div>

                        <!-- Información del Propietario -->
                        <div class="pb-6 bg-gray-50 dark:bg-gray-900/50 -mx-6 px-6 py-4">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Información del Propietario</h3>
                            <div class="grid md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p class="text-gray-600 dark:text-gray-400">Nombre</p>
                                    <p class="text-gray-900 dark:text-white font-medium">{{ $business->user->name }}</p>
                                </div>
                                <div>
                                    <p class="text-gray-600 dark:text-gray-400">Email</p>
                                    <p class="text-gray-900 dark:text-white font-medium">{{ $business->user->email }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Botones -->
                        <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                            <form action="{{ route('admin.businesses.destroy', $business) }}" method="POST" onsubmit="return confirm('¿Estás seguro de eliminar este negocio? Esta acción no se puede deshacer.');">
                                @csrf
                                @method('DELETE')
                                <x-danger-button type="submit">
                                    Eliminar Negocio
                                </x-danger-button>
                            </form>

                            <div class="flex gap-4">
                                <a href="{{ route('admin.businesses.show', $business) }}" class="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition">
                                    Ver Detalles
                                </a>
                                <x-primary-button>
                                    Actualizar Negocio
                                </x-primary-button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Acciones Rápidas -->
            <div class="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 class="font-semibold text-blue-900 dark:text-blue-200 mb-2">Acciones Rápidas</h4>
                <div class="flex gap-2">
                    @if(!$business->is_active)
                    <form action="{{ route('admin.businesses.approve', $business) }}" method="POST">
                        @csrf
                        <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm">
                            ✓ Aprobar Negocio
                        </button>
                    </form>
                    @else
                    <form action="{{ route('admin.businesses.reject', $business) }}" method="POST">
                        @csrf
                        <button type="submit" class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition text-sm">
                            ✗ Desactivar Negocio
                        </button>
                    </form>
                    @endif
                    <a href="{{ route('business.show', $business->slug) }}" target="_blank" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm">
                        👁️ Ver en Sitio Público
                    </a>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
