<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\User::create([
            'name' => 'Administrador',
            'email' => 'admin@marketplace.local',
            'password' => bcrypt('admin123'),
            'role' => 'admin',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Usuario de prueba Owner
        \App\Models\User::create([
            'name' => 'Dueño de Negocio',
            'email' => 'owner@marketplace.local',
            'password' => bcrypt('owner123'),
            'role' => 'owner',
            'phone' => '+34 600 000 000',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Usuario de prueba Customer
        \App\Models\User::create([
            'name' => 'Cliente',
            'email' => 'customer@marketplace.local',
            'password' => bcrypt('customer123'),
            'role' => 'customer',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
    }
}
