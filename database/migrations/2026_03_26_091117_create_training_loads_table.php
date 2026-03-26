<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('training_loads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('record_date');
            
            // -- WELLNESS QUESTIONNAIRE (Skala 1-5) --
            $table->integer('sleep_quality')->nullable();
            $table->integer('fatigue')->nullable();
            $table->integer('muscle_soreness')->nullable();
            $table->integer('stress')->nullable();
            $table->integer('motivation')->nullable();
            $table->integer('health')->nullable();
            $table->integer('mood')->nullable();
            $table->integer('study_attitude')->nullable();
            $table->integer('wellness_score')->nullable(); // Total Skor (Maks: 40 per hari)

            // -- RPE (RATE OF PERCEIVED EXERTION) AM / Pagi --
            $table->string('am_session_type')->nullable(); // Contoh: Strength UB, Conditioning
            $table->integer('am_rpe')->nullable(); // Skala 1-10
            $table->integer('am_duration')->nullable(); // Menit
            $table->integer('am_load')->nullable(); // RPE x Duration

            // -- RPE (RATE OF PERCEIVED EXERTION) PM / Sore-Malam --
            $table->string('pm_session_type')->nullable();
            $table->integer('pm_rpe')->nullable();
            $table->integer('pm_duration')->nullable();
            $table->integer('pm_load')->nullable();

            // -- TOTAL DAILY LOAD --
            $table->integer('daily_load')->nullable(); // AM Load + PM Load

            $table->timestamps();

            // Memastikan 1 atlet hanya punya 1 data per tanggal
            $table->unique(['user_id', 'record_date']); 
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('training_loads');
    }
};