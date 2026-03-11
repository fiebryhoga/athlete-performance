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
        Schema::table('test_results', function (Blueprint $table) {
            // Kolom untuk menyimpan nilai asli (detik, meter, reps)
            // Pakai decimal agar presisi (10 digit total, 2 di belakang koma)
            $table->decimal('result', 10, 2)->nullable()->after('test_item_id');
        });
    }

    public function down(): void
    {
        Schema::table('test_results', function (Blueprint $table) {
            $table->dropColumn('result');
        });
    }
};
