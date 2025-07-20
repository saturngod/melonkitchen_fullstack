<?php

use App\Models\Recipe;
use App\Models\User;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('recipe has search scope', function () {
    $user = User::factory()->create();
    
    $recipe1 = Recipe::factory()->create([
        'user_id' => $user->id,
        'title' => 'Chocolate Cake Recipe',
    ]);
    
    $recipe2 = Recipe::factory()->create([
        'user_id' => $user->id,
        'title' => 'Vanilla Ice Cream',
    ]);
    
    $results = Recipe::search('chocolate')->get();
    
    expect($results)->toHaveCount(1);
    expect($results->first()->id)->toBe($recipe1->id);
});

test('recipe search is case insensitive', function () {
    $user = User::factory()->create();
    
    $recipe = Recipe::factory()->create([
        'user_id' => $user->id,
        'title' => 'Chocolate Cake Recipe',
    ]);
    
    $results = Recipe::search('CHOCOLATE')->get();
    
    expect($results)->toHaveCount(1);
    expect($results->first()->id)->toBe($recipe->id);
});

test('recipe search returns empty when no matches', function () {
    $user = User::factory()->create();
    
    Recipe::factory()->create([
        'user_id' => $user->id,
        'title' => 'Chocolate Cake Recipe',
    ]);
    
    $results = Recipe::search('pizza')->get();
    
    expect($results)->toHaveCount(0);
});

test('recipe has categories relationship', function () {
    $user = User::factory()->create();
    $recipe = Recipe::factory()->create(['user_id' => $user->id]);
    $category = Category::factory()->create();
    
    $recipe->categories()->attach($category->id);
    
    expect($recipe->categories)->toHaveCount(1);
    expect($recipe->categories->first()->id)->toBe($category->id);
});

test('recipe has tags relationship', function () {
    $user = User::factory()->create();
    $recipe = Recipe::factory()->create(['user_id' => $user->id]);
    $tag = Tag::factory()->create();
    
    $recipe->tags()->attach($tag->id);
    
    expect($recipe->tags)->toHaveCount(1);
    expect($recipe->tags->first()->id)->toBe($tag->id);
});

test('recipe belongs to user', function () {
    $user = User::factory()->create();
    $recipe = Recipe::factory()->create(['user_id' => $user->id]);
    
    expect($recipe->user->id)->toBe($user->id);
});