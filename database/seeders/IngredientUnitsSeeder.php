<?php

namespace Database\Seeders;

use App\Models\Ingredient;
use App\Models\IngredientUnit;
use App\Models\Unit;
use Illuminate\Database\Seeder;

class IngredientUnitsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ingredientUnits = [
            'မျှစ်' => ['Bunch', 'Piece'],
            '၀က်သား' => ['Kilogram', 'Gram', 'Viss', 'Tical'],
            'ကင်းမွန်' => ['Kilogram', 'Gram', 'Viss', 'Tical'],
            'ကြက်သွန်နီ' => ['Gram', 'Piece', 'Round'],
            'ကြက်သွန်ဖြူ' => ['Gram', 'Clove', 'Clove (burmese)'],
            'ကြက်သား' => ['Kilogram', 'Gram', 'Viss', 'Tical'],
            'ငါး' => ['Kilogram', 'Gram', 'Viss', 'Tical', 'Piece'],
            'ငံပြာရည်' => ['Milliliter', 'Liter', 'Tablespoon', 'Teaspoon', 'Spoon'],
            'ငရုတ်သီးစိမ်း' => ['Gram', 'Piece'],
            'နံနံပင်' => ['Gram', 'Bunch', 'Sprig'],
            'ဆီ' => ['Milliliter', 'Liter', 'Tablespoon', 'Teaspoon', 'Spoon'],
            'ဆား' => ['Gram', 'Teaspoon', 'Pinch'],
            'သကြား' => ['Gram', 'Teaspoon', 'Tablespoon'],
            'အာလူး' => ['Kilogram', 'Gram', 'Piece', 'Round'],
            'ခရမ်းချဉ်သီး' => ['Kilogram', 'Gram', 'Piece', 'Round'],
            'ပဲပြား' => ['Piece', 'Gram'],
            'ပုဇွန်' => ['Kilogram', 'Gram', 'Viss', 'Tical'],
            'ဂေါ်ဖီထုပ်' => ['Kilogram', 'Gram', 'Head', 'Piece'],
            'မုန်လာဥနီ' => ['Kilogram', 'Gram', 'Piece'],
        ];

        foreach ($ingredientUnits as $ingredientName => $unitNames) {
            $ingredient = Ingredient::where('name', $ingredientName)->first();
            if ($ingredient) {
                foreach ($unitNames as $unitName) {
                    $unit = Unit::where('name', $unitName)->first();
                    if ($unit) {
                        IngredientUnit::firstOrCreate([
                            'ingredient_id' => $ingredient->id,
                            'unit_id' => $unit->id,
                        ]);
                    }
                }
            }
        }
    }
}
