<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\Recipe;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MainRecipeController extends Controller
{
    /**
     * Display the specified recipe for public viewing.
     */
    public function show(Recipe $recipe): Response
    {
        // Only show public recipes on the public site
        if (!$recipe->is_public) {
            abort(404);
        }

        // Load all necessary relationships
        $recipe->load([
            'user',
            'categories',
            'tags',
            'recipeIngredients.ingredient',
            'recipeIngredients.unit',
            'instructions' => function ($query) {
                $query->orderBy('step_number');
            },
            'nutritionInfo'
        ]);

        // Get related recipes from same categories
        $relatedRecipes = Recipe::with(['user', 'categories'])
            ->where('is_public', true)
            ->where('id', '!=', $recipe->id)
            ->whereHas('categories', function ($query) use ($recipe) {
                $query->whereIn('categories.id', $recipe->categories->pluck('id'));
            })
            ->limit(4)
            ->get();

        // Get all categories with their children for navigation
        $categories = Category::with('children')
            ->whereNull('parent_id')
            ->orderBy('name')
            ->get();

        return Inertia::render('main/public-recipe-show', [
            'recipe' => $recipe,
            'relatedRecipes' => $relatedRecipes,
            'categories' => $categories,
        ]);
    }
}
