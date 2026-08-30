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
        Schema::create('coach_shared_package', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shared_package_id')
                  ->constrained('shared_packages')
                  ->cascadeOnDelete();
            $table->foreignId('coach_id')
                  ->constrained('users')
                  ->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['shared_package_id', 'coach_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coach_shared_package');
    }
};
