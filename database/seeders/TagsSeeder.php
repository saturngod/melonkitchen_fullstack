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
            ['name' => 'Quick & Easy'],
            ['name' => 'Healthy'],
            ['name' => 'Comfort Food'],
            ['name' => 'Spicy'],
            ['name' => 'Sweet'],
            ['name' => 'Savory'],
            ['name' => 'Italian'],
            ['name' => 'Mexican'],
            ['name' => 'Asian'],
            ['name' => 'Mediterranean'],
            ['name' => 'American'],
            ['name' => 'French'],
            ['name' => 'Indian'],
            ['name' => 'Family Friendly'],
            ['name' => 'One Pot'],
            ['name' => 'Make Ahead'],
            ['name' => 'Freezer Friendly'],
            ['name' => 'Holiday'],
            ['name' => 'Summer'],
            ['name' => 'Winter'],
        ];

        $user = \App\Models\User::first();
        if (!$user) {
            throw new \Exception('No user found for created_user_id. Please seed users first.');
        }
        foreach ($tags as $tag) {
            Tag::create([
                ...$tag,
                'created_user_id' => $user->id,
                'is_public' => false,
            ]);
        }
    }
}
