<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Drop old tables
        Schema::dropIfExists('gym_attendances');
        Schema::dropIfExists('gym_schedules');
        Schema::dropIfExists('gym_shifts');

        // Create new flexible attendance table
        Schema::create('gym_attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->date('date');

            // Check-in tracking
            $table->datetime('check_in_time')->nullable();
            $table->string('check_in_ip')->nullable();
            $table->string('check_in_device')->nullable();
            $table->integer('check_in_distance')->nullable(); // distance in meters

            // Check-out tracking
            $table->datetime('check_out_time')->nullable();
            $table->string('check_out_ip')->nullable();
            $table->string('check_out_device')->nullable();
            $table->integer('check_out_distance')->nullable(); // distance in meters
            $table->text('notes')->nullable();

            $table->boolean('is_paid')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gym_attendances');
    }
};
