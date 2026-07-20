<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gym_shifts', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g. "Shift Pagi", "Shift Sore"
            $table->time('start_time'); // e.g. 07:00
            $table->time('end_time'); // e.g. 14:00
            $table->integer('late_tolerance_minutes')->default(30);
            $table->integer('checkout_tolerance_minutes')->default(30);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gym_shifts');
    }
};
