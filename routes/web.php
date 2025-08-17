<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\IngredientController;
use App\Http\Controllers\Main\CalendarController;
use App\Http\Controllers\Main\HomeController;
use App\Http\Controllers\Main\MainRecipeController;
use App\Http\Controllers\Main\SearchController;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\RecipeCalendarController;

Route::get('/', [HomeController::class,'index'])->name('home');

// Search route
Route::get('/search', [SearchController::class, 'index'])->name('search');

// My recipes route (requires authentication)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/my-recipes', [\App\Http\Controllers\Main\MyRecipesController::class, 'index'])
        ->name('my-recipes');
    
    // Recipe creation for regular users - using main site layout
    Route::get('/recipes/create', [\App\Http\Controllers\Main\MainRecipeController::class, 'create'])
        ->name('recipes.create');
    Route::post('/recipes', [\App\Http\Controllers\Main\MainRecipeController::class, 'store'])
        ->name('recipes.store');
    Route::get('/recipes/{recipe}/edit', [\App\Http\Controllers\Main\MainRecipeController::class, 'edit'])
        ->name('recipes.edit')->middleware('can:update,recipe');
    Route::put('/recipes/{recipe}', [\App\Http\Controllers\Main\MainRecipeController::class, 'update'])
        ->name('recipes.update')->middleware('can:update,recipe');
    Route::delete('/recipes/{recipe}', [\App\Http\Controllers\Main\MainRecipeController::class, 'destroy'])
        ->name('recipes.destroy')->middleware('can:delete,recipe');
    
    // Calendar route
    Route::get('/calendar', [CalendarController::class, 'index'])
        ->name('calendar');
    
    // Recipe Calendar API routes
    Route::prefix('api/recipe-calendar')->group(function () {
        Route::post('/', [\App\Http\Controllers\RecipeCalendarController::class, 'store'])
            ->name('recipe-calendar.store');
        Route::delete('/{recipeCalendar}', [\App\Http\Controllers\RecipeCalendarController::class, 'destroy'])
            ->name('recipe-calendar.destroy');
        Route::get('/', [\App\Http\Controllers\RecipeCalendarController::class, 'index'])
            ->name('recipe-calendar.index');
    });
});

// Public recipe view route - PUT THIS AFTER the authenticated routes
Route::get('/recipes/{recipe}', [MainRecipeController::class, 'show'])
    ->name('recipes.public.show');

Route::middleware(['auth', 'verified', 'onlyadmin'])->group(function () {

    Route::prefix('dashboard')->group(function () {
        
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

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

        // Recipe Calendar API
        Route::post('/api/recipe-calendar', [\App\Http\Controllers\RecipeCalendarController::class, 'store'])
        ->name('recipe-calendar.store');
        Route::delete('/api/recipe-calendar/{recipeCalendar}', [\App\Http\Controllers\RecipeCalendarController::class, 'destroy'])
        ->name('recipe-calendar.destroy');
        Route::get('/api/recipe-calendar', [\App\Http\Controllers\RecipeCalendarController::class, 'index'])
        ->name('recipe-calendar.index');
    });
    
   
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
