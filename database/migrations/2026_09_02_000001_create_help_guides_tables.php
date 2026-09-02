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
        Schema::create('help_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('icon')->default('HelpCircle');
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        Schema::create('help_guides', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->nullable()->constrained('help_categories')->nullOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->enum('target_role', ['all', 'coach', 'athlete'])->default('all');
            $table->text('summary')->nullable();
            $table->longText('content')->nullable();
            $table->boolean('is_published')->default(true);
            $table->integer('views_count')->default(0);
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        Schema::create('help_guide_steps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('help_guide_id')->constrained('help_guides')->cascadeOnDelete();
            $table->integer('step_number')->default(1);
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('image_path')->nullable();
            $table->text('tip')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('help_guide_steps');
        Schema::dropIfExists('help_guides');
        Schema::dropIfExists('help_categories');
    }
};
