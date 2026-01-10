<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('subscription_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Básico, Plata, Oro, Diamante
            $table->string('slug')->unique(); // basico, plata, oro, diamante
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->enum('billing_period', ['monthly', 'yearly'])->default('monthly');
            $table->integer('max_products')->default(0); // 0 = sin tienda, 5, 20, 100
            $table->boolean('has_virtual_store')->default(false);
            $table->boolean('has_ai_assistant')->default(false);
            $table->json('features')->nullable(); // Características adicionales
            $table->boolean('is_active')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscription_plans');
    }
};
