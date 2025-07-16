<?php

namespace Database\Seeders;

use App\Models\Recipe;
use App\Models\RecipeInstruction;
use App\Models\RecipeIngredient;
use App\Models\User;
use App\Models\Category;
use App\Models\Tag;
use App\Models\Ingredient;
use App\Models\Unit;
use Illuminate\Database\Seeder;

class RecipeSeeder extends Seeder
{
    

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first();
        if (!$user) {
            throw new \Exception('No user found. Please seed users first.');
        }

        // Get categories, tags, units and ingredients for relationships
        $categories = Category::all();
        $tags = Tag::all();
        $ingredients = Ingredient::all();
        $units = Unit::all();

        $recipes = [
            [
                'title' => 'Classic Spaghetti Carbonara',
                'description' => 'A traditional Italian pasta dish with eggs, cheese, and pancetta.',
                'prep_time_minutes' => 15,
                'cook_time_minutes' => 20,
                'servings' => 4,
                'difficulty' => 'medium',
                'is_public' => true,
                'instructions' => [
                    'Bring a large pot of salted water to boil and cook spaghetti according to package directions.',
                    'While pasta cooks, heat olive oil in a large skillet and cook pancetta until crispy.',
                    'In a bowl, whisk together eggs, parmesan cheese, salt, and pepper.',
                    'Drain pasta, reserving 1 cup of pasta water.',
                    'Add hot pasta to the skillet with pancetta and toss.',
                    'Remove from heat and quickly stir in egg mixture, adding pasta water as needed.',
                    'Serve immediately with extra parmesan and black pepper.'
                ],
                'ingredients' => [
                    ['name' => 'Spaghetti', 'quantity' => '400', 'unit' => 'g'],
                    ['name' => 'Eggs', 'quantity' => '3', 'unit' => 'whole'],
                    ['name' => 'Parmesan Cheese', 'quantity' => '100', 'unit' => 'g'],
                    ['name' => 'Pancetta', 'quantity' => '150', 'unit' => 'g'],
                    ['name' => 'Olive Oil', 'quantity' => '2', 'unit' => 'tbsp'],
                    ['name' => 'Black Pepper', 'quantity' => '1', 'unit' => 'tsp'],
                    ['name' => 'Salt', 'quantity' => '1', 'unit' => 'tsp']
                ],
                'categories' => ['Dinner', 'Main Course'],
                'tags' => ['Italian', 'Comfort Food']
            ],
            [
                'title' => 'Chicken Stir Fry',
                'description' => 'Quick and healthy chicken stir fry with vegetables.',
                'prep_time_minutes' => 10,
                'cook_time_minutes' => 15,
                'servings' => 3,
                'difficulty' => 'easy',
                'is_public' => true,
                'instructions' => [
                    'Cut chicken breast into bite-sized pieces and season with salt and pepper.',
                    'Heat oil in a large wok or skillet over high heat.',
                    'Add chicken and cook until golden brown, about 5-6 minutes.',
                    'Add garlic and onion, stir fry for 1 minute.',
                    'Add vegetables and stir fry for 3-4 minutes until tender-crisp.',
                    'Add soy sauce and stir to combine.',
                    'Serve over rice.'
                ],
                'ingredients' => [
                    ['name' => 'Chicken Breast', 'quantity' => '500', 'unit' => 'g'],
                    ['name' => 'Rice', 'quantity' => '1', 'unit' => 'cup'],
                    ['name' => 'Onion', 'quantity' => '1', 'unit' => 'whole'],
                    ['name' => 'Garlic', 'quantity' => '3', 'unit' => 'clove'],
                    ['name' => 'Olive Oil', 'quantity' => '2', 'unit' => 'tbsp'],
                    ['name' => 'Soy Sauce', 'quantity' => '3', 'unit' => 'tbsp'],
                    ['name' => 'Salt', 'quantity' => '1', 'unit' => 'tsp'],
                    ['name' => 'Black Pepper', 'quantity' => '1/2', 'unit' => 'tsp']
                ],
                'categories' => ['Dinner', 'Main Course'],
                'tags' => ['Quick & Easy', 'Healthy', 'Asian']
            ],
            [
                'title' => 'Tomato Basil Soup',
                'description' => 'Creamy tomato soup with fresh basil, perfect for cold days.',
                'prep_time_minutes' => 10,
                'cook_time_minutes' => 25,
                'servings' => 4,
                'difficulty' => 'easy',
                'is_public' => true,
                'instructions' => [
                    'Heat olive oil in a large pot over medium heat.',
                    'Add onion and garlic, cook until softened, about 5 minutes.',
                    'Add tomatoes, breaking them up with a spoon.',
                    'Add vegetable broth, salt, and pepper.',
                    'Bring to a boil, then reduce heat and simmer for 15 minutes.',
                    'Blend soup until smooth using an immersion blender.',
                    'Stir in cream and fresh basil.',
                    'Serve hot with crusty bread.'
                ],
                'ingredients' => [
                    ['name' => 'Tomato', 'quantity' => '800', 'unit' => 'g'],
                    ['name' => 'Onion', 'quantity' => '1', 'unit' => 'whole'],
                    ['name' => 'Garlic', 'quantity' => '3', 'unit' => 'clove'],
                    ['name' => 'Olive Oil', 'quantity' => '2', 'unit' => 'tbsp'],
                    ['name' => 'Vegetable Broth', 'quantity' => '2', 'unit' => 'cup'],
                    ['name' => 'Heavy Cream', 'quantity' => '1/2', 'unit' => 'cup'],
                    ['name' => 'Fresh Basil', 'quantity' => '1/4', 'unit' => 'cup'],
                    ['name' => 'Salt', 'quantity' => '1', 'unit' => 'tsp'],
                    ['name' => 'Black Pepper', 'quantity' => '1/2', 'unit' => 'tsp']
                ],
                'categories' => ['Lunch', 'Soups'],
                'tags' => ['Vegetarian', 'Comfort Food', 'Winter']
            ],
            [
                'title' => 'Chocolate Chip Cookies',
                'description' => 'Classic homemade chocolate chip cookies that are crispy on the outside and chewy inside.',
                'prep_time_minutes' => 15,
                'cook_time_minutes' => 12,
                'servings' => 24,
                'difficulty' => 'easy',
                'is_public' => true,
                'instructions' => [
                    'Preheat oven to 375°F (190°C).',
                    'In a bowl, cream together butter and sugars until light and fluffy.',
                    'Beat in eggs one at a time, then add vanilla.',
                    'In another bowl, whisk together flour, baking soda, and salt.',
                    'Gradually mix dry ingredients into wet ingredients.',
                    'Stir in chocolate chips.',
                    'Drop rounded tablespoons of dough onto ungreased baking sheets.',
                    'Bake for 9-11 minutes until golden brown.',
                    'Cool on baking sheet for 2 minutes before transferring to wire rack.'
                ],
                'ingredients' => [
                    ['name' => 'Butter', 'quantity' => '1', 'unit' => 'cup'],
                    ['name' => 'Brown Sugar', 'quantity' => '3/4', 'unit' => 'cup'],
                    ['name' => 'White Sugar', 'quantity' => '1/4', 'unit' => 'cup'],
                    ['name' => 'Eggs', 'quantity' => '2', 'unit' => 'whole'],
                    ['name' => 'Vanilla Extract', 'quantity' => '2', 'unit' => 'tsp'],
                    ['name' => 'All-Purpose Flour', 'quantity' => '2 1/4', 'unit' => 'cup'],
                    ['name' => 'Baking Soda', 'quantity' => '1', 'unit' => 'tsp'],
                    ['name' => 'Salt', 'quantity' => '1', 'unit' => 'tsp'],
                    ['name' => 'Chocolate Chips', 'quantity' => '2', 'unit' => 'cup']
                ],
                'categories' => ['Desserts'],
                'tags' => ['Sweet', 'Family Friendly', 'American']
            ],
            [
                'title' => 'Greek Salad',
                'description' => 'Fresh Mediterranean salad with tomatoes, cucumbers, olives, and feta cheese.',
                'prep_time_minutes' => 15,
                'cook_time_minutes' => 0,
                'servings' => 4,
                'difficulty' => 'beginner',
                'is_public' => true,
                'instructions' => [
                    'Wash and chop tomatoes into wedges.',
                    'Slice cucumber into rounds.',
                    'Thinly slice red onion.',
                    'In a large bowl, combine tomatoes, cucumber, and onion.',
                    'Add olives and crumbled feta cheese.',
                    'In a small bowl, whisk together olive oil, lemon juice, oregano, salt, and pepper.',
                    'Pour dressing over salad and toss gently.',
                    'Let sit for 10 minutes before serving to allow flavors to meld.'
                ],
                'ingredients' => [
                    ['name' => 'Tomato', 'quantity' => '4', 'unit' => 'whole'],
                    ['name' => 'Cucumber', 'quantity' => '1', 'unit' => 'whole'],
                    ['name' => 'Red Onion', 'quantity' => '0.5', 'unit' => 'whole'],
                    ['name' => 'Kalamata Olives', 'quantity' => '1/2', 'unit' => 'cup'],
                    ['name' => 'Feta Cheese', 'quantity' => '200', 'unit' => 'g'],
                    ['name' => 'Olive Oil', 'quantity' => '1/4', 'unit' => 'cup'],
                    ['name' => 'Lemon Juice', 'quantity' => '2', 'unit' => 'tbsp'],
                    ['name' => 'Dried Oregano', 'quantity' => '1', 'unit' => 'tsp'],
                    ['name' => 'Salt', 'quantity' => '1/2', 'unit' => 'tsp'],
                    ['name' => 'Black Pepper', 'quantity' => '1/4', 'unit' => 'tsp']
                ],
                'categories' => ['Lunch', 'Salads'],
                'tags' => ['Healthy', 'Mediterranean', 'Vegetarian', 'Quick & Easy']
            ]
        ];

