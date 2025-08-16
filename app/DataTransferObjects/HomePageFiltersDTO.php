<?php

namespace App\DataTransferObjects;

readonly class HomePageFiltersDTO
{
    public function __construct(
        public ?string $categorySlug = null,
        public int $perPage = 12
    ) {}

    public static function fromRequest(array $requestData): self
    {
        return new self(
            categorySlug: $requestData['category'] ?? null,
            perPage: $requestData['per_page'] ?? 12
        );
    }

    public function hasCategoryFilter(): bool
    {
        return $this->categorySlug !== null;
    }
}
