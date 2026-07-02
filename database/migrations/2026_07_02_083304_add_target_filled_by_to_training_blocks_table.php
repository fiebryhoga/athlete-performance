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
            $table->string('target_filled_by')->default('admin')->after('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('training_blocks', function (Blueprint $table) {
            $table->dropColumn('target_filled_by');
        });
    }
};
