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
        if (!Schema::hasTable('group_training_rpe_records')) {
            Schema::create('group_training_rpe_records', function (Blueprint $table) {
                $table->id();
                $table->foreignId('group_training_id')->constrained()->cascadeOnDelete();
                $table->foreignId('athlete_id')->constrained('users')->cascadeOnDelete();
                $table->foreignId('training_block_item_id')->constrained()->cascadeOnDelete();
                $table->json('rpe_data')->nullable(); // { rpes: [...], load_array: [...], reps_array: [...], ... }
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('group_training_rpe_records');
    }
};
