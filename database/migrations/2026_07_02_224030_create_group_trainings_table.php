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
        Schema::create('group_trainings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('training_group_id')->constrained('training_groups')->cascadeOnDelete();
            $table->date('date');
            $table->integer('session_number')->default(1);
            $table->foreignId('coach_id')->constrained('users')->cascadeOnDelete();
            $table->boolean('is_group_paid')->default(false);
            $table->boolean('is_coach_paid')->default(false);
            $table->json('attendee_ids')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('group_trainings');
    }
};
