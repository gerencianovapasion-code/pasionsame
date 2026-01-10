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
        Schema::create('businesses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->string('logo')->nullable();
            $table->string('cover_image')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();
            $table->string('whatsapp')->nullable();
            $table->string('facebook')->nullable();
            $table->string('instagram')->nullable();
            $table->string('twitter')->nullable();

            // Geolocalización
            $table->string('address');
            $table->string('city');
            $table->string('state');
            $table->string('country')->default('España');
            $table->string('postal_code')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();

            // Horarios
            $table->json('business_hours')->nullable(); // {monday: {open: '09:00', close: '18:00'}, ...}

            // Estado
            $table->boolean('is_active')->default(false); // Requiere aprobación admin
            $table->boolean('is_featured')->default(false);
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users');

            // Estadísticas
            $table->integer('views_count')->default(0);
            $table->decimal('rating', 3, 2)->default(0);
            $table->integer('reviews_count')->default(0);

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('businesses');
    }
};
