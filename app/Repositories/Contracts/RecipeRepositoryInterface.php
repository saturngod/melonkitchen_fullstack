<?php

namespace App\Repositories\Contracts;

use App\Models\Recipe;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface RecipeRepositoryInterface
{
    /**
     * Get public recipes with pagination and optional category filtering.
     */
    public function getPublicRecipesPaginated(
        int $perPage = 12,
        ?array $categoryIds = null,
        array $relations = ['user', 'categories', 'tags']
    ): LengthAwarePaginator;

    /**
     * Find a recipe by ID with relations.
     */
    public function findWithRelations(string $id, array $relations = []): ?Recipe;

    /**
     * Get related recipes by category IDs.
     */
    public function getRelatedRecipes(
        string $excludeRecipeId,
        array $categoryIds,
        int $limit = 4
    ): Collection;

    /**
     * Check if recipe is public.
     */
    public function isPublic(Recipe $recipe): bool;

    /**
     * Search recipes based on filters.
     */
    public function searchRecipes(\App\DataTransferObjects\SearchFiltersDTO $filters): LengthAwarePaginator;

    /**
     * Get user's recipes query builder.
     */
    public function getUserRecipesQuery(\App\Models\User $user): \Illuminate\Database\Eloquent\Builder;

    /**
     * Get total count of user's recipes.
     */
    public function getUserRecipesCount(\App\Models\User $user): int;

    /**
     * Get count of user's public recipes.
     */
    public function getUserPublicRecipesCount(\App\Models\User $user): int;
}
