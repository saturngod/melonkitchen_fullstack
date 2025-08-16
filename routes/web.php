<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\IngredientController;
use App\Http\Controllers\Main\HomeController;
use App\Http\Controllers\Main\MainRecipeController;
use App\Http\Controllers\Main\SearchController;
use App\Http\Controllers\RecipeController;

Route::get('/', [HomeController::class,'index'])->name('home');

// Search route
Route::get('/search', [SearchController::class, 'index'])->name('search');

// Public recipe view route
Route::get('/recipes/{recipe}', [MainRecipeController::class, 'show'])
    ->name('recipes.public.show');

// My recipes route (requires authentication)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/my-recipes', [\App\Http\Controllers\Main\MyRecipesController::class, 'index'])
        ->name('my-recipes');
});

Route::middleware(['auth', 'verified', 'onlyadmin'])->group(function () {

    Route::prefix('dashboard')->group(function () {
        
        Route::get('/', function () {
            return Inertia::render('dashboard');
        })->name('dashboard');

        Route::resource('users', UserController::class);

        Route::resource('tags', TagController::class)
        ->only(['index', 'store', 'update', 'destroy']);

        // Category management
        Route::resource('categories', \App\Http\Controllers\CategoryController::class)
        ->only(['index', 'store', 'update', 'destroy']);

        // Ingredient management
        Route::resource('ingredients', IngredientController::class)
        ->only(['index', 'store', 'update', 'destroy']);

        // Recipe management
        Route::resource('recipes', \App\Http\Controllers\RecipeController::class)
        ->only(['index', 'create', 'store', 'show', 'edit', 'update', 'destroy']);
        
        // Recipe toggle public status
        Route::patch('recipes/{recipe}/toggle-public', [\App\Http\Controllers\RecipeController::class, 'togglePublic'])
        ->name('recipes.toggle-public');
    });
    
   
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
