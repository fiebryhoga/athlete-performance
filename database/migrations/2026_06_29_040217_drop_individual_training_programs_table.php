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
        Schema::dropIfExists('individual_training_programs');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('individual_training_programs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('individual_training_id')->constrained()->onDelete('cascade');
            $table->string('phase')->nullable(); 
            $table->string('logic')->nullable(); 
            $table->foreignId('exercise_id')->nullable()->constrained('exercises')->onDelete('cascade');
            $table->string('sets')->nullable();
            $table->string('reps')->nullable();
            $table->string('duration')->nullable();
            $table->string('rest')->nullable();
            $table->string('intensity')->nullable();
            $table->text('notes')->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }
};
