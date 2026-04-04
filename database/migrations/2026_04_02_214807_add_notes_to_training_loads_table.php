<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('training_loads', function (Blueprint $table) {
            $table->text('notes')->nullable()->after('daily_load');
        });
    }

    public function down(): void
    {
        Schema::table('training_loads', function (Blueprint $table) {
            $table->dropColumn('notes');
        });
    }
};