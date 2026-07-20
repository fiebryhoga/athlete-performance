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
        Schema::table('test_items', function (Blueprint $table) {
            $table->boolean('is_lower_better')->default(false)->after('target_value');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('test_items', function (Blueprint $table) {
            $table->dropColumn('is_lower_better');
        });
    }
};
