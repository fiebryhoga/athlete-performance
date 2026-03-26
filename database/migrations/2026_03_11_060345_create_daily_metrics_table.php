<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('daily_metrics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->date('record_date');
            $table->string('week'); // misal: "Week 17"
            
            // Input Manual
            $table->float('rhr');
            $table->float('spo2');
            $table->float('weight'); // BB saat tes (karena bisa berubah)
            $table->float('vj'); // Vertical Jump
            $table->float('quick_recovery_score'); // Persentase recovery (0-100)
            
            // Kolom Hasil Kalkulasi Otomatis
            $table->float('hr_max');
            $table->float('hr_ratio');
            $table->float('vo2_max');
            $table->string('recovery_status'); // BAIK, CUKUP, KURANG
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_metrics');
    }
};