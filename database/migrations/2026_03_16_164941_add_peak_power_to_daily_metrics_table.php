<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('daily_metrics', function (Blueprint $table) {
            $table->float('peak_power')->nullable()->after('vo2_max');
        });
    }

    public function down(): void
    {
        Schema::table('daily_metrics', function (Blueprint $table) {
            $table->dropColumn('peak_power');
        });
    }
};