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
            ['name' => 'Gram', 'abbreviation' => 'g', 'unit_type' => 'weight'],
            ['name' => 'Kilogram', 'abbreviation' => 'kg', 'unit_type' => 'weight'],
            ['name' => 'Milligram', 'abbreviation' => 'mg', 'unit_type' => 'weight'],
            ['name' => 'Ounce', 'abbreviation' => 'oz', 'unit_type' => 'weight'],
            ['name' => 'Pound', 'abbreviation' => 'lb', 'unit_type' => 'weight'],
            ['name' => 'Milliliter', 'abbreviation' => 'ml', 'unit_type' => 'volume'],
            ['name' => 'Liter', 'abbreviation' => 'l', 'unit_type' => 'volume'],
            ['name' => 'Teaspoon', 'abbreviation' => 'tsp', 'unit_type' => 'volume'],
            ['name' => 'Tablespoon', 'abbreviation' => 'tbsp', 'unit_type' => 'volume'],
            ['name' => 'Cup', 'abbreviation' => 'cup', 'unit_type' => 'volume'],
            ['name' => 'Piece', 'abbreviation' => 'piece', 'unit_type' => 'quantity'],
            ['name' => 'Slice', 'abbreviation' => 'slice', 'unit_type' => 'quantity'],
            ['name' => 'Clove', 'abbreviation' => 'clove', 'unit_type' => 'quantity'],
            ['name' => 'Pinch', 'abbreviation' => 'pinch', 'unit_type' => 'quantity'],
            ['name' => 'Sprig', 'abbreviation' => 'sprig', 'unit_type' => 'quantity'],
            ['name' => 'Can', 'abbreviation' => 'can', 'unit_type' => 'quantity'],
            ['name' => 'Bottle', 'abbreviation' => 'bottle', 'unit_type' => 'quantity'],
            ['name' => 'Package', 'abbreviation' => 'package', 'unit_type' => 'quantity'],
            ['name' => 'Bunch', 'abbreviation' => 'bunch', 'unit_type' => 'quantity'],
            ['name' => 'Head', 'abbreviation' => 'head', 'unit_type' => 'quantity'],
            ['name' => 'Stalk', 'abbreviation' => 'stalk', 'unit_type' => 'quantity'],
            ['name' => 'Fillet', 'abbreviation' => 'fillet', 'unit_type' => 'quantity'],
            ['name' => 'Tical', 'abbreviation' => 'tical', 'unit_type' => 'weight'],
            ['name' => 'Viss', 'abbreviation' => 'viss', 'unit_type' => 'weight'],
            ['name' => 'Serving', 'abbreviation' => 'ပွဲ', 'unit_type' => 'quantity'],
            ['name' => 'Round', 'abbreviation' => 'လုံး', 'unit_type' => 'quantity'],
            ['name' => 'Ring', 'abbreviation' => 'ကွင်း', 'unit_type' => 'quantity'],
            ['name' => 'Segment', 'abbreviation' => 'စိတ်', 'unit_type' => 'quantity'],
            ['name' => 'Clove (burmese)', 'abbreviation' => 'မွှာ', 'unit_type' => 'quantity'],
            ['name' => 'Small Piece', 'abbreviation' => 'တက်', 'unit_type' => 'quantity'],
            ['name' => 'Branch', 'abbreviation' => 'ခက်', 'unit_type' => 'quantity'],
            ['name' => 'Pack', 'abbreviation' => 'ထုပ်', 'unit_type' => 'quantity'],
            ['name' => 'Jar', 'abbreviation' => 'ဘူး', 'unit_type' => 'quantity'],
            ['name' => 'Kyattha', 'abbreviation' => 'ကျပ်သား', 'unit_type' => 'weight'],
            ['name' => 'Peittha', 'abbreviation' => 'ပိဿာ', 'unit_type' => 'weight'],
            ['name' => 'Spoon', 'abbreviation' => 'ဇွန်း', 'unit_type' => 'volume'],
        ];

        foreach ($units as $unit) {
            Unit::firstOrCreate(
                ['name' => $unit['name']],
                [
                    'abbreviation' => $unit['abbreviation'],
                    'unit_type' => $unit['unit_type']
                ]
            );
        }
    }
}
