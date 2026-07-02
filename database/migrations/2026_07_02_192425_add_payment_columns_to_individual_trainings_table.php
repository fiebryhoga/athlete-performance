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
            $table->boolean('is_athlete_paid')->default(false)->after('is_completed');
            $table->json('paid_coach_ids')->nullable()->after('is_athlete_paid');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('individual_trainings', function (Blueprint $table) {
            $table->dropColumn(['is_athlete_paid', 'paid_coach_ids']);
        });
    }
};
