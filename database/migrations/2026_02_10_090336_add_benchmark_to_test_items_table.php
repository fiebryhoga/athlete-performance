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
        // Nilai standar/target (0-100)
        $table->integer('benchmark')->default(0)->after('unit');
    });
}

public function down(): void
{
    Schema::table('test_items', function (Blueprint $table) {
        $table->dropColumn('benchmark');
    });
}
};
