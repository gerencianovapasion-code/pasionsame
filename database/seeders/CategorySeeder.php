<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Restaurantes', 'slug' => 'restaurantes', 'description' => 'Restaurantes, bares y cafeterías', 'icon' => '🍽️', 'order' => 1],
            ['name' => 'Tiendas', 'slug' => 'tiendas', 'description' => 'Tiendas de ropa, calzado y accesorios', 'icon' => '🛍️', 'order' => 2],
            ['name' => 'Salud y Belleza', 'slug' => 'salud-belleza', 'description' => 'Peluquerías, spas, centros de estética', 'icon' => '💆', 'order' => 3],
            ['name' => 'Servicios Profesionales', 'slug' => 'servicios-profesionales', 'description' => 'Abogados, contadores, consultores', 'icon' => '💼', 'order' => 4],
            ['name' => 'Hogar y Construcción', 'slug' => 'hogar-construccion', 'description' => 'Ferreterías, constructoras, decoración', 'icon' => '🏠', 'order' => 5],
            ['name' => 'Tecnología', 'slug' => 'tecnologia', 'description' => 'Informática, electrónica, reparaciones', 'icon' => '💻', 'order' => 6],
            ['name' => 'Educación', 'slug' => 'educacion', 'description' => 'Academias, institutos, formación', 'icon' => '📚', 'order' => 7],
            ['name' => 'Salud', 'slug' => 'salud', 'description' => 'Clínicas, farmacias, servicios médicos', 'icon' => '⚕️', 'order' => 8],
            ['name' => 'Deportes', 'slug' => 'deportes', 'description' => 'Gimnasios, tiendas deportivas', 'icon' => '⚽', 'order' => 9],
            ['name' => 'Automotriz', 'slug' => 'automotriz', 'description' => 'Talleres, repuestos, lavaderos', 'icon' => '🚗', 'order' => 10],
            ['name' => 'Mascotas', 'slug' => 'mascotas', 'description' => 'Veterinarias, tiendas de mascotas', 'icon' => '🐾', 'order' => 11],
            ['name' => 'Entretenimiento', 'slug' => 'entretenimiento', 'description' => 'Cines, teatros, eventos', 'icon' => '🎭', 'order' => 12],
        ];

        foreach ($categories as $category) {
            \App\Models\Category::create($category);
        }
    }
}
