<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('training_loads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('record_date');
            
            
            $table->integer('sleep_quality')->nullable();
            $table->integer('fatigue')->nullable();
            $table->integer('muscle_soreness')->nullable();
            $table->integer('stress')->nullable();
            $table->integer('motivation')->nullable();
            $table->integer('health')->nullable();
            $table->integer('mood')->nullable();
            $table->integer('study_attitude')->nullable();
            $table->integer('wellness_score')->nullable(); 

            
            $table->string('am_session_type')->nullable(); 
            $table->integer('am_rpe')->nullable(); 
            $table->integer('am_duration')->nullable(); 
            $table->integer('am_load')->nullable(); 

            
            $table->string('pm_session_type')->nullable();
            $table->integer('pm_rpe')->nullable();
            $table->integer('pm_duration')->nullable();
            $table->integer('pm_load')->nullable();

            
            $table->integer('daily_load')->nullable(); 

            $table->timestamps();

            
            $table->unique(['user_id', 'record_date']); 
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('training_loads');
    }
};