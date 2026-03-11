<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Tabel Sports
        Schema::create('sports', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); 
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 2. Tabel Categories
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name'); 
            $table->timestamps();
        });

        // 3. Tabel Test Items (LANGSUNG STRUKTUR BARU)
        Schema::create('test_items', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('sport_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            
            $table->string('name'); 
            
            // Opsi: reps, points, cm, meter, second, minute, vo2max
            $table->string('parameter_type')->default('points'); 
            
            $table->string('unit')->nullable(); // Label satuan (misal: "Detik", "Kali")
            
            // Nilai Benchmark/Target (Decimal agar bisa koma, misal 10.5 detik)
            $table->decimal('target_value', 10, 2)->default(0); 
            
            $table->timestamps();
        });

        // 4. Update Users (Relasi Sport)
        Schema::table('users', function (Blueprint $table) {
            // Cek dulu agar tidak error jika dijalankan ulang
            if (!Schema::hasColumn('users', 'sport_id')) {
                $table->foreignId('sport_id')->nullable()->after('role')->constrained('sports')->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'sport_id')) {
                $table->dropForeign(['sport_id']);
                $table->dropColumn('sport_id');
            }
        });
        
        Schema::dropIfExists('test_items');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('sports');
    }
};