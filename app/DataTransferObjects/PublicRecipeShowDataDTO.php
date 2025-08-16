<?php

namespace App\DataTransferObjects;

use App\Models\Recipe;
use Illuminate\Database\Eloquent\Collection;

readonly class PublicRecipeShowDataDTO
{
    public function __construct(
        public Recipe $recipe,
        public Collection $relatedRecipes,
        public Collection $categories
    ) {}

    public function toArray(): array
    {
        return [
            'recipe' => $this->recipe,
            'relatedRecipes' => $this->relatedRecipes,
            'categories' => $this->categories,
        ];
    }
}
