<?php

namespace App\Services;

use App\DataTransferObjects\MyRecipesDataDTO;
use App\DataTransferObjects\MyRecipesFiltersDTO;
use App\Models\User;
use App\Repositories\Contracts\CategoryRepositoryInterface;
use App\Repositories\Contracts\RecipeRepositoryInterface;
use App\Services\Contracts\MyRecipesServiceInterface;

class MyRecipesService implements MyRecipesServiceInterface
{
    public function __construct(
        private RecipeRepositoryInterface $recipeRepository,
        private CategoryRepositoryInterface $categoryRepository,
    ) {}

    public function getMyRecipesData(User $user, MyRecipesFiltersDTO $filters): MyRecipesDataDTO
    {
        // Get user's recipes with filters
        $recipesQuery = $this->recipeRepository->getUserRecipesQuery($user);

        // Apply category filter if specified
        if ($filters->category) {
            $category = $this->categoryRepository->findBySlug($filters->category);
            if ($category) {
                $categoryIds = [$category->id];
                if ($category->children()->exists()) {
                    $categoryIds = array_merge($categoryIds, $category->children->pluck('id')->toArray());
                }
                
                $recipesQuery->whereHas('categories', function ($query) use ($categoryIds) {
                    $query->whereIn('categories.id', $categoryIds);
                });
            }
        }

        // Apply visibility filter if specified
        if ($filters->visibility === 'public') {
            $recipesQuery->where('is_public', true);
        } elseif ($filters->visibility === 'private') {
            $recipesQuery->where('is_public', false);
        }

        // Get paginated recipes
        $recipes = $recipesQuery->with(['user', 'categories', 'tags'])
            ->latest()
            ->paginate($filters->perPage)
            ->withQueryString();

        // Get categories for navigation
        $categories = $this->categoryRepository->getParentCategoriesWithChildren();

        // Get statistics
        $totalRecipes = $this->recipeRepository->getUserRecipesCount($user);
        $publicRecipes = $this->recipeRepository->getUserPublicRecipesCount($user);
        $privateRecipes = $totalRecipes - $publicRecipes;

        return new MyRecipesDataDTO(
            recipes: $recipes,
            categories: $categories,
            totalRecipes: $totalRecipes,
            publicRecipes: $publicRecipes,
            privateRecipes: $privateRecipes,
        );
    }
}
