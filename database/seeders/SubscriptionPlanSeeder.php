<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SubscriptionPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Básico',
                'slug' => 'basico',
                'description' => 'Plan básico para publicar tu negocio en el directorio.',
                'price' => 9.99,
                'billing_period' => 'monthly',
                'max_products' => 0,
                'has_virtual_store' => false,
                'has_ai_assistant' => false,
                'features' => json_encode([
                    'Publicación del negocio en el directorio',
                    'Logo y foto de portada',
                    'Información de contacto completa',
                    'Ubicación en mapa',
                    'Horarios de atención',
                ]),
                'is_active' => true,
                'order' => 1,
            ],
            [
                'name' => 'Plata',
                'slug' => 'plata',
                'description' => 'Incluye todo lo del plan básico + tienda virtual con hasta 5 productos.',
                'price' => 19.99,
                'billing_period' => 'monthly',
                'max_products' => 5,
                'has_virtual_store' => true,
                'has_ai_assistant' => false,
                'features' => json_encode([
                    'Todo lo del plan Básico',
                    'Tienda virtual integrada',
                    'Hasta 5 productos (físicos o digitales)',
                    'Gestión de inventario',
                    'Imágenes de productos',
                ]),
                'is_active' => true,
                'order' => 2,
            ],
            [
                'name' => 'Oro',
                'slug' => 'oro',
                'description' => 'Incluye todo lo del plan plata + hasta 20 productos.',
                'price' => 39.99,
                'billing_period' => 'monthly',
                'max_products' => 20,
                'has_virtual_store' => true,
                'has_ai_assistant' => false,
                'features' => json_encode([
                    'Todo lo del plan Plata',
                    'Hasta 20 productos',
                    'Productos destacados',
                    'Estadísticas avanzadas',
                    'Soporte prioritario',
                ]),
                'is_active' => true,
                'order' => 3,
            ],
            [
                'name' => 'Diamante',
                'slug' => 'diamante',
                'description' => 'Plan premium con 100 productos + asistente IA para descripciones.',
                'price' => 79.99,
                'billing_period' => 'monthly',
                'max_products' => 100,
                'has_virtual_store' => true,
                'has_ai_assistant' => true,
                'features' => json_encode([
                    'Todo lo del plan Oro',
                    'Hasta 100 productos',
                    'Asistente IA para descripciones de productos',
                    'Asistente IA para descripción del negocio',
                    'Análisis de mercado con IA',
                    'Negocio destacado en portada',
                    'Soporte VIP 24/7',
                ]),
                'is_active' => true,
                'order' => 4,
            ],
        ];

        foreach ($plans as $plan) {
            \App\Models\SubscriptionPlan::create($plan);
        }
    }
}
