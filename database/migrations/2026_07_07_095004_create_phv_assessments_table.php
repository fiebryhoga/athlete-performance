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
        Schema::create('phv_assessments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('assessment_date');
            $table->decimal('age', 5, 2);
            $table->decimal('weight', 5, 2);
            $table->decimal('standing_height', 5, 2);
            $table->decimal('sitting_height', 5, 2);
            $table->decimal('leg_length', 5, 2);
            $table->decimal('maturity_offset', 5, 2);
            $table->decimal('phv_age', 5, 2);
            $table->string('maturity_status'); // Early, Average, Late
            $table->decimal('remaining_growth', 5, 2)->nullable();
            $table->decimal('predicted_adult_height', 5, 2)->nullable();
            $table->decimal('adult_height_percentage', 5, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('phv_assessments');
    }
};
