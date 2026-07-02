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
        Schema::table('individual_trainings', function (Blueprint $table) {
            $table->string('status')->default('scheduled')->after('location');
            $table->integer('athlete_rpe')->nullable()->after('status');
            $table->integer('duration_minutes')->nullable()->after('athlete_rpe');
            $table->text('coach_notes')->nullable()->after('duration_minutes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('individual_trainings', function (Blueprint $table) {
            $table->dropColumn(['status', 'athlete_rpe', 'duration_minutes', 'coach_notes']);
        });
    }
};
