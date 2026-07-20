<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gym_attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gym_schedule_id')->constrained('gym_schedules')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();

            // Check-in
            $table->datetime('check_in_time')->nullable();
            $table->decimal('check_in_latitude', 10, 7)->nullable();
            $table->decimal('check_in_longitude', 10, 7)->nullable();
            $table->enum('check_in_status', ['on_time', 'late'])->nullable();

            // Check-out
            $table->datetime('check_out_time')->nullable();
            $table->decimal('check_out_latitude', 10, 7)->nullable();
            $table->decimal('check_out_longitude', 10, 7)->nullable();
            $table->enum('check_out_status', ['on_time', 'late'])->nullable();

            // Payout tracking (similar to session recap pattern)
            $table->boolean('is_paid')->default(false);

            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gym_attendances');
    }
};
