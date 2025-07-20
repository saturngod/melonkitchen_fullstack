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

// Recipe Show Tests

test('can view public recipe details', function () {
    $user = User::factory()->create();
    $author = User::factory()->create();
    $category = Category::factory()->create();
    $tag = Tag::factory()->create();
    
    $recipe = Recipe::factory()->create([
        'user_id' => $author->id,
        'is_public' => true,
        'title' => 'Public Recipe',
    ]);
    
    $recipe->categories()->attach($category->id);
    $recipe->tags()->attach($tag->id);
    
    // Add instructions
    $recipe->instructions()->create([
        'step_number' => 1,
        'instruction' => 'First step',
    ]);
    
    // Add nutrition info
    $recipe->nutritionInfo()->create([
        'calories_per_serving' => 250,
        'protein_grams' => 10,
    ]);
    
    // Add recipe ingredients
    $ingredient = \App\Models\Ingredient::factory()->create();
    $unit = \App\Models\Unit::factory()->create();
    $recipe->recipeIngredients()->create([
        'ingredient_id' => $ingredient->id,
        'unit_id' => $unit->id,
        'quantity' => '2',
        'is_optional' => false,
    ]);
    
    $this->actingAs($user)
        ->get("/dashboard/recipes/{$recipe->id}")
        ->assertOk()
        ->assertInertia(fn ($page) => 
            $page->component('recipes/show')
                ->where('recipe.id', $recipe->id)
                ->where('recipe.title', 'Public Recipe')
                ->where('recipe.is_public', true)
        );
});

test('can view own private recipe details', function () {
    $user = User::factory()->create();
    
    $recipe = Recipe::factory()->create([
        'user_id' => $user->id,
        'is_public' => false,
        'title' => 'Private Recipe',
    ]);
    
    $this->actingAs($user)
        ->get("/dashboard/recipes/{$recipe->id}")
        ->assertOk()
        ->assertInertia(fn ($page) => 
            $page->component('recipes/show')
                ->where('recipe.id', $recipe->id)
                ->where('recipe.title', 'Private Recipe')
                ->where('recipe.is_public', false)
        );
});

test('cannot view other users private recipes', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    
    $recipe = Recipe::factory()->create([
        'user_id' => $otherUser->id,
        'is_public' => false,
        'title' => 'Other Users Private Recipe',
    ]);
    
    $this->actingAs($user)
        ->get("/dashboard/recipes/{$recipe->id}")
        ->assertForbidden();
});

test('returns 404 for non-existent recipe', function () {
    $user = User::factory()->create();
    
    $this->actingAs($user)
        ->get('/dashboard/recipes/non-existent-id')
        ->assertNotFound();
});

test('loads all recipe relationships correctly', function () {
    $user = User::factory()->create();
    $parentCategory = Category::factory()->create(['name' => 'Parent Category']);
    $childCategory = Category::factory()->create([
        'name' => 'Child Category',
        'parent_id' => $parentCategory->id,
    ]);
    $tag = Tag::factory()->create();
    
    $recipe = Recipe::factory()->create([
        'user_id' => $user->id,
        'is_public' => true,
    ]);
    
    $recipe->categories()->attach($childCategory->id);
    $recipe->tags()->attach($tag->id);
    
    // Add multiple instructions in order
    $recipe->instructions()->create([
        'step_number' => 2,
        'instruction' => 'Second step',
    ]);
    $recipe->instructions()->create([
        'step_number' => 1,
        'instruction' => 'First step',
    ]);
    
    $this->actingAs($user)
        ->get("/dashboard/recipes/{$recipe->id}")
        ->assertOk()
        ->assertInertia(fn ($page) => 
            $page->component('recipes/show')
                ->has('recipe.categories.0.parent') // Child category has parent
                ->where('recipe.categories.0.parent.name', 'Parent Category')
                ->where('recipe.categories.0.name', 'Child Category')
                ->has('recipe.instructions', 2)
                ->where('recipe.instructions.0.step_number', 1) // Instructions ordered by step_number
                ->where('recipe.instructions.1.step_number', 2)
        );
});

test('recipe show requires authentication', function () {
    $recipe = Recipe::factory()->create();
    
    $this->get("/dashboard/recipes/{$recipe->id}")
        ->assertRedirect('/login');
});

test('recipe show handles missing nutrition info gracefully', function () {
    $user = User::factory()->create();
    
    $recipe = Recipe::factory()->create([
        'user_id' => $user->id,
        'is_public' => true,
    ]);
    
    // Don't create nutrition info
    
    $this->actingAs($user)
        ->get("/dashboard/recipes/{$recipe->id}")
        ->assertOk()
        ->assertInertia(fn ($page) => 
            $page->component('recipes/show')
                ->where('recipe.id', $recipe->id)
        );
});

test('recipe show handles empty instructions and ingredients', function () {
    $user = User::factory()->create();
    
    $recipe = Recipe::factory()->create([
        'user_id' => $user->id,
        'is_public' => true,
    ]);
    
    // Don't create instructions or ingredients
    
    $this->actingAs($user)
        ->get("/dashboard/recipes/{$recipe->id}")
        ->assertOk()
        ->assertInertia(fn ($page) => 
            $page->component('recipes/show')
                ->where('recipe.id', $recipe->id)
        );
});