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
        Schema::create('benchmarks', function (Blueprint $table) {
            $table->id();
            // Relasi: Benchmark milik Sport apa?
            $table->foreignId('sport_id')->constrained()->cascadeOnDelete();
            
            // Relasi: Benchmark untuk Kategori apa?
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            
            // Nilai Target (0-100)
            $table->integer('value')->default(0); 
            
            $table->timestamps();

            // Mencegah duplikasi: 1 Sport hanya punya 1 nilai untuk 1 Kategori
            $table->unique(['sport_id', 'category_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('benchmarks');
    }
};
