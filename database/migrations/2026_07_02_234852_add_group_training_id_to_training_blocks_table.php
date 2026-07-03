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
        if (!Schema::hasColumn('training_blocks', 'group_training_id')) {
            Schema::table('training_blocks', function (Blueprint $table) {
                $table->foreignId('group_training_id')->nullable()->constrained('group_trainings')->cascadeOnDelete()->after('individual_training_id');
            });
        }
        
        Schema::table('training_blocks', function (Blueprint $table) {
            $table->unsignedBigInteger('individual_training_id')->nullable()->change();
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
            $table->unsignedBigInteger('individual_training_id')->nullable(false)->change();
        });
    }
};
