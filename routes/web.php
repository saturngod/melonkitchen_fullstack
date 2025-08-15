<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\IngredientController;

Route::get('/', function () {
    \Log::info('Test log from web.php route');
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::prefix('dashboard')->group(function () {
        
        Route::get('/', function () {
            return Inertia::render('dashboard');
        })->name('dashboard');

        Route::resources('users', UserController::class);

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
