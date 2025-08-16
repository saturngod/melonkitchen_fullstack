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
        Schema::create('recipe_calendars', function (Blueprint $table) {
            $table->id();
            $table->uuid('user_id');
            $table->uuid('recipe_id');
            $table->date('date');
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('recipe_id')->references('id')->on('recipes')->onDelete('cascade');

            // Ensure a user can only add a specific recipe to a specific date once
            $table->unique(['user_id', 'recipe_id', 'date']);
            
            // Index for better query performance
            $table->index(['user_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recipe_calendars');
    }
};
