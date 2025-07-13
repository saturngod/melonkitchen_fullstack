<?php

namespace Database\Seeders;

use App\Models\Unit;
use Illuminate\Database\Seeder;

class UnitsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $units = [
            // Volume
            ['name' => 'Cup', 'abbreviation' => 'cup', 'unit_type' => 'volume'],
            ['name' => 'Tablespoon', 'abbreviation' => 'tbsp', 'unit_type' => 'volume'],
            ['name' => 'Teaspoon', 'abbreviation' => 'tsp', 'unit_type' => 'volume'],
            ['name' => 'Milliliter', 'abbreviation' => 'ml', 'unit_type' => 'volume'],
            ['name' => 'Liter', 'abbreviation' => 'l', 'unit_type' => 'volume'],
            ['name' => 'Fluid Ounce', 'abbreviation' => 'fl oz', 'unit_type' => 'volume'],
            ['name' => 'Pint', 'abbreviation' => 'pt', 'unit_type' => 'volume'],
            ['name' => 'Quart', 'abbreviation' => 'qt', 'unit_type' => 'volume'],
            ['name' => 'Gallon', 'abbreviation' => 'gal', 'unit_type' => 'volume'],

            // Weight
            ['name' => 'Gram', 'abbreviation' => 'g', 'unit_type' => 'weight'],
            ['name' => 'Kilogram', 'abbreviation' => 'kg', 'unit_type' => 'weight'],
            ['name' => 'Ounce', 'abbreviation' => 'oz', 'unit_type' => 'weight'],
            ['name' => 'Pound', 'abbreviation' => 'lb', 'unit_type' => 'weight'],

            // Count
            ['name' => 'Piece', 'abbreviation' => 'pc', 'unit_type' => 'count'],
            ['name' => 'Slice', 'abbreviation' => 'slice', 'unit_type' => 'count'],
            ['name' => 'Clove', 'abbreviation' => 'clove', 'unit_type' => 'count'],
            ['name' => 'Whole', 'abbreviation' => 'whole', 'unit_type' => 'count'],

            // Other
            ['name' => 'Pinch', 'abbreviation' => 'pinch', 'unit_type' => 'other'],
            ['name' => 'Dash', 'abbreviation' => 'dash', 'unit_type' => 'other'],
            ['name' => 'To taste', 'abbreviation' => 'to taste', 'unit_type' => 'other'],
        ];

        foreach ($units as $unit) {
            Unit::create($unit);
        }
    }
}
