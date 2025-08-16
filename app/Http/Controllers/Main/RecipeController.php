<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\Recipe;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RecipeController extends Controller
{
    /**
     * Display the specified public recipe.
     */
    public function show(Recipe $recipe): Response
    {
        // Only show public recipes on the public site
        if (!$recipe->is_public) {
            abort(404);
        }

        // Load relationships
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

        return Inertia::render('main/public-recipe-show', [
            'recipe' => $recipe,
            'relatedRecipes' => $relatedRecipes,
        ]);
    }
}
