<?php

namespace App\DataTransferObjects;

class MyRecipesFiltersDTO
{
    public function __construct(
        public ?string $category = null,
        public ?string $visibility = null, // 'public', 'private', or null for all
        public int $perPage = 12,
    ) {}

    public function toArray(): array
    {
        return [
            'category' => $this->category,
            'visibility' => $this->visibility,
            'perPage' => $this->perPage,
        ];
    }
}
