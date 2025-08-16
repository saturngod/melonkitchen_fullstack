<?php

namespace App\Services;

use App\Services\Contracts\SearchServiceInterface;
use App\Repositories\Contracts\RecipeRepositoryInterface;
use App\Repositories\Contracts\CategoryRepositoryInterface;
use App\DataTransferObjects\SearchFiltersDTO;
use App\DataTransferObjects\SearchDataDTO;

class SearchService implements SearchServiceInterface
{
    public function __construct(
        private readonly RecipeRepositoryInterface $recipeRepository,
        private readonly CategoryRepositoryInterface $categoryRepository
    ) {}

    public function search(SearchFiltersDTO $filters): SearchDataDTO
    {
        // Get all categories for navigation
        $categories = $this->categoryRepository->getParentCategoriesWithChildren();

        // Get recipes based on search filters
        $recipes = $this->recipeRepository->searchRecipes($filters);

        return new SearchDataDTO(
            recipes: $recipes,
            categories: $categories,
            filters: $filters,
            totalResults: $recipes->total()
        );
    }
}
