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
        Schema::table('composition_tests', function (Blueprint $table) {
            $table->decimal('activity_level', 5, 3)->nullable()->after('bmr')->comment('TDEE Activity Multiplier (1.2 - 1.9)');
            $table->integer('tdee')->nullable()->after('activity_level')->comment('Kcal');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('composition_tests', function (Blueprint $table) {
            $table->dropColumn(['activity_level', 'tdee']);
        });
    }
};

