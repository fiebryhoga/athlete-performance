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
        Schema::create('meal_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('coach_id')->nullable()->constrained('users')->onDelete('set null');
            
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            
            $table->string('recommendation')->nullable(); // cutting, maintenance, bulking
            $table->integer('target_calories')->nullable();
            $table->integer('protein_target')->nullable();
            $table->integer('carbs_target')->nullable();
            $table->integer('fats_target')->nullable();
            
            $table->json('weekly_plan')->nullable();
            $table->json('hydration_plan')->nullable();
            $table->json('supplements_plan')->nullable();
            
            $table->text('notes')->nullable();
            $table->text('warnings')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meal_plans');
    }
};
