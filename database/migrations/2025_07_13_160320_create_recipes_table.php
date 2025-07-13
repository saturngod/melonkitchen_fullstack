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
        Schema::create('recipes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->string('title', 255);
            $table->text('description')->nullable();
            $table->integer('prep_time_minutes')->default(0);
            $table->integer('cook_time_minutes')->default(0);
            $table->integer('servings')->default(1);
            $table->enum('difficulty', ['beginner', 'easy', 'medium', 'hard', 'expert'])->default('easy');
            $table->boolean('is_public')->default(false);
            $table->text('image_url')->nullable();
            $table->text('youtube_url')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->index(['user_id']);
            $table->index(['is_public']);
            $table->index(['difficulty']);
            $table->index(['created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recipes');
    }
};
