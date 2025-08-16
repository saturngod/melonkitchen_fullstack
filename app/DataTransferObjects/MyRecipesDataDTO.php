<?php

namespace App\DataTransferObjects;

use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class MyRecipesDataDTO
{
    public function __construct(
        public LengthAwarePaginator $recipes,
        public Collection $categories,
        public int $totalRecipes,
        public int $publicRecipes,
        public int $privateRecipes,
    ) {}

    public function toArray(): array
    {
        return [
            'recipes' => $this->recipes,
            'categories' => $this->categories,
            'totalRecipes' => $this->totalRecipes,
            'publicRecipes' => $this->publicRecipes,
            'privateRecipes' => $this->privateRecipes,
        ];
    }
}
