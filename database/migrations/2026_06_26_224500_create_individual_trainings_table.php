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
        Schema::dropIfExists('individual_trainings');
        Schema::create('individual_trainings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('coach_id')->nullable()->constrained('users')->onDelete('set null');
            $table->date('date');
            $table->integer('day_number')->default(1);
            $table->integer('session_number')->default(1);
            $table->string('training_type')->nullable();
            $table->string('location')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('individual_trainings');
    }
};
