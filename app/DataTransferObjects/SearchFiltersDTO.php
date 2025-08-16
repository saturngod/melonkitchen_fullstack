<?php

namespace App\DataTransferObjects;

class SearchFiltersDTO
{
    public function __construct(
        public readonly string $query = '',
        public readonly ?string $category = null,
        public readonly int $perPage = 12
    ) {}

    public function hasQuery(): bool
    {
        return !empty(trim($this->query));
    }

    public function hasCategory(): bool
    {
        return !empty($this->category);
    }

    public function toArray(): array
    {
        return [
            'query' => $this->query,
            'category' => $this->category,
            'per_page' => $this->perPage,
        ];
    }
}
