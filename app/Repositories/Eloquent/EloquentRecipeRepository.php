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
}
