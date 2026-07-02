<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('individual_trainings', function (Blueprint $table) {
            if (!Schema::hasColumn('individual_trainings', 'is_completed')) {
                $table->boolean('is_completed')->default(false)->after('coach_notes');
            }
            if (!Schema::hasColumn('individual_trainings', 'completed_at')) {
                $table->timestamp('completed_at')->nullable()->after('is_completed');
            }
            if (!Schema::hasColumn('individual_trainings', 'athlete_note')) {
                $table->text('athlete_note')->nullable()->after('completed_at');
            }
            if (!Schema::hasColumn('individual_trainings', 'proof_photo')) {
                $table->string('proof_photo')->nullable()->after('athlete_note');
            }
        });
    }

    public function down(): void
    {
        Schema::table('individual_trainings', function (Blueprint $table) {
            $table->dropColumn(['is_completed', 'completed_at', 'athlete_note', 'proof_photo']);
        });
    }
};
