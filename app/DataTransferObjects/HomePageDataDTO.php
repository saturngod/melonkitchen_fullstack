<?php

namespace App\DataTransferObjects;

use App\Models\Category;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

readonly class HomePageDataDTO
{
    public function __construct(
        public LengthAwarePaginator $recipes,
        public Collection $categories,
        public ?Category $selectedCategory = null
    ) {}

    public function toArray(): array
    {
        return [
            'recipes' => $this->recipes,
            'categories' => $this->categories,
            'selectedCategory' => $this->selectedCategory,
        ];
    }
}
