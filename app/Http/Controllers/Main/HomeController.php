<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\Recipe;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(Request $request): Response
    {
        // Get all categories with their children for navigation
        $categories = Category::with('children')
            ->whereNull('parent_id')
            ->orderBy('name')
            ->get();

        // Start with public recipes query
        $recipesQuery = Recipe::with(['user', 'categories', 'tags'])
            ->where('is_public', true);

        // Filter by category if specified
        if ($request->filled('category')) {
            $categorySlug = $request->get('category');
            $category = Category::where('slug', $categorySlug)->first();
            
            if ($category) {
                // Get category and all its children IDs
                $categoryIds = [$category->id];
                if ($category->children()->exists()) {
                    $categoryIds = array_merge($categoryIds, $category->children->pluck('id')->toArray());
                }
                
                $recipesQuery->whereHas('categories', function ($query) use ($categoryIds) {
                    $query->whereIn('categories.id', $categoryIds);
                });
            }
        }

        // Get recipes with pagination
        $recipes = $recipesQuery->latest()
            ->paginate(12)
            ->withQueryString();

        // Get selected category for display
        $selectedCategory = null;
        if ($request->filled('category')) {
            $selectedCategory = Category::where('slug', $request->get('category'))->first();
        }

        return Inertia::render('main/home', [
            'recipes' => $recipes,
            'categories' => $categories,
            'selectedCategory' => $selectedCategory,
        ]);
    }

    public function show(Recipe $recipe): Response
    {
        // Only show public recipes on the public home
        if (!$recipe->is_public) {
            abort(404);
        }

        // Load relationships
        $recipe->load([
            'user',
            'categories',
            'tags',
            'ingredients.ingredient',
            'ingredients.unit',
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

        return Inertia::render('Main/PublicRecipeShow', [
            'recipe' => $recipe,
            'relatedRecipes' => $relatedRecipes,
        ]);
    }
}
