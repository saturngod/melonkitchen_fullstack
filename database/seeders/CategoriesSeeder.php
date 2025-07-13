<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Breakfast', 'name_en' => 'Breakfast', 'slug' => 'breakfast'],
            ['name' => 'Lunch', 'name_en' => 'Lunch', 'slug' => 'lunch'],
            ['name' => 'Dinner', 'name_en' => 'Dinner', 'slug' => 'dinner'],
            ['name' => 'Appetizers', 'name_en' => 'Appetizers', 'slug' => 'appetizers'],
            ['name' => 'Desserts', 'name_en' => 'Desserts', 'slug' => 'desserts'],
            ['name' => 'Beverages', 'name_en' => 'Beverages', 'slug' => 'beverages'],
            ['name' => 'Snacks', 'name_en' => 'Snacks', 'slug' => 'snacks'],
            ['name' => 'Soups', 'name_en' => 'Soups', 'slug' => 'soups'],
            ['name' => 'Salads', 'name_en' => 'Salads', 'slug' => 'salads'],
            ['name' => 'Main Course', 'name_en' => 'Main Course', 'slug' => 'main-course'],
            ['name' => 'Side Dishes', 'name_en' => 'Side Dishes', 'slug' => 'side-dishes'],
            ['name' => 'Vegetarian', 'name_en' => 'Vegetarian', 'slug' => 'vegetarian'],
            ['name' => 'Vegan', 'name_en' => 'Vegan', 'slug' => 'vegan'],
            ['name' => 'Gluten Free', 'name_en' => 'Gluten Free', 'slug' => 'gluten-free'],
            ['name' => 'Low Carb', 'name_en' => 'Low Carb', 'slug' => 'low-carb'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
