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
            // Mass
            ['name' => 'Gram', 'unit_type' => 'mass'],
            ['name' => 'Kilogram', 'unit_type' => 'mass'],
            ['name' => 'Viss', 'unit_type' => 'mass'],
            ['name' => 'Tical', 'unit_type' => 'mass'],
            ['name' => 'Pinch', 'unit_type' => 'mass'],

            // Volume
            ['name' => 'Milliliter', 'unit_type' => 'volume'],
            ['name' => 'Liter', 'unit_type' => 'volume'],
            ['name' => 'Tablespoon', 'unit_type' => 'volume'],
            ['name' => 'Teaspoon', 'unit_type' => 'volume'],
            ['name' => 'Cup', 'unit_type' => 'volume'],
            ['name' => 'Spoon', 'unit_type' => 'volume'],

            // Quantity
            ['name' => 'Piece', 'unit_type' => 'quantity'],
            ['name' => 'Bunch', 'unit_type' => 'quantity'],
            ['name' => 'Round', 'unit_type' => 'quantity'],
            ['name' => 'Clove', 'unit_type' => 'quantity'],
            ['name' => 'Clove (burmese)', 'unit_type' => 'quantity'],
            ['name' => 'Sprig', 'unit_type' => 'quantity'],
            ['name' => 'Head', 'unit_type' => 'quantity'],
            ['name' => 'Bulb', 'unit_type' => 'quantity'],
            ['name' => 'Slice', 'unit_type' => 'quantity'],
            ['name' => 'Inch', 'unit_type' => 'quantity'],
            ['name' => 'Can', 'unit_type' => 'quantity'],
            ['name' => 'Stalk', 'unit_type' => 'quantity'],
            ['name' => 'Leaf', 'unit_type' => 'quantity'],
            ['name' => 'Pod', 'unit_type' => 'quantity'],
            ['name' => 'Ear', 'unit_type' => 'quantity'],
            ['name' => 'Pack', 'unit_type' => 'quantity'],
            ['name' => 'Whole', 'unit_type' => 'quantity'],
            ['name' => 'Stick', 'unit_type' => 'quantity'],
        ];

        foreach ($units as $unit) {
            Unit::firstOrCreate(['name' => $unit['name']], $unit);
        }
    }
}
