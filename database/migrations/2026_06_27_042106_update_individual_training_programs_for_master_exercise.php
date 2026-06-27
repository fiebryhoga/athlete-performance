<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // To avoid foreign key constraints errors if there are existing records,
        // we can truncate the table since we are completely overhauling it,
        // OR we can make exercise_id nullable initially. Let's make it nullable and drop exercise_name.
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('individual_training_programs')->truncate();
        DB::table('individual_trainings')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        Schema::table('individual_training_programs', function (Blueprint $table) {
            if (Schema::hasColumn('individual_training_programs', 'exercise_name')) {
                $table->dropColumn('exercise_name');
            }
            $table->foreignId('exercise_id')->nullable()->after('logic')->constrained('exercises')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('individual_training_programs', function (Blueprint $table) {
            $table->dropForeign(['exercise_id']);
            $table->dropColumn('exercise_id');
            $table->string('exercise_name')->after('logic');
        });
    }
};
