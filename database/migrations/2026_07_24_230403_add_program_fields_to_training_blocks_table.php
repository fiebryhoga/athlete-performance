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
        Schema::table('training_blocks', function (Blueprint $table) {
            $table->string('program_name')->default('Program Utama')->after('individual_training_id');
            $table->json('athlete_ids')->nullable()->after('program_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('training_blocks', function (Blueprint $table) {
            $table->dropColumn(['program_name', 'athlete_ids']);
        });
    }
};
