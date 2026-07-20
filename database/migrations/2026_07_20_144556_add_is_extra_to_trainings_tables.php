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
            $table->boolean('is_extra')->default(false)->after('session_number');
            $table->integer('session_number')->nullable()->change();
        });

        Schema::table('group_trainings', function (Blueprint $table) {
            $table->boolean('is_extra')->default(false)->after('session_number');
            $table->integer('session_number')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('individual_trainings', function (Blueprint $table) {
            $table->dropColumn('is_extra');
            $table->integer('session_number')->nullable(false)->change();
        });

        Schema::table('group_trainings', function (Blueprint $table) {
            $table->dropColumn('is_extra');
            $table->integer('session_number')->nullable(false)->change();
        });
    }
};
