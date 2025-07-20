<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Ingredient;
use App\Models\Recipe;
use App\Models\RecipeIngredient;
use App\Models\RecipeInstruction;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class RecipeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first();
        $csv = File::get(base_path('PRDs/data/recipes-list.csv'));
        $lines = explode(PHP_EOL, $csv);
        
        // Remove BOM if present and get header
        $headerLine = array_shift($lines);
        $headerLine = preg_replace('/^\x{FEFF}/u', '', $headerLine);
        $header = str_getcsv($headerLine);

        foreach ($lines as $line) {
            if (empty(trim($line))) {
                continue;
            }

            $row = str_getcsv($line);
            if (count($header) !== count($row)) {
                continue;
            }
            
            $data = array_combine($header, $row);

            $parentCategory = Category::firstOrCreate(
                ['name' => $data['Category']],
                ['slug' => Str::slug($data['Category'])]
            );

            $categoryToAttach = $parentCategory;

            if (!empty(trim($data['Sub Category']))) {
                $categoryToAttach = Category::firstOrCreate(
                    ['name' => $data['Sub Category'], 'parent_id' => $parentCategory->id],
                    ['slug' => Str::slug($data['Category'] . ' ' . $data['Sub Category'])]
                );
            }

            $recipe = Recipe::firstOrCreate(
                ['title' => $data['NAME']],
                [
                    'user_id' => $user->id,
                    'description' => 'A delicious ' . $data['NAME'] . ' recipe.',
                    'prep_time_minutes' => rand(10, 30),
                    'cook_time_minutes' => rand(15, 60),
                ]
            );

            $recipe->categories()->syncWithoutDetaching([$categoryToAttach->id]);

            $this->addIngredient($recipe, $data['Main Ingredient_1']);
            if (!empty($data['Ingredient_2'])) {
                $this->addIngredient($recipe, $data['Ingredient_2']);
            }
            $this->addInstructions($recipe);
        }
    }

    private function addIngredient(Recipe $recipe, string $ingredientName)
    {
        if (empty(trim($ingredientName))) {
            return;
        }

        $ingredient = Ingredient::where('name', $ingredientName)->first();

        if ($ingredient) {
            $unit = $ingredient->units()->inRandomOrder()->first() ?? Unit::inRandomOrder()->first();

            if ($unit) {
                RecipeIngredient::firstOrCreate(
                    [
                        'recipe_id' => $recipe->id,
                        'ingredient_id' => $ingredient->id,
                    ],
                    [
                        'quantity' => 1,
                        'unit_id' => $unit->id,
                    ]
                );
            }
        }
    }

    private function addInstructions(Recipe $recipe)
    {
        $instructions = [
            'Prepare all the ingredients.',
            'Wash the vegetables and cut them.',
            'Heat the pan and add oil.',
            'Add the main ingredient and stir-fry for a few minutes.',
            'Add other ingredients and seasonings.',
            'Cook until everything is well-cooked.',
            'Serve hot and enjoy.',
        ];

        foreach ($instructions as $index => $instruction) {
            RecipeInstruction::firstOrCreate([
                'recipe_id' => $recipe->id,
                'step_number' => $index + 1,
            ], [
                'instruction' => $instruction,
            ]);
        }
    }
}
