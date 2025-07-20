<?php

namespace Database\Seeders;

use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;

class TagsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first();
        $tags = [
            'Easy', 'Quick', 'Healthy', 'Vegan', 'Gluten-Free', 'Dessert', 'Spicy', 'Breakfast', 'Lunch', 'Dinner'
        ];

        foreach ($tags as $tag) {
            Tag::firstOrCreate(
                ['name' => $tag],
                ['created_user_id' => $user->id]
            );
        }
    }
}