        foreach ($recipes as $recipeData) {
            // Create the recipe
            $recipe = Recipe::create([
                'user_id' => $user->id,
                'title' => $recipeData['title'],
                'description' => $recipeData['description'],
                'prep_time_minutes' => $recipeData['prep_time_minutes'],
                'cook_time_minutes' => $recipeData['cook_time_minutes'],
                'servings' => $recipeData['servings'],
                'difficulty' => $recipeData['difficulty'],
                'is_public' => $recipeData['is_public'],
            ]);

            // Add instructions
            foreach ($recipeData['instructions'] as $index => $instruction) {
                RecipeInstruction::create([
                    'recipe_id' => $recipe->id,
                    'step_number' => $index + 1,
                    'instruction' => $instruction,
                ]);
            }

            // Add ingredients (create if they don't exist)
            foreach ($recipeData['ingredients'] as $ingredientData) {
                $ingredient = $ingredients->firstWhere('name', $ingredientData['name']);
                if (!$ingredient) {
                    $ingredient = Ingredient::create([
                        'name' => $ingredientData['name'],
                        'description' => 'Added via recipe seeder',
                    ]);
                }

                // Find the unit by abbreviation
                $unit = $units->firstWhere('abbreviation', $ingredientData['unit']);
                if (!$unit) {
                    // Create a fallback unit if not found
                    $unit = Unit::create([
                        'name' => ucfirst($ingredientData['unit']),
                        'abbreviation' => $ingredientData['unit'],
                        'unit_type' => 'other',
                    ]);
                }

                RecipeIngredient::create([
                    'recipe_id' => $recipe->id,
                    'ingredient_id' => $ingredient->id,
                    'quantity' => $ingredientData['quantity'],
                    'unit_id' => $unit->id,
                ]);
            }

            // Attach categories using attach() with UUID workaround
            $recipeCategories = $categories->whereIn('name', $recipeData['categories']);
            foreach ($recipeCategories as $category) {
                $recipe->categories()->attach($category->id, ['id' => \Str::uuid()->toString()]);
            }

            // Attach tags using attach() with UUID workaround
            $recipeTags = $tags->whereIn('name', $recipeData['tags']);
            foreach ($recipeTags as $tag) {
                $recipe->tags()->attach($tag->id, ['id' => \Str::uuid()->toString()]);
            }
        }
    }
}