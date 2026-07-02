<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('individual_trainings', function (Blueprint $table) {
            $table->json('coach_ids')->nullable()->after('coach_id');
        });
    }

    public function down(): void
    {
        Schema::table('individual_trainings', function (Blueprint $table) {
            $table->dropColumn('coach_ids');
        });
    }
};
