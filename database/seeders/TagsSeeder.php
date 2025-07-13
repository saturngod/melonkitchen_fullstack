<?php

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Seeder;

class TagsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tags = [
            ['name' => 'Quick & Easy', 'color' => '#4CAF50'],
            ['name' => 'Healthy', 'color' => '#8BC34A'],
            ['name' => 'Comfort Food', 'color' => '#FF9800'],
            ['name' => 'Spicy', 'color' => '#F44336'],
            ['name' => 'Sweet', 'color' => '#E91E63'],
            ['name' => 'Savory', 'color' => '#795548'],
            ['name' => 'Italian', 'color' => '#009688'],
            ['name' => 'Mexican', 'color' => '#FF5722'],
            ['name' => 'Asian', 'color' => '#9C27B0'],
            ['name' => 'Mediterranean', 'color' => '#3F51B5'],
            ['name' => 'American', 'color' => '#2196F3'],
            ['name' => 'French', 'color' => '#607D8B'],
            ['name' => 'Indian', 'color' => '#FF6F00'],
            ['name' => 'Family Friendly', 'color' => '#CDDC39'],
            ['name' => 'One Pot', 'color' => '#FFC107'],
            ['name' => 'Make Ahead', 'color' => '#00BCD4'],
            ['name' => 'Freezer Friendly', 'color' => '#673AB7'],
            ['name' => 'Holiday', 'color' => '#E91E63'],
            ['name' => 'Summer', 'color' => '#FFEB3B'],
            ['name' => 'Winter', 'color' => '#607D8B'],
        ];

        foreach ($tags as $tag) {
            Tag::create($tag);
        }
    }
}
