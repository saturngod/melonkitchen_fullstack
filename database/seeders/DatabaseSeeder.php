<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (User::where('email', 'test@example.com')->doesntExist()) {
            User::factory()->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
                'username' => 'testuser',
                'first_name' => 'Test',
                'last_name' => 'User',
                'password' => bcrypt('password'),
                'role' => \App\Enums\UserRole::ADMIN,
                'is_active' => true,
                'email_verified_at' => now(),
            ]);
        }

        $this->call([
            UnitsSeeder::class,
            CategoriesSeeder::class,
            IngredientsSeeder::class,
            IngredientUnitsSeeder::class,
            TagsSeeder::class,
            RecipeSeeder::class,
        ]);
    }
}
