<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        
        Schema::create('training_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); 
            $table->foreignId('coach_id')->nullable()->constrained('users')->onDelete('set null'); 
            $table->date('date');
            $table->integer('session_number')->nullable(); 
            $table->string('training_type')->nullable(); 
            $table->string('location')->nullable(); 
            $table->timestamps();
        });

        
        Schema::create('training_session_exercises', function (Blueprint $table) {
            $table->id();
            $table->foreignId('training_session_id')->constrained()->onDelete('cascade');
            $table->string('exercise_name')->nullable();
            $table->string('set_1_load')->nullable();
            $table->string('set_1_reps')->nullable();
            $table->string('set_2_load')->nullable();
            $table->string('set_2_reps')->nullable();
            $table->string('set_3_load')->nullable();
            $table->string('set_3_reps')->nullable();
            $table->string('set_4_load')->nullable();
            $table->string('set_4_reps')->nullable();
            $table->text('notes')->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('training_session_exercises');
        Schema::dropIfExists('training_sessions');
    }
};