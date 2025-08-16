<?php

namespace App\Services\Contracts;

use App\DataTransferObjects\PublicRecipeShowDataDTO;
use App\Models\Recipe;

interface PublicRecipeServiceInterface
{
    /**
     * Get public recipe data with related information for display.
     */
    public function getPublicRecipeShowData(Recipe $recipe): PublicRecipeShowDataDTO;

    /**
     * Check if recipe can be viewed publicly.
     */
    public function canViewPublicly(Recipe $recipe): bool;
}
