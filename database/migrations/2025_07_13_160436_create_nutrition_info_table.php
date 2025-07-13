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
        Schema::create('nutrition_info', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('recipe_id');
            $table->decimal('calories_per_serving', 8, 2)->nullable();
            $table->decimal('protein_grams', 8, 2)->nullable();
            $table->decimal('carbs_grams', 8, 2)->nullable();
            $table->decimal('fat_grams', 8, 2)->nullable();
            $table->decimal('fiber_grams', 8, 2)->nullable();
            $table->decimal('sugar_grams', 8, 2)->nullable();
            $table->decimal('sodium_mg', 8, 2)->nullable();
            $table->timestamps();

            $table->foreign('recipe_id')->references('id')->on('recipes')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nutrition_info');
    }
};
