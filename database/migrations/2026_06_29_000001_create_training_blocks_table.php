<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('training_blocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('individual_training_id')->constrained()->cascadeOnDelete();
            $table->tinyInteger('step'); // 1 = instruksi/text, 2 = fase latihan
            $table->string('category'); // instruction, warm_up, strength_training, stretching, interval, cardio, dll
            $table->string('title')->nullable(); // Nama custom dari coach
            $table->text('description')->nullable(); // Catatan deskripsi blok
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('training_blocks');
    }
};
