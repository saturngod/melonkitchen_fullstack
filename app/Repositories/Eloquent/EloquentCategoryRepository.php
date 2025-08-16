<?php

namespace App\Repositories\Eloquent;

use App\Models\Category;
use App\Repositories\Contracts\CategoryRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentCategoryRepository implements CategoryRepositoryInterface
{
    public function __construct(private readonly Category $model) {}

    public function getParentCategoriesWithChildren(): Collection
    {
        return $this->model->with('children')
            ->whereNull('parent_id')
            ->orderBy('name')
            ->get();
    }

    public function findBySlug(string $slug): ?Category
    {
        return $this->model->where('slug', $slug)->first();
    }

    public function getCategoryIdsWithChildren(Category $category): array
    {
        $categoryIds = [$category->id];
        
        if ($category->children()->exists()) {
            $categoryIds = array_merge(
                $categoryIds, 
                $category->children->pluck('id')->toArray()
            );
        }
        
        return $categoryIds;
    }
}
