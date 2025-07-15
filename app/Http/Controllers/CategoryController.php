<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function __construct(
        private readonly Category $category
    ) {}

    /**
     * Display a listing of categories.
     */
    public function index(Request $request): Response
    {
        $search = $request->get('search', '');

        // Get all categories with their children, filtered by search
        $categoriesQuery = Category::with(['children' => function ($query) use ($search) {
            if ($search) {
                $query->where('name', 'like', "%{$search}%");
            }
            $query->orderBy('name');
        }])
        ->whereNull('parent_id') // Only parent categories
        ->when($search, function ($query, $search) {
            return $query->where('name', 'like', "%{$search}%")
                ->orWhereHas('children', function ($childQuery) use ($search) {
                    $childQuery->where('name', 'like', "%{$search}%");
                });
        })
        ->orderBy('name')
        ->paginate(10)
        ->withQueryString();

        // Get all categories for the combobox (parent selection)
        $allCategories = Category::whereNull('parent_id')
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('categories/index', [
            'categories' => $categoriesQuery,
            'allCategories' => $allCategories,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Store a newly created category.
     */
    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $data = $request->validate([
            'name' => [
                'required', 
                'string', 
                'max:255',
                Rule::unique('categories')->where(function ($query) use ($request) {
                    return $query->where('parent_id', $request->parent_id);
                })
            ],
            'parent_id' => ['nullable', 'exists:categories,id'],
        ], [
            'name.unique' => 'A category with this name already exists' . 
                ($request->parent_id ? ' under the selected parent category.' : ' as a main category.'),
        ]);

        Category::create($data);

        return redirect()->route('categories.index');
    }

    /**
     * Update the specified category.
     */
    public function update(Request $request, string $id): \Illuminate\Http\RedirectResponse
    {
        $category = Category::findOrFail($id);

        $data = $request->validate([
            'name' => [
                'required', 
                'string', 
                'max:255',
                Rule::unique('categories')->where(function ($query) use ($request) {
                    return $query->where('parent_id', $request->parent_id);
                })->ignore($id)
            ],
            'parent_id' => [
                'nullable', 
                'exists:categories,id',
                'not_in:' . $id, // Prevent self-referencing
            ],
        ], [
            'name.unique' => 'A category with this name already exists' . 
                ($request->parent_id ? ' under the selected parent category.' : ' as a main category.'),
            'parent_id.not_in' => 'A category cannot be its own parent.',
        ]);

        // Prevent circular references
        if ($data['parent_id']) {
            $parentCategory = Category::find($data['parent_id']);
            if ($parentCategory && $parentCategory->parent_id === $category->id) {
                return redirect()->back()->withErrors([
                    'parent_id' => 'Cannot create circular reference. The selected parent is already a child of this category.'
                ]);
            }
        }

        $category->update($data);

        return redirect()->route('categories.index');
    }

    /**
     * Remove the specified category.
     */
    public function destroy(string $id): \Illuminate\Http\RedirectResponse
    {
        $category = Category::findOrFail($id);
        
        // Check if category has children
        if ($category->children()->count() > 0) {
            return redirect()->back()->withErrors([
                'delete' => 'Cannot delete category that has subcategories. Please delete or move the subcategories first.'
            ]);
        }

        // Check if category is used by recipes
        if ($category->recipes()->count() > 0) {
            return redirect()->back()->withErrors([
                'delete' => 'Cannot delete category that is being used by recipes.'
            ]);
        }

        $category->delete();

        return redirect()->route('categories.index');
    }
}
