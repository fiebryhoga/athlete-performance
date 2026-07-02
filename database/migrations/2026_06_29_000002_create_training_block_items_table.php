<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('training_block_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('training_block_id')->constrained()->cascadeOnDelete();
            $table->foreignId('exercise_id')->nullable()->constrained()->nullOnDelete();
            $table->text('note')->nullable(); // catatan instruksi (untuk step=1)
            $table->string('load')->nullable();
            $table->string('load_unit')->default('kg');
            $table->string('sets')->nullable(); // string karena bisa "3-4"
            $table->string('reps')->nullable();
            $table->string('reps_unit')->default('reps');
            $table->string('duration')->nullable();
            $table->string('tempo')->nullable();
            $table->string('rir')->nullable();
            $table->string('rest_per_set')->nullable();
            $table->string('intensity')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('training_block_items');
    }
};
