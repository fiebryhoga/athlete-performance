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
        Schema::table('training_block_items', function (Blueprint $table) {
            $table->json('reps_array')->nullable();
            $table->json('load_array')->nullable();
            $table->json('distance_array')->nullable();
            $table->json('minutes_array')->nullable();
            $table->json('tempo_array')->nullable();
            $table->json('rir_array')->nullable();
            $table->json('rest_per_set_array')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('training_block_items', function (Blueprint $table) {
            $table->dropColumn([
                'reps_array',
                'load_array',
                'distance_array',
                'minutes_array',
                'tempo_array',
                'rir_array',
                'rest_per_set_array'
            ]);
        });
    }
};
