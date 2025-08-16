<?php

namespace App\Repositories\Eloquent;

use App\Models\Recipe;
use App\Repositories\Contracts\RecipeRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class EloquentRecipeRepository implements RecipeRepositoryInterface
{
    public function __construct(private readonly Recipe $model) {}

    public function getPublicRecipesPaginated(
        int $perPage = 12,
        ?array $categoryIds = null,
        array $relations = ['user', 'categories', 'tags']
    ): LengthAwarePaginator {
        $query = $this->model->with($relations)
            ->where('is_public', true);

        if ($categoryIds !== null) {
            $query->whereHas('categories', function ($query) use ($categoryIds) {
                $query->whereIn('categories.id', $categoryIds);
            });
        }

        return $query->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    public function findWithRelations(string $id, array $relations = []): ?Recipe
    {
        return $this->model->with($relations)->find($id);
    }

    public function getRelatedRecipes(
        string $excludeRecipeId,
        array $categoryIds,
        int $limit = 4
    ): Collection {
        return $this->model->with(['user', 'categories'])
            ->where('is_public', true)
            ->where('id', '!=', $excludeRecipeId)
            ->whereHas('categories', function ($query) use ($categoryIds) {
                $query->whereIn('categories.id', $categoryIds);
            })
            ->limit($limit)
            ->get();
    }

    public function isPublic(Recipe $recipe): bool
    {
        return (bool) $recipe->is_public;
    }

    public function searchRecipes(\App\DataTransferObjects\SearchFiltersDTO $filters): LengthAwarePaginator
    {
        $query = $this->model->with(['user', 'categories', 'tags'])
            ->where('is_public', true);

        // Search by query if provided
        if ($filters->hasQuery()) {
            $searchTerm = $filters->query;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', "%{$searchTerm}%")
                  ->orWhere('description', 'like', "%{$searchTerm}%")
                  ->orWhereHas('categories', function ($categoryQuery) use ($searchTerm) {
                      $categoryQuery->where('name', 'like', "%{$searchTerm}%");
                  })
                  ->orWhereHas('tags', function ($tagQuery) use ($searchTerm) {
                      $tagQuery->where('name', 'like', "%{$searchTerm}%");
                  })
                  ->orWhereHas('recipeIngredients.ingredient', function ($ingredientQuery) use ($searchTerm) {
                      $ingredientQuery->where('name', 'like', "%{$searchTerm}%");
                  });
            });
        }

        // Filter by category if provided
        if ($filters->hasCategory()) {
            $category = \App\Models\Category::where('slug', $filters->category)->first();
            if ($category) {
                $categoryIds = [$category->id];
                if ($category->children()->exists()) {
                    $categoryIds = array_merge($categoryIds, $category->children->pluck('id')->toArray());
                }

                $query->whereHas('categories', function ($q) use ($categoryIds) {
                    $q->whereIn('categories.id', $categoryIds);
                });
            }
        }

        return $query->latest()
            ->paginate($filters->perPage)
            ->withQueryString();
    }

    public function getUserRecipesQuery(\App\Models\User $user): \Illuminate\Database\Eloquent\Builder
    {
        return $this->model->where('user_id', $user->id);
    }

    public function getUserRecipesCount(\App\Models\User $user): int
    {
        return $this->model->where('user_id', $user->id)->count();
    }

    public function getUserPublicRecipesCount(\App\Models\User $user): int
    {
        return $this->model->where('user_id', $user->id)
            ->where('is_public', true)
            ->count();
    }
}
