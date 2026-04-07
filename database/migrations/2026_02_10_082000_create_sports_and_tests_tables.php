<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        
        Schema::create('sports', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); 
            $table->text('description')->nullable();
            $table->timestamps();
        });

        
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name'); 
            $table->timestamps();
        });

        
        Schema::create('test_items', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('sport_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            
            $table->string('name'); 
            
            
            $table->string('parameter_type')->default('points'); 
            
            $table->string('unit')->nullable(); 
            
            
            $table->decimal('target_value', 10, 2)->default(0); 
            
            $table->timestamps();
        });

        
        Schema::table('users', function (Blueprint $table) {
            
            if (!Schema::hasColumn('users', 'sport_id')) {
                $table->foreignId('sport_id')->nullable()->after('role')->constrained('sports')->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'sport_id')) {
                $table->dropForeign(['sport_id']);
                $table->dropColumn('sport_id');
            }
        });
        
        Schema::dropIfExists('test_items');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('sports');
    }
};