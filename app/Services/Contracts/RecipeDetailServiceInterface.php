<?php

namespace App\Services\Contracts;

use App\DataTransferObjects\RecipeDetailDataDTO;
use App\Models\Recipe;

interface RecipeDetailServiceInterface
{
    /**
     * Get recipe detail data for public viewing.
     */
    public function getPublicRecipeDetail(Recipe $recipe): RecipeDetailDataDTO;

    /**
     * Check if recipe can be viewed publicly.
     */
    public function canViewPublicly(Recipe $recipe): bool;
}
