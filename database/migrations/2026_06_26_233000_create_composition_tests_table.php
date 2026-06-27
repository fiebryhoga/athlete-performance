<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('composition_tests');
        
        Schema::create('composition_tests', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            
            $table->date('date');
            $table->integer('age');
            $table->integer('metabolic_age')->nullable();
            
            // Dimensi Dasar
            $table->decimal('weight', 5, 2)->comment('KG');
            $table->decimal('height', 5, 2)->comment('Meter');
            $table->decimal('bmi', 5, 2)->nullable();
            
            // Komponen Utama (Dalam Persentase & Absolut)
            $table->decimal('body_fat_percentage', 5, 2)->nullable()->comment('%');
            $table->decimal('fat_free_mass', 5, 2)->nullable()->comment('KG');
            $table->decimal('muscle_mass', 5, 2)->nullable()->comment('KG');
            $table->decimal('skeletal_muscle_mass', 5, 2)->nullable()->comment('KG');
            $table->decimal('bone_mass', 5, 2)->nullable()->comment('KG');
            
            // Anatomi Lemak Spesifik
            $table->decimal('essential_fat_mass', 5, 2)->nullable()->comment('KG');
            $table->decimal('storage_fat_mass', 5, 2)->nullable()->comment('KG');
            $table->decimal('visceral_fat', 5, 2)->nullable()->comment('Level 1-59');
            
            // Komponen Air & Seluler
            $table->decimal('total_body_water', 5, 2)->nullable()->comment('%');
            $table->decimal('intracellular_water', 5, 2)->nullable()->comment('Liters');
            $table->decimal('extracellular_water', 5, 2)->nullable()->comment('Liters');
            $table->decimal('phase_angle', 5, 2)->nullable()->comment('Degrees');
            
            // Metabolisme
            $table->integer('bmr')->nullable()->comment('Kcal');
            
            // Residual
            $table->decimal('other_mass', 5, 2)->nullable()->comment('KG (Organ, dll)');
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('composition_tests');
    }
};