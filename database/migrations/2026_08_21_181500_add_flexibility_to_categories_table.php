<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\Category;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Category::firstOrCreate(['name' => 'Flexibility']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Optional
    }
};
