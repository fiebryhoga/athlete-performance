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
        Schema::table('group_trainings', function (Blueprint $table) {
            $table->string('name')->nullable()->after('training_group_id');
            $table->string('status')->default('draft')->after('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('group_trainings', function (Blueprint $table) {
            $table->dropColumn(['name', 'status']);
        });
    }
};
