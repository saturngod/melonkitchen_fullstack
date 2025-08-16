<?php

namespace App\Services;

use App\DataTransferObjects\HomePageDataDTO;
use App\DataTransferObjects\HomePageFiltersDTO;
use App\Repositories\Contracts\CategoryRepositoryInterface;
use App\Repositories\Contracts\RecipeRepositoryInterface;
use App\Services\Contracts\HomePageServiceInterface;

class HomePageService implements HomePageServiceInterface
{
    public function __construct(
        private readonly RecipeRepositoryInterface $recipeRepository,
        private readonly CategoryRepositoryInterface $categoryRepository
    ) {}

    public function getHomePageData(HomePageFiltersDTO $filters): HomePageDataDTO
    {
        $categories = $this->getCategoriesForNavigation();
        $selectedCategory = $this->getSelectedCategory($filters);
        $categoryIds = $this->getCategoryIdsForFiltering($selectedCategory);
        $recipes = $this->getFilteredRecipes($filters, $categoryIds);

        return new HomePageDataDTO(
            recipes: $recipes,
            categories: $categories,
            selectedCategory: $selectedCategory
        );
    }

    private function getCategoriesForNavigation()
    {
        return $this->categoryRepository->getParentCategoriesWithChildren();
    }

    private function getSelectedCategory(HomePageFiltersDTO $filters)
    {
        if (!$filters->hasCategoryFilter()) {
            return null;
        }

        return $this->categoryRepository->findBySlug($filters->categorySlug);
    }

    private function getCategoryIdsForFiltering($selectedCategory): ?array
    {
        if ($selectedCategory === null) {
            return null;
        }

        return $this->categoryRepository->getCategoryIdsWithChildren($selectedCategory);
    }

    private function getFilteredRecipes(HomePageFiltersDTO $filters, ?array $categoryIds)
    {
        return $this->recipeRepository->getPublicRecipesPaginated(
            perPage: $filters->perPage,
            categoryIds: $categoryIds
        );
    }
}
