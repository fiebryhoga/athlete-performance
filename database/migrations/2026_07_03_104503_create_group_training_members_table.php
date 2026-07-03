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
        if (!Schema::hasTable('group_training_members')) {
            Schema::create('group_training_members', function (Blueprint $table) {
                $table->id();
                $table->foreignId('group_training_id')->constrained()->cascadeOnDelete();
                $table->foreignId('athlete_id')->constrained('users')->cascadeOnDelete();
                $table->boolean('is_completed')->default(false);
                $table->timestamp('completed_at')->nullable();
                $table->integer('athlete_rpe')->nullable();
                $table->integer('duration_minutes')->nullable();
                $table->text('coach_notes')->nullable();
                $table->text('athlete_note')->nullable();
                $table->string('proof_photo')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('group_training_members');
    }
};
