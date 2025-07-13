<?php

use App\Models\Category;
use App\Models\Recipe;
use App\Models\Tag;
use App\Models\User;

test('recipe belongs to user', function () {
    $user = User::factory()->create();
    $recipe = Recipe::factory()->create(['user_id' => $user->id]);

    expect($recipe->user)->toBeInstanceOf(User::class);
    expect($recipe->user->id)->toBe($user->id);
});

test('recipe can have categories', function () {
    $recipe = Recipe::factory()->create();
    $category = Category::factory()->create();

    $recipe->categories()->attach($category);

    expect($recipe->categories->contains($category))->toBeTrue();
});

test('recipe can have tags', function () {
    $recipe = Recipe::factory()->create();
    $tag = Tag::factory()->create();

    $recipe->tags()->attach($tag);

    expect($recipe->tags->contains($tag))->toBeTrue();
});

test('recipe has correct fillable fields', function () {
    $fillable = [
        'user_id',
        'title',
        'description',
        'prep_time_minutes',
        'cook_time_minutes',
        'servings',
        'difficulty',
        'is_public',
        'image_url',
        'youtube_url',
    ];

    $recipe = new Recipe();

    expect($recipe->getFillable())->toBe($fillable);
});
