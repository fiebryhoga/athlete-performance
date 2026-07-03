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
        if (!Schema::hasColumn('group_trainings', 'training_type')) {
            Schema::table('group_trainings', function (Blueprint $table) {
                $table->string('training_type')->nullable()->after('name');
            });
        }
        if (!Schema::hasColumn('group_trainings', 'location')) {
            Schema::table('group_trainings', function (Blueprint $table) {
                $table->string('location')->nullable()->after('training_type');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('group_trainings', function (Blueprint $table) {
            $table->dropColumn(['training_type', 'location']);
        });
    }
};
