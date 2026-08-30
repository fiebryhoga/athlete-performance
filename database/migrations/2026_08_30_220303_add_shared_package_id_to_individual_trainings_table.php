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
        Schema::table('individual_trainings', function (Blueprint $table) {
            $table->foreignId('shared_package_id')->nullable()
                  ->after('user_id')
                  ->constrained('shared_packages')
                  ->nullOnDelete();
            $table->integer('shared_session_number')->nullable()
                  ->after('session_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('individual_trainings', function (Blueprint $table) {
            $table->dropForeign(['shared_package_id']);
            $table->dropColumn(['shared_package_id', 'shared_session_number']);
        });
    }
};
