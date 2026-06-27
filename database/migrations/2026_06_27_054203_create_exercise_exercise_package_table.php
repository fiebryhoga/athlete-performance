<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exercise_exercise_package', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exercise_id')->constrained()->cascadeOnDelete();
            $table->foreignId('exercise_package_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exercise_exercise_package');
    }
};
