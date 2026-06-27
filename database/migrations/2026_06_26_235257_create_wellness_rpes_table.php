<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wellness_rpes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->date('record_date');
            
            // Wellness Metrics (1 - 5)
            // 1=awful, 2=poor, 3=OK, 4=good, 5=excellent
            $table->integer('quality_of_sleep')->nullable();
            $table->integer('fatigue')->nullable();
            $table->integer('muscle_soreness')->nullable();
            $table->integer('stress')->nullable();
            $table->integer('motivation')->nullable(); // Motivation and enthusiasm to training
            $table->integer('health')->nullable();
            $table->integer('mood_state')->nullable();
            $table->integer('attitude_to_study')->nullable();
            
            // Total dari 8 item di atas (Maksimal 40)
            $table->integer('daily_wellness_score')->nullable(); 

            // RPE & Duration Metrics
            $table->float('am_rpe')->nullable();          // Skala 1-10
            $table->integer('am_duration')->nullable();   // Dalam menit
            $table->float('pm_rpe')->nullable();          // Skala 1-10
            $table->integer('pm_duration')->nullable();   // Dalam menit
            
            // Calculated Load
            $table->float('daily_load')->nullable();      // (am_rpe * am_duration) + (pm_rpe * pm_duration)

            // Additional Notes
            $table->text('notes')->nullable();
            $table->json('muscle_pain_areas')->nullable();
            $table->integer('sort_order')->default(0);

            $table->timestamps();

            // Memastikan 1 pengguna hanya punya 1 log per tanggal
            $table->unique(['user_id', 'record_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wellness_rpes');
    }
};
