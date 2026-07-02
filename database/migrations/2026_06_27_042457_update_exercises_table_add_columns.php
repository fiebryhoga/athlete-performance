<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('exercises', function (Blueprint $table) {
            if (!Schema::hasColumn('exercises', 'description')) {
                $table->text('description')->nullable()->after('name');
            }
            if (!Schema::hasColumn('exercises', 'images')) {
                $table->json('images')->nullable()->after('description');
            }
            if (!Schema::hasColumn('exercises', 'videos')) {
                $table->json('videos')->nullable()->after('images');
            }
            if (!Schema::hasColumn('exercises', 'exercise_category_id')) {
                $table->foreignId('exercise_category_id')->nullable()->after('videos')->constrained('exercise_categories')->onDelete('set null');
            }
        });
    }

    public function down(): void
    {
        Schema::table('exercises', function (Blueprint $table) {
            $table->dropForeign(['exercise_category_id']);
            $table->dropColumn(['description', 'images', 'videos', 'exercise_category_id']);
        });
    }
};