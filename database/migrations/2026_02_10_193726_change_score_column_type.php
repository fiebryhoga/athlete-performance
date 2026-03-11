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
        // Ubah menjadi DECIMAL dengan 2 angka di belakang koma
        // Contoh: menyimpang 92.06
        $table->decimal('score', 10, 2)->change(); 
    });
}

public function down(): void
{
    Schema::table('test_results', function (Blueprint $table) {
        $table->integer('score')->change();
    });
}
};
