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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('slug');
            $table->text('description');
            $table->enum('type', ['physical', 'digital'])->default('physical');

            // Precio
            $table->decimal('price', 10, 2);
            $table->decimal('sale_price', 10, 2)->nullable();
            $table->boolean('on_sale')->default(false);

            // Inventario (solo para productos físicos)
            $table->integer('stock')->default(0);
            $table->boolean('manage_stock')->default(true);
            $table->enum('stock_status', ['in_stock', 'out_of_stock', 'on_backorder'])->default('in_stock');

            // Producto digital
            $table->string('download_file')->nullable(); // Para productos digitales
            $table->integer('download_limit')->nullable();
            $table->integer('download_expiry')->nullable(); // días

            // Características
            $table->string('sku')->nullable();
            $table->decimal('weight', 8, 2)->nullable();
            $table->json('dimensions')->nullable(); // {length, width, height}
            $table->json('attributes')->nullable(); // Color, talla, etc.

            // Estado
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);

            // Estadísticas
            $table->integer('views_count')->default(0);
            $table->integer('sales_count')->default(0);

            $table->timestamps();
            $table->softDeletes();

            $table->unique(['business_id', 'slug']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
