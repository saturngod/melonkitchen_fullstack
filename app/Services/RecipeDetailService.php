<?php

namespace App\Services;

use App\DataTransferObjects\RecipeDetailDataDTO;
use App\Models\Recipe;
use App\Repositories\Contracts\CategoryRepositoryInterface;
use App\Repositories\Contracts\RecipeRepositoryInterface;
use App\Services\Contracts\RecipeDetailServiceInterface;

class RecipeDetailService implements RecipeDetailServiceInterface
{

    public function __construct(
        private readonly RecipeRepositoryInterface $recipeRepository,
        private readonly CategoryRepositoryInterface $categoryRepository
    ) {}

    public function getPublicRecipeDetail(Recipe $recipe): RecipeDetailDataDTO
    {
        $recipeWithRelations = $this->loadRecipeRelations($recipe);
        $relatedRecipes = $this->getRelatedRecipes($recipe);
        $categories = $this->getCategoriesForNavigation();

        return new RecipeDetailDataDTO(
            recipe: $recipeWithRelations,
            relatedRecipes: $relatedRecipes,
            categories: $categories
        );
    }

    public function canViewPublicly(Recipe $recipe): bool
    {
        return $this->recipeRepository->isPublic($recipe);
    }

    private function loadRecipeRelations(Recipe $recipe): Recipe
    {
        $relations = $this->getRecipeDetailRelations();
        $recipe->load($relations);
        return $recipe;
    }

    private function getRecipeDetailRelations(): array
    {
        return [
            'user',
            'categories',
            'tags',
            'recipeIngredients.ingredient',
            'recipeIngredients.unit',
            'instructions' => function ($query) {
                $query->orderBy('step_number');
            },
            'nutritionInfo'
        ];
    }

    private function getRelatedRecipes(Recipe $recipe)
    {
        $categoryIds = $recipe->categories->pluck('id')->toArray();
        
        return $this->recipeRepository->getRelatedRecipes(
            excludeRecipeId: $recipe->id,
            categoryIds: $categoryIds
        );
    }

    private function getCategoriesForNavigation()
    {
        return $this->categoryRepository->getParentCategoriesWithChildren();
    }
}
