<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('individual_training_rpe_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('individual_training_id')->constrained()->cascadeOnDelete();
            $table->foreignId('training_block_item_id')->constrained()->cascadeOnDelete();
            $table->json('rpe_data')->nullable(); // { rpes: [...], load_array: [...], reps_array: [...], ... }
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('individual_training_rpe_records');
    }
};
