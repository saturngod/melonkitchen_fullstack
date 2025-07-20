<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Unit>
 */
class UnitFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $units = [
            ['name' => 'cup', 'abbreviation' => 'cup', 'unit_type' => 'volume'],
            ['name' => 'tablespoon', 'abbreviation' => 'tbsp', 'unit_type' => 'volume'],
            ['name' => 'teaspoon', 'abbreviation' => 'tsp', 'unit_type' => 'volume'],
            ['name' => 'ounce', 'abbreviation' => 'oz', 'unit_type' => 'weight'],
            ['name' => 'pound', 'abbreviation' => 'lb', 'unit_type' => 'weight'],
            ['name' => 'gram', 'abbreviation' => 'g', 'unit_type' => 'weight'],
            ['name' => 'kilogram', 'abbreviation' => 'kg', 'unit_type' => 'weight'],
            ['name' => 'piece', 'abbreviation' => 'pc', 'unit_type' => 'count'],
            ['name' => 'liter', 'abbreviation' => 'L', 'unit_type' => 'volume'],
            ['name' => 'milliliter', 'abbreviation' => 'mL', 'unit_type' => 'volume'],
        ];

        $unit = fake()->randomElement($units);

        return [
            'name' => $unit['name'],
            'abbreviation' => $unit['abbreviation'],
            'unit_type' => $unit['unit_type'],
        ];
    }
}
