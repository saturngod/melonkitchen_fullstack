<?php

namespace Database\Seeders;

use App\Models\Ingredient;
use App\Models\IngredientUnit;
use App\Models\Unit;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class IngredientUnitsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all ingredients and units
        $ingredients = Ingredient::all();
        $units = Unit::all();

        if ($ingredients->isEmpty() || $units->isEmpty()) {
            $this->command->warn('No ingredients or units found. Please run IngredientsSeeder and UnitsSeeder first.');
            return;
        }

        // Get specific units for different ingredient types
        $volumeUnits = $units->whereIn('name', ['Cup', 'Tablespoon', 'Teaspoon', 'Liter', 'Milliliter'])->pluck('id');
        $weightUnits = $units->whereIn('name', ['Gram', 'Kilogram', 'Ounce', 'Pound'])->pluck('id');
        $countUnits = $units->whereIn('name', ['Piece', 'Whole'])->pluck('id');

        // Define ingredient-specific unit mappings
        $ingredientUnitMappings = [
            // Liquids - primarily volume units
            'Olive Oil' => $volumeUnits->toArray(),
            'Milk' => $volumeUnits->toArray(),
            'Water' => $volumeUnits->toArray(),
            'Coconut Oil' => $volumeUnits->toArray(),
            'Soy Sauce' => $volumeUnits->toArray(),
            'Honey' => $volumeUnits->toArray(),
            'Vanilla Extract' => $volumeUnits->toArray(),
            
            // Spices and powders - small volume units
            'Salt' => $units->whereIn('name', ['Teaspoon', 'Tablespoon', 'Gram'])->pluck('id')->toArray(),
            'Black Pepper' => $units->whereIn('name', ['Teaspoon', 'Tablespoon', 'Gram'])->pluck('id')->toArray(),
            'Oregano' => $units->whereIn('name', ['Teaspoon', 'Tablespoon', 'Gram'])->pluck('id')->toArray(),
            'Basil' => $units->whereIn('name', ['Teaspoon', 'Tablespoon', 'Gram'])->pluck('id')->toArray(),
            'Thyme' => $units->whereIn('name', ['Teaspoon', 'Tablespoon', 'Gram'])->pluck('id')->toArray(),
            'Parsley' => $units->whereIn('name', ['Teaspoon', 'Tablespoon', 'Gram'])->pluck('id')->toArray(),
            'Baking Powder' => $units->whereIn('name', ['Teaspoon', 'Tablespoon'])->pluck('id')->toArray(),
            
            // Proteins - weight units
            'Chicken Breast' => $weightUnits->toArray(),
            'Ground Beef' => $weightUnits->toArray(),
            'Salmon' => $weightUnits->toArray(),
            'Shrimp' => $weightUnits->toArray(),
            'Tofu' => $weightUnits->toArray(),
            
            // Count-based ingredients
            'Eggs' => $countUnits->toArray(),
            'Lemon' => $countUnits->toArray(),
            'Avocado' => $countUnits->toArray(),
            'Tomato' => array_merge($countUnits->toArray(), $weightUnits->toArray()),
            'Onion' => array_merge($countUnits->toArray(), $weightUnits->toArray()),
            'Bell Pepper' => array_merge($countUnits->toArray(), $weightUnits->toArray()),
            
            // Dairy - volume and weight
            'Butter' => array_merge($volumeUnits->toArray(), $weightUnits->toArray()),
            'Cheese' => array_merge($volumeUnits->toArray(), $weightUnits->toArray()),
            'Greek Yogurt' => $volumeUnits->toArray(),
            
            // Grains - volume and weight
            'Rice' => array_merge($volumeUnits->toArray(), $weightUnits->toArray()),
            'Pasta' => $weightUnits->toArray(),
            'Flour' => array_merge($volumeUnits->toArray(), $weightUnits->toArray()),
            'Quinoa' => array_merge($volumeUnits->toArray(), $weightUnits->toArray()),
            'Sugar' => array_merge($volumeUnits->toArray(), $weightUnits->toArray()),
            
            // Vegetables - weight and count
            'Carrots' => array_merge($countUnits->toArray(), $weightUnits->toArray()),
            'Celery' => array_merge($countUnits->toArray(), $weightUnits->toArray()),
            'Potatoes' => array_merge($countUnits->toArray(), $weightUnits->toArray()),
            'Spinach' => $weightUnits->toArray(),
            'Broccoli' => $weightUnits->toArray(),
            'Mushrooms' => $weightUnits->toArray(),
            
            // Legumes - volume and weight
            'Black Beans' => array_merge($volumeUnits->toArray(), $weightUnits->toArray()),
        ];

        foreach ($ingredients as $ingredient) {
            // Get specific units for this ingredient if defined
            $allowedUnits = $ingredientUnitMappings[$ingredient->name] ?? null;
            
            if ($allowedUnits === null) {
                // Default units based on ingredient type patterns
                if (str_contains(strtolower($ingredient->name), 'oil') || 
                    str_contains(strtolower($ingredient->name), 'sauce') ||
                    str_contains(strtolower($ingredient->name), 'extract')) {
                    $allowedUnits = $volumeUnits->toArray();
                } elseif (str_contains(strtolower($ingredient->name), 'powder') || 
                         str_contains(strtolower($ingredient->name), 'spice')) {
                    $allowedUnits = $units->whereIn('name', ['Teaspoon', 'Tablespoon', 'Gram'])->pluck('id')->toArray();
                } else {
                    // General purpose ingredients get multiple unit types
                    $allowedUnits = array_merge(
                        $volumeUnits->take(3)->toArray(),
                        $weightUnits->take(2)->toArray(),
                        $countUnits->take(1)->toArray()
                    );
                }
            }

            // Create ingredient-unit relationships
            foreach ($allowedUnits as $index => $unitId) {
                IngredientUnit::firstOrCreate([
                    'ingredient_id' => $ingredient->id,
                    'unit_id' => $unitId,
                ], [
                    'is_default' => $index === 0, // First unit is default
                ]);
            }
        }

        $this->command->info('Ingredient-Unit relationships created successfully.');
    }
}
