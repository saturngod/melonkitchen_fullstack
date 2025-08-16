<?php

namespace App\Services;

use App\DataTransferObjects\PublicRecipeShowDataDTO;
use App\Models\Recipe;
use App\Repositories\Contracts\CategoryRepositoryInterface;
use App\Repositories\Contracts\RecipeRepositoryInterface;
use App\Services\Contracts\PublicRecipeServiceInterface;

class PublicRecipeService implements PublicRecipeServiceInterface
{
    public function __construct(
        private readonly RecipeRepositoryInterface $recipeRepository,
        private readonly CategoryRepositoryInterface $categoryRepository
    ) {}

    public function getPublicRecipeShowData(Recipe $recipe): PublicRecipeShowDataDTO
    {
        $recipeWithRelations = $this->loadRecipeRelations($recipe);
        $relatedRecipes = $this->getRelatedRecipes($recipe);
        $categories = $this->getCategoriesForNavigation();

        return new PublicRecipeShowDataDTO(
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
