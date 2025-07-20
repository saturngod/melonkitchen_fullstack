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
            ['name' => 'Gram', 'type' => 'mass'],
            ['name' => 'Kilogram', 'type' => 'mass'],
            ['name' => 'Viss', 'type' => 'mass'],
            ['name' => 'Tical', 'type' => 'mass'],
            ['name' => 'Pinch', 'type' => 'mass'],

            // Volume
            ['name' => 'Milliliter', 'type' => 'volume'],
            ['name' => 'Liter', 'type' => 'volume'],
            ['name' => 'Tablespoon', 'type' => 'volume'],
            ['name' => 'Teaspoon', 'type' => 'volume'],
            ['name' => 'Cup', 'type' => 'volume'],
            ['name' => 'Spoon', 'type' => 'volume'],

            // Quantity
            ['name' => 'Piece', 'type' => 'quantity'],
            ['name' => 'Bunch', 'type' => 'quantity'],
            ['name' => 'Round', 'type' => 'quantity'],
            ['name' => 'Clove', 'type' => 'quantity'],
            ['name' => 'Clove (burmese)', 'type' => 'quantity'],
            ['name' => 'Sprig', 'type' => 'quantity'],
            ['name' => 'Head', 'type' => 'quantity'],
            ['name' => 'Bulb', 'type' => 'quantity'],
            ['name' => 'Slice', 'type' => 'quantity'],
            ['name' => 'Inch', 'type' => 'quantity'],
            ['name' => 'Can', 'type' => 'quantity'],
            ['name' => 'Stalk', 'type' => 'quantity'],
            ['name' => 'Leaf', 'type' => 'quantity'],
            ['name' => 'Pod', 'type' => 'quantity'],
            ['name' => 'Ear', 'type' => 'quantity'],
            ['name' => 'Pack', 'type' => 'quantity'],
            ['name' => 'Whole', 'type' => 'quantity'],
            ['name' => 'Stick', 'type' => 'quantity'],
        ];

        foreach ($units as $unit) {
            Unit::firstOrCreate($unit);
        }
    }
}
