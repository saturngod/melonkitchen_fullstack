<?php

namespace Database\Seeders;

use App\Models\Ingredient;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class IngredientsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create common ingredients with descriptions
        $ingredients = [
            [
                'name' => 'Tomato',
                'description' => 'Fresh red tomatoes, perfect for salads, sauces, and cooking.',
            ],
            [
                'name' => 'Onion',
                'description' => 'Yellow onions, a versatile base for most savory dishes.',
            ],
            [
                'name' => 'Garlic',
                'description' => 'Fresh garlic cloves, essential for adding flavor to dishes.',
            ],
            [
                'name' => 'Olive Oil',
                'description' => 'Extra virgin olive oil, ideal for cooking and dressings.',
            ],
            [
                'name' => 'Salt',
                'description' => 'Sea salt for seasoning and enhancing flavors.',
            ],
            [
                'name' => 'Black Pepper',
                'description' => 'Freshly ground black pepper for seasoning.',
            ],
            [
                'name' => 'Chicken Breast',
                'description' => 'Boneless, skinless chicken breast, lean protein source.',
            ],
            [
                'name' => 'Rice',
                'description' => 'Long-grain white rice, a versatile side dish.',
            ],
            [
                'name' => 'Pasta',
                'description' => 'Dried pasta in various shapes for Italian dishes.',
            ],
            [
                'name' => 'Cheese',
                'description' => 'Aged cheese for melting, grating, or eating fresh.',
            ],
            [
                'name' => 'Butter',
                'description' => 'Unsalted butter for cooking, baking, and spreading.',
            ],
            [
                'name' => 'Milk',
                'description' => 'Whole milk for drinking, cooking, and baking.',
            ],
            [
                'name' => 'Eggs',
                'description' => 'Fresh eggs for breakfast, baking, and cooking.',
            ],
            [
                'name' => 'Flour',
                'description' => 'All-purpose flour for baking and thickening sauces.',
            ],
            [
                'name' => 'Sugar',
                'description' => 'Granulated white sugar for baking and sweetening.',
            ],
            [
                'name' => 'Carrots',
                'description' => 'Fresh carrots, sweet and crunchy, perfect for cooking or snacking.',
            ],
            [
                'name' => 'Celery',
                'description' => 'Fresh celery stalks, adds crunch and flavor to dishes.',
            ],
            [
                'name' => 'Bell Pepper',
                'description' => 'Colorful bell peppers, sweet and crisp for cooking.',
            ],
            [
                'name' => 'Potatoes',
                'description' => 'Russet potatoes, perfect for mashing, baking, or frying.',
            ],
            [
                'name' => 'Spinach',
                'description' => 'Fresh baby spinach leaves, nutritious and versatile.',
            ],
            [
                'name' => 'Broccoli',
                'description' => 'Fresh broccoli crowns, packed with nutrients.',
            ],
            [
                'name' => 'Mushrooms',
                'description' => 'Button mushrooms, earthy flavor for various dishes.',
            ],
            [
                'name' => 'Lemon',
                'description' => 'Fresh lemons for juice, zest, and garnishing.',
            ],
            [
                'name' => 'Basil',
                'description' => 'Fresh basil leaves, aromatic herb for Italian cuisine.',
            ],
            [
                'name' => 'Oregano',
                'description' => 'Dried oregano, classic Mediterranean herb.',
            ],
            [
                'name' => 'Thyme',
                'description' => 'Fresh thyme sprigs, earthy and aromatic herb.',
            ],
            [
                'name' => 'Parsley',
                'description' => 'Fresh flat-leaf parsley for garnishing and flavoring.',
            ],
            [
                'name' => 'Ground Beef',
                'description' => 'Lean ground beef, versatile protein for many dishes.',
            ],
            [
                'name' => 'Salmon',
                'description' => 'Fresh salmon fillets, rich in omega-3 fatty acids.',
            ],
            [
                'name' => 'Shrimp',
                'description' => 'Fresh or frozen shrimp, quick-cooking seafood.',
            ],
            [
                'name' => 'Tofu',
                'description' => 'Firm tofu, plant-based protein that absorbs flavors well.',
            ],
            [
                'name' => 'Black Beans',
                'description' => 'Canned or dried black beans, fiber-rich legume.',
            ],
            [
                'name' => 'Quinoa',
                'description' => 'Quinoa grains, complete protein and gluten-free grain.',
            ],
            [
                'name' => 'Avocado',
                'description' => 'Ripe avocados, creamy texture and healthy fats.',
            ],
            [
                'name' => 'Greek Yogurt',
                'description' => 'Plain Greek yogurt, high in protein and probiotics.',
            ],
            [
                'name' => 'Honey',
                'description' => 'Pure honey, natural sweetener with antimicrobial properties.',
            ],
            [
                'name' => 'Vanilla Extract',
                'description' => 'Pure vanilla extract for baking and desserts.',
            ],
            [
                'name' => 'Baking Powder',
                'description' => 'Double-acting baking powder for leavening baked goods.',
            ],
            [
                'name' => 'Soy Sauce',
                'description' => 'Low-sodium soy sauce for Asian cuisine and marinades.',
            ],
            [
                'name' => 'Coconut Oil',
                'description' => 'Virgin coconut oil, solid at room temperature, great for baking.',
            ],
        ];

        foreach ($ingredients as $ingredient) {
            Ingredient::firstOrCreate(
                ['name' => $ingredient['name']],
                $ingredient
            );
        }

        // Create additional random ingredients using the factory
        // Only create if we don't have enough ingredients yet
        $currentCount = Ingredient::count();
        if ($currentCount < 50) {
            Ingredient::factory(50 - $currentCount)->create();
        }
    }
}
