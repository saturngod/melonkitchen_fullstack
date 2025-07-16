<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RecipeController extends Controller
{
    public function __construct(
        private readonly Recipe $recipe
    ) {}

    /**
     * Display a listing of recipes.
     */
    public function index(Request $request): Response
    {
        $search = $request->get('search', '');

        // Get recipes with relationships, filtered by search
        $recipesQuery = Recipe::with(['categories.parent', 'tags', 'user'])
            ->when($search, function ($query, $search) {
                return $query->search($search);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('recipes/index', [
            'recipes' => $recipesQuery,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Store a newly created recipe.
     */
    public function store(Request $request)
    {
        // Placeholder for future implementation
    }

    /**
     * Update the specified recipe.
     */
    public function update(Request $request, string $id)
    {
        // Placeholder for future implementation
    }

    /**
     * Remove the specified recipe.
     */
    public function destroy(string $id)
    {
        // Placeholder for future implementation
    }
}