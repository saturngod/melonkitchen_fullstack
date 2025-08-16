<?php

namespace App\DataTransferObjects;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class SearchDataDTO
{
    public function __construct(
        public readonly LengthAwarePaginator $recipes,
        public readonly Collection $categories,
        public readonly SearchFiltersDTO $filters,
        public readonly int $totalResults = 0
    ) {}

    public function toArray(): array
    {
        return [
            'recipes' => $this->recipes,
            'categories' => $this->categories,
            'filters' => $this->filters->toArray(),
            'totalResults' => $this->totalResults,
        ];
    }
}
