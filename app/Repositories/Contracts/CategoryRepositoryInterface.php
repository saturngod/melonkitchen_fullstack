<?php

namespace App\Repositories\Contracts;

use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;

interface CategoryRepositoryInterface
{
    /**
     * Get all parent categories with their children.
     */
    public function getParentCategoriesWithChildren(): Collection;

    /**
     * Find category by slug.
     */
    public function findBySlug(string $slug): ?Category;

    /**
     * Get category IDs including children.
     */
    public function getCategoryIdsWithChildren(Category $category): array;
}
