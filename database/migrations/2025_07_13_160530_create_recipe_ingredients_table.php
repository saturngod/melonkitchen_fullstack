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
        Schema::create('recipe_ingredients', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('recipe_id');
            $table->uuid('ingredient_id');
            $table->string('quantity');
            $table->uuid('unit_id');
            $table->text('notes')->nullable();
            $table->boolean('is_optional')->default(false);
            $table->timestamps();

            $table->foreign('recipe_id')->references('id')->on('recipes')->onDelete('cascade');
            $table->foreign('ingredient_id')->references('id')->on('ingredients')->onDelete('cascade');
            $table->foreign('unit_id')->references('id')->on('units')->onDelete('cascade');
            $table->index(['recipe_id']);
            $table->index(['ingredient_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recipe_ingredients');
    }
};
