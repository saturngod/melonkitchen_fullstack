<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Recipe>
 */
class RecipeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(3),
            'description' => fake()->paragraph(),
            'prep_time_minutes' => fake()->numberBetween(5, 60),
            'cook_time_minutes' => fake()->numberBetween(10, 120),
            'servings' => fake()->numberBetween(1, 8),
            'difficulty' => fake()->randomElement(['beginner', 'easy', 'medium', 'hard', 'expert']),
            'is_public' => fake()->boolean(),
            'image_url' => fake()->optional()->imageUrl(),
            'youtube_url' => fake()->optional()->url(),
        ];
    }
}
