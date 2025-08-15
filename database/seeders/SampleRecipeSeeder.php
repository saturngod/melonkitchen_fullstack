<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Recipe;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Database\Seeder;

class SampleRecipeSeeder extends Seeder
{
    public function run(): void
    {
        // Create or get a demo user
        $user = User::firstOrCreate(
            ['email' => 'chef@example.com'],
            ['name' => 'Demo Chef', 'password' => bcrypt('password')]
        );

        // Create sample categories
        $categories = collect([
            ['name' => 'Main Course', 'description' => 'Hearty main dishes'],
            ['name' => 'Dessert', 'description' => 'Sweet treats and desserts'],
            ['name' => 'Appetizer', 'description' => 'Starters and small plates'],
            ['name' => 'Breakfast', 'description' => 'Morning meals'],
            ['name' => 'Soup', 'description' => 'Warm and comforting soups'],
        ])->map(function ($category) {
            return Category::firstOrCreate(['name' => $category['name']], $category);
        });

        // Create sample tags
        $tags = collect([
            ['name' => 'Vegetarian', 'description' => 'No meat ingredients'],
            ['name' => 'Quick', 'description' => 'Ready in 30 minutes or less'],
            ['name' => 'Healthy', 'description' => 'Nutritious and balanced'],
            ['name' => 'Spicy', 'description' => 'Has some heat'],
            ['name' => 'Family-Friendly', 'description' => 'Kids will love it'],
            ['name' => 'Gluten-Free', 'description' => 'No gluten ingredients'],
            ['name' => 'Low-Carb', 'description' => 'Minimal carbohydrates'],
        ])->map(function ($tag) {
            return Tag::firstOrCreate(['name' => $tag['name']], $tag);
        });

        // Sample recipe data
        $recipes = [
            [
                'title' => 'Classic Spaghetti Carbonara',
                'description' => 'A traditional Italian pasta dish with eggs, cheese, and pancetta. Creamy and delicious without any cream!',
                'prep_time_minutes' => 10,
                'cook_time_minutes' => 20,
                'servings' => 4,
                'difficulty' => 'medium',
                'categories' => ['Main Course'],
                'tags' => ['Quick', 'Family-Friendly'],
            ],
            [
                'title' => 'Chocolate Chip Cookies',
                'description' => 'Soft and chewy chocolate chip cookies that are perfect for any occasion. A family favorite!',
                'prep_time_minutes' => 15,
                'cook_time_minutes' => 12,
                'servings' => 24,
                'difficulty' => 'easy',
                'categories' => ['Dessert'],
                'tags' => ['Family-Friendly'],
            ],
            [
                'title' => 'Vegetarian Buddha Bowl',
                'description' => 'A colorful and nutritious bowl packed with fresh vegetables, quinoa, and a tahini dressing.',
                'prep_time_minutes' => 20,
                'cook_time_minutes' => 25,
                'servings' => 2,
                'difficulty' => 'easy',
                'categories' => ['Main Course'],
                'tags' => ['Vegetarian', 'Healthy', 'Gluten-Free'],
            ],
            [
                'title' => 'Spicy Thai Tom Yum Soup',
                'description' => 'A hot and sour Thai soup with shrimp, mushrooms, and aromatic herbs. Perfect for cold days.',
                'prep_time_minutes' => 15,
                'cook_time_minutes' => 20,
                'servings' => 4,
                'difficulty' => 'medium',
                'categories' => ['Soup'],
                'tags' => ['Spicy', 'Quick', 'Healthy'],
            ],
            [
                'title' => 'Avocado Toast with Poached Egg',
                'description' => 'Simple yet elegant breakfast featuring creamy avocado and perfectly poached eggs on sourdough.',
                'prep_time_minutes' => 5,
                'cook_time_minutes' => 10,
                'servings' => 1,
                'difficulty' => 'easy',
                'categories' => ['Breakfast'],
                'tags' => ['Quick', 'Healthy', 'Vegetarian'],
            ],
            [
                'title' => 'Mediterranean Stuffed Peppers',
                'description' => 'Colorful bell peppers stuffed with quinoa, feta cheese, olives, and Mediterranean herbs.',
                'prep_time_minutes' => 25,
                'cook_time_minutes' => 35,
                'servings' => 4,
                'difficulty' => 'medium',
                'categories' => ['Main Course'],
                'tags' => ['Vegetarian', 'Healthy', 'Gluten-Free'],
            ],
            [
                'title' => 'Quick Chicken Caesar Salad',
                'description' => 'Fresh romaine lettuce with grilled chicken, parmesan, and homemade caesar dressing.',
                'prep_time_minutes' => 15,
                'cook_time_minutes' => 10,
                'servings' => 2,
                'difficulty' => 'easy',
                'categories' => ['Main Course'],
                'tags' => ['Quick', 'Healthy', 'Low-Carb'],
            ],
            [
                'title' => 'Homemade Pizza Margherita',
                'description' => 'Classic Neapolitan pizza with fresh mozzarella, basil, and San Marzano tomatoes.',
                'prep_time_minutes' => 30,
                'cook_time_minutes' => 15,
                'servings' => 4,
                'difficulty' => 'hard',
                'categories' => ['Main Course'],
                'tags' => ['Vegetarian', 'Family-Friendly'],
            ],
            [
                'title' => 'Crispy Garlic Parmesan Asparagus',
                'description' => 'Roasted asparagus with crispy garlic and fresh parmesan cheese. Perfect side dish.',
                'prep_time_minutes' => 10,
                'cook_time_minutes' => 15,
                'servings' => 4,
                'difficulty' => 'easy',
                'categories' => ['Appetizer'],
                'tags' => ['Quick', 'Vegetarian', 'Healthy', 'Low-Carb'],
            ],
            [
                'title' => 'Banana Oat Pancakes',
                'description' => 'Fluffy and healthy pancakes made with oats and bananas. No flour needed!',
                'prep_time_minutes' => 10,
                'cook_time_minutes' => 15,
                'servings' => 2,
                'difficulty' => 'easy',
                'categories' => ['Breakfast'],
                'tags' => ['Quick', 'Healthy', 'Gluten-Free', 'Family-Friendly'],
            ],
        ];

        foreach ($recipes as $recipeData) {
            $recipe = Recipe::create([
                'user_id' => $user->id,
                'title' => $recipeData['title'],
                'description' => $recipeData['description'],
                'prep_time_minutes' => $recipeData['prep_time_minutes'],
                'cook_time_minutes' => $recipeData['cook_time_minutes'],
                'servings' => $recipeData['servings'],
                'difficulty' => $recipeData['difficulty'],
                'is_public' => true,
            ]);

            // Attach categories
            foreach ($recipeData['categories'] as $categoryName) {
                $category = $categories->firstWhere('name', $categoryName);
                if ($category) {
                    $recipe->categories()->attach($category->id);
                }
            }

            // Attach tags
            foreach ($recipeData['tags'] as $tagName) {
                $tag = $tags->firstWhere('name', $tagName);
                if ($tag) {
                    $recipe->tags()->attach($tag->id);
                }
            }
        }

        $this->command->info('Created 10 sample recipes with categories and tags!');
    }
}
