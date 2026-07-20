<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gym_schedules', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->foreignId('gym_shift_id')->constrained('gym_shifts')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['date', 'gym_shift_id']); // 1 coach per shift per day
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gym_schedules');
    }
};
