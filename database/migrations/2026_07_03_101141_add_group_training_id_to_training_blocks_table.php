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
            if (!Schema::hasColumn('training_blocks', 'group_training_id')) {
                $table->foreignId('group_training_id')->nullable()->after('individual_training_id')->constrained('group_trainings')->cascadeOnDelete();
            }
            $table->foreignId('individual_training_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('training_blocks', function (Blueprint $table) {
            $table->dropForeign(['group_training_id']);
            $table->dropColumn('group_training_id');
            $table->foreignId('individual_training_id')->nullable(false)->change();
        });
    }
};
