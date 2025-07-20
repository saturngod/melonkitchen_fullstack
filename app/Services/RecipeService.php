<?php

namespace App\Services;

use App\Models\Recipe;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;

class RecipeService
{
    public function __construct(
        private readonly Recipe $recipe
    ) {}

    /**
     * Get paginated recipes with search functionality.
     */
    public function getPaginatedRecipes(string $search = '', int $perPage = 12): LengthAwarePaginator
    {
        return $this->recipe->with(['categories.parent', 'tags', 'user'])
            ->when($search, function ($query, $search) {
                return $query->search($search);
            })
            ->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Get a recipe by ID with all relationships.
     */
    public function getRecipeById(string $id): Recipe
    {
        return $this->recipe->with([
            'categories.parent',
            'tags',
            'user',
            'instructions' => function ($query) {
                $query->orderBy('step_number');
            },
            'nutritionInfo',
            'recipeIngredients.ingredient',
            'recipeIngredients.unit'
        ])->findOrFail($id);
    }

    /**
     * Check if user can view the recipe.
     */
    public function canUserViewRecipe(Recipe $recipe): bool
    {
        return $recipe->is_public || $recipe->user_id === Auth::id();
    }

    /**
     * Check if user can modify the recipe.
     */
    public function canUserModifyRecipe(Recipe $recipe): bool
    {
        return $recipe->user_id === Auth::id();
    }

    /**
     * Get recipe for editing with all relationships.
     */
    public function getRecipeForEdit(string $id): Recipe
    {
        return $this->recipe->with([
            'categories.parent',
            'tags',
            'recipeIngredients.ingredient',
            'recipeIngredients.unit',
            'instructions' => function ($query) {
                $query->orderBy('step_number');
            },
            'nutritionInfo'
        ])->findOrFail($id);
    }
}
