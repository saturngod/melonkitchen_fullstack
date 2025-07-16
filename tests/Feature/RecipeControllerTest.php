<?php

use App\Models\Recipe;
use App\Models\User;
use App\Models\Category;
use App\Models\Tag;

test('recipe index page loads successfully', function () {
    $user = User::factory()->create();
    
    $this->actingAs($user)
        ->get('/dashboard/recipes')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('recipes/index'));
});

test('recipe index displays recipes with relationships', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();
    $tag = Tag::factory()->create();
    
    $recipe = Recipe::factory()->create(['user_id' => $user->id]);
    $recipe->categories()->attach($category->id);
    $recipe->tags()->attach($tag->id);
    
    $this->actingAs($user)
        ->get('/dashboard/recipes')
        ->assertOk()
        ->assertInertia(fn ($page) => 
            $page->component('recipes/index')
                ->has('recipes.data', 1)
                ->has('recipes.data.0.categories', 1)
                ->has('recipes.data.0.tags', 1)
        );
});

test('recipe index search filters by title', function () {
    $user = User::factory()->create();
    
    $recipe1 = Recipe::factory()->create([
        'user_id' => $user->id,
        'title' => 'Chocolate Cake',
    ]);
    
    $recipe2 = Recipe::factory()->create([
        'user_id' => $user->id,
        'title' => 'Vanilla Ice Cream',
    ]);
    
    $this->actingAs($user)
        ->get('/dashboard/recipes?search=chocolate')
        ->assertOk()
        ->assertInertia(fn ($page) => 
            $page->component('recipes/index')
                ->has('recipes.data', 1)
                ->where('recipes.data.0.title', 'Chocolate Cake')
        );
});

test('recipe index search returns empty results for non-matching search', function () {
    $user = User::factory()->create();
    
    Recipe::factory()->create([
        'user_id' => $user->id,
        'title' => 'Chocolate Cake',
    ]);
    
    $this->actingAs($user)
        ->get('/dashboard/recipes?search=pizza')
        ->assertOk()
        ->assertInertia(fn ($page) => 
            $page->component('recipes/index')
                ->has('recipes.data', 0)
        );
});

test('recipe index maintains search in pagination', function () {
    $user = User::factory()->create();
    
    // Create 15 recipes with chocolate in title
    Recipe::factory()->count(15)->create([
        'user_id' => $user->id,
        'title' => 'Chocolate Recipe',
    ]);
    
    $this->actingAs($user)
        ->get('/dashboard/recipes?search=chocolate&page=2')
        ->assertOk()
        ->assertInertia(fn ($page) => 
            $page->component('recipes/index')
                ->where('filters.search', 'chocolate')
                ->has('recipes.data', 3) // 15 total, 12 per page, so 3 on page 2
        );
});

test('recipe index requires authentication', function () {
    $this->get('/dashboard/recipes')
        ->assertRedirect('/login');
});