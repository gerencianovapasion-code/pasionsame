<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Editar Mi Negocio
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg">
                <div class="p-6">
                    <form action="{{ route('owner.business.update', $business) }}" method="POST" class="space-y-6">
                        @csrf
                        @method('PUT')

                        <!-- Información Básica -->
                        <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Información Básica</h3>
                            
                            <div class="grid md:grid-cols-2 gap-6">
                                <div class="md:col-span-2">
                                    <x-input-label for="name" value="Nombre del Negocio *" />
                                    <x-text-input id="name" name="name" type="text" class="mt-1 block w-full" :value="old('name', $business->name)" required />
                                    <x-input-error :messages="$errors->get('name')" class="mt-2" />
                                </div>

                                <div class="md:col-span-2">
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

                                <div class="md:col-span-2">
                                    <x-input-label for="description" value="Descripción *" />
                                    <textarea id="description" name="description" rows="4" required
                                              class="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm">{{ old('description', $business->description) }}</textarea>
                                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Mínimo 50 caracteres</p>
                                    <x-input-error :messages="$errors->get('description')" class="mt-2" />
                                </div>
                            </div>
                        </div>

                        <!-- Información de Contacto -->
                        <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Información de Contacto</h3>
                            
                            <div class="grid md:grid-cols-2 gap-6">
                                <div>
                                    <x-input-label for="phone" value="Teléfono" />
                                    <x-text-input id="phone" name="phone" type="text" class="mt-1 block w-full" :value="old('phone', $business->phone)" />
                                    <x-input-error :messages="$errors->get('phone')" class="mt-2" />
                                </div>

                                <div>
                                    <x-input-label for="whatsapp" value="WhatsApp" />
                                    <x-text-input id="whatsapp" name="whatsapp" type="text" class="mt-1 block w-full" :value="old('whatsapp', $business->whatsapp)" />
                                    <x-input-error :messages="$errors->get('whatsapp')" class="mt-2" />
                                </div>

                                <div>
                                    <x-input-label for="email" value="Email" />
                                    <x-text-input id="email" name="email" type="email" class="mt-1 block w-full" :value="old('email', $business->email)" />
                                    <x-input-error :messages="$errors->get('email')" class="mt-2" />
                                </div>

                                <div>
                                    <x-input-label for="website" value="Sitio Web" />
                                    <x-text-input id="website" name="website" type="url" class="mt-1 block w-full" :value="old('website', $business->website)" />
                                    <x-input-error :messages="$errors->get('website')" class="mt-2" />
                                </div>
                            </div>
                        </div>

                        <!-- Redes Sociales -->
                        <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Redes Sociales</h3>
                            
                            <div class="grid md:grid-cols-2 gap-6">
                                <div>
                                    <x-input-label for="facebook" value="Facebook" />
                                    <x-text-input id="facebook" name="facebook" type="url" class="mt-1 block w-full" :value="old('facebook', $business->facebook)" />
                                    <x-input-error :messages="$errors->get('facebook')" class="mt-2" />
                                </div>

                                <div>
                                    <x-input-label for="instagram" value="Instagram" />
                                    <x-text-input id="instagram" name="instagram" type="url" class="mt-1 block w-full" :value="old('instagram', $business->instagram)" />
                                    <x-input-error :messages="$errors->get('instagram')" class="mt-2" />
                                </div>

                                <div>
                                    <x-input-label for="twitter" value="Twitter/X" />
                                    <x-text-input id="twitter" name="twitter" type="url" class="mt-1 block w-full" :value="old('twitter', $business->twitter)" />
                                    <x-input-error :messages="$errors->get('twitter')" class="mt-2" />
                                </div>
                            </div>
                        </div>

                        <!-- Ubicación -->
                        <div class="pb-6">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ubicación</h3>
                            
                            <div class="grid md:grid-cols-2 gap-6">
                                <div class="md:col-span-2">
                                    <x-input-label for="address" value="Dirección *" />
                                    <x-text-input id="address" name="address" type="text" class="mt-1 block w-full" :value="old('address', $business->address)" required />
                                    <x-input-error :messages="$errors->get('address')" class="mt-2" />
                                </div>

                                <div>
                                    <x-input-label for="city" value="Ciudad *" />
                                    <x-text-input id="city" name="city" type="text" class="mt-1 block w-full" :value="old('city', $business->city)" required />
                                    <x-input-error :messages="$errors->get('city')" class="mt-2" />
                                </div>

                                <div>
                                    <x-input-label for="state" value="Provincia/Estado *" />
                                    <x-text-input id="state" name="state" type="text" class="mt-1 block w-full" :value="old('state', $business->state)" required />
                                    <x-input-error :messages="$errors->get('state')" class="mt-2" />
                                </div>

                                <div>
                                    <x-input-label for="country" value="País *" />
                                    <x-text-input id="country" name="country" type="text" class="mt-1 block w-full" :value="old('country', $business->country)" required />
                                    <x-input-error :messages="$errors->get('country')" class="mt-2" />
                                </div>

                                <div>
                                    <x-input-label for="postal_code" value="Código Postal" />
                                    <x-text-input id="postal_code" name="postal_code" type="text" class="mt-1 block w-full" :value="old('postal_code', $business->postal_code)" />
                                    <x-input-error :messages="$errors->get('postal_code')" class="mt-2" />
                                </div>

                                <div>
                                    <x-input-label for="latitude" value="Latitud" />
                                    <x-text-input id="latitude" name="latitude" type="text" class="mt-1 block w-full" :value="old('latitude', $business->latitude)" />
                                    <x-input-error :messages="$errors->get('latitude')" class="mt-2" />
                                </div>

                                <div>
                                    <x-input-label for="longitude" value="Longitud" />
                                    <x-text-input id="longitude" name="longitude" type="text" class="mt-1 block w-full" :value="old('longitude', $business->longitude)" />
                                    <x-input-error :messages="$errors->get('longitude')" class="mt-2" />
                                </div>
                            </div>
                        </div>

                        <!-- Botones -->
                        <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                            <form action="{{ route('owner.business.destroy', $business) }}" method="POST" onsubmit="return confirm('¿Estás seguro de eliminar tu negocio? Esta acción no se puede deshacer.');">
                                @csrf
                                @method('DELETE')
                                <x-danger-button type="submit">
                                    Eliminar Negocio
                                </x-danger-button>
                            </form>

                            <div class="flex gap-4">
                                <a href="{{ route('owner.dashboard') }}" class="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition">
                                    Cancelar
                                </a>
                                <x-primary-button>
                                    Actualizar Negocio
                                </x-primary-button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
