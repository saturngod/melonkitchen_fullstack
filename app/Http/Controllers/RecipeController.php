<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RecipeController extends Controller
{
    public function __construct(
        private readonly Recipe $recipe
    ) {}

    /**
     * Display a listing of recipes.
     */
    public function index(Request $request): Response
    {
        $search = $request->get('search', '');

        // Get recipes with relationships, filtered by search
        $recipesQuery = Recipe::with(['categories.parent', 'tags', 'user'])
            ->when($search, function ($query, $search) {
                return $query->search($search);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('recipes/index', [
            'recipes' => $recipesQuery,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Display the specified recipe.
     */
    public function show(string $id): Response
    {
        $recipe = Recipe::with([
            'categories.parent',
            'tags',
            'user',
            'instructions' => function ($query) {
                $query->orderBy('step_number');
            },
            'nutritionInfo',
            'recipeIngredients.ingredient',
            'recipeIngredients.unit'
        ])->findOrFail($id);

        // Check if user can view this recipe
        if (!$recipe->is_public && $recipe->user_id !== auth()->id()) {
            abort(403, 'Unauthorized to view this recipe');
        }

        return Inertia::render('recipes/show', [
            'recipe' => $recipe
        ]);
    }

    /**
     * Show the form for creating a new recipe.
     */
    public function create(): Response
    {
        return Inertia::render('recipes/create', [
            'categories' => \App\Models\Category::with('parent')->get(),
            'tags' => \App\Models\Tag::where('is_public', true)
                ->orWhere('created_user_id', auth()->id())
                ->get(),
            'ingredients' => \App\Models\Ingredient::with('units')->get(),
            'units' => \App\Models\Unit::all(),
        ]);
    }

    /**
     * Store a newly created recipe.
     */
    public function store(Request $request)
    {
        $validated = $request->validate((new \App\Http\Requests\StoreRecipeRequest())->rules());

        \DB::beginTransaction();
        try {
            // Handle recipe image upload
            $imageUrl = null;
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imagePath = $image->store('public/recipes');
                $imageUrl = \Storage::url($imagePath);
            }

            // Create recipe
            $recipe = Recipe::create([
                'user_id' => auth()->id(),
                'title' => $validated['title'],
                'description' => $validated['description'],
                'servings' => $validated['servings'],
                'difficulty' => $validated['difficulty'],
                'prep_time_minutes' => $validated['prep_time_minutes'],
                'cook_time_minutes' => $validated['cook_time_minutes'],
                'image_url' => $imageUrl,
                'youtube_url' => $validated['youtube_url'] ?? null,
            ]);

            // Attach category
            if (!empty($validated['category_id'])) {
                $recipe->categories()->attach($validated['category_id']);
            }

            // Attach tags
            if (!empty($validated['tag_ids'])) {
                $recipe->tags()->attach($validated['tag_ids']);
            }
            
            // Add ingredients
            foreach ($validated['ingredients'] as $ingredient) {
                
                $recipe->recipeIngredients()->create([
                    'ingredient_id' => $ingredient['ingredient_id'],
                    'quantity' => $ingredient['quantity'],
                    'unit_id' => $ingredient['unit_id'],
                    'notes' => $ingredient['notes'] ?? null,
                    'is_optional' => $ingredient['is_optional'] ?? false,
                ]);
            }

            // Add instructions
            foreach ($validated['instructions'] as $idx => $instruction) {
                $stepImageUrl = null;
                if (isset($instruction['image']) && $instruction['image']) {
                    $stepImage = $instruction['image'];
                    $stepImagePath = $stepImage->store('public/instructions');
                    $stepImageUrl = \Storage::url($stepImagePath);
                }
                $recipe->instructions()->create([
                    'step_number' => $idx + 1,
                    'instruction' => $instruction['instruction'],
                    'image_url' => $stepImageUrl,
                ]);
            }

            // Add nutrition info
            if (!empty($validated['nutrition'])) {
                $nutrition = $validated['nutrition'];
                $recipe->nutritionInfo()->create([
                    'calories_per_serving' => $nutrition['calories'] ?? null,
                    'protein_grams' => $nutrition['protein_g'] ?? null,
                    'carbs_grams' => $nutrition['carbs_g'] ?? null,
                    'fat_grams' => $nutrition['fat_g'] ?? null,
                    'fiber_grams' => $nutrition['fiber_g'] ?? null,
                    'sugar_grams' => $nutrition['sugar_g'] ?? null,
                    'sodium_mg' => $nutrition['sodium_mg'] ?? null,
                ]);
            }

            \DB::commit();
            return redirect()->route('recipes.index')->with('success', 'Recipe created successfully!');
        } catch (\Exception $e) {
            \DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Failed to create recipe: ' . $e->getMessage()]);
        }
    }

    /**
     * Show the form for editing the specified recipe.
     */
    public function edit(string $id): Response
    {
        $recipe = Recipe::with([
            'categories.parent',
            'tags',
            'recipeIngredients.ingredient',
            'recipeIngredients.unit',
            'instructions' => function ($query) {
                $query->orderBy('step_number');
            },
            'nutritionInfo'
        ])->findOrFail($id);

        return Inertia::render('recipes/edit', [
            'recipe' => $recipe,
            'categories' => \App\Models\Category::with('parent')->get(),
            'tags' => \App\Models\Tag::where('is_public', true)
                ->orWhere('created_user_id', auth()->id())
                ->get(),
            'ingredients' => \App\Models\Ingredient::with('units')->get(),
            'units' => \App\Models\Unit::all(),
        ]);
    }

    /**
     * Update the specified recipe.
     */
    public function update(Request $request, string $id)
    {
        $recipe = Recipe::findOrFail($id);
        
        // Ensure user can edit this recipe
        if ($recipe->user_id !== auth()->id()) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate((new \App\Http\Requests\StoreRecipeRequest())->rules());

        \DB::beginTransaction();
        try {
            // Handle recipe image upload
            $imageUrl = $recipe->image_url; // Keep existing image by default
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imagePath = $image->store('public/recipes');
                $imageUrl = \Storage::url($imagePath);
                
                // Delete old image if it exists
                if ($recipe->image_url && \Storage::exists(str_replace('/storage/', 'public/', $recipe->image_url))) {
                    \Storage::delete(str_replace('/storage/', 'public/', $recipe->image_url));
                }
            }

            // Update recipe
            $recipe->update([
                'title' => $validated['title'],
                'description' => $validated['description'],
                'servings' => $validated['servings'],
                'difficulty' => $validated['difficulty'],
                'prep_time_minutes' => $validated['prep_time_minutes'],
                'cook_time_minutes' => $validated['cook_time_minutes'],
                'image_url' => $imageUrl,
                'youtube_url' => $validated['youtube_url'] ?? null,
            ]);

            // Update category
            $recipe->categories()->sync(!empty($validated['category_id']) ? [$validated['category_id']] : []);

            // Update tags
            $recipe->tags()->sync($validated['tag_ids'] ?? []);

            // Update ingredients
            $recipe->recipeIngredients()->delete();
            foreach ($validated['ingredients'] as $ingredient) {
                $recipe->recipeIngredients()->create([
                    'ingredient_id' => $ingredient['ingredient_id'],
                    'quantity' => $ingredient['quantity'],
                    'unit_id' => $ingredient['unit_id'],
                    'notes' => $ingredient['notes'] ?? null,
                    'is_optional' => $ingredient['is_optional'] ?? false,
                ]);
            }

            // Update instructions
            $recipe->instructions()->delete();
            foreach ($validated['instructions'] as $idx => $instruction) {
                $stepImageUrl = null;
                if (isset($instruction['image']) && $instruction['image']) {
                    $stepImage = $instruction['image'];
                    $stepImagePath = $stepImage->store('public/instructions');
                    $stepImageUrl = \Storage::url($stepImagePath);
                }
                $recipe->instructions()->create([
                    'step_number' => $idx + 1,
                    'instruction' => $instruction['instruction'],
                    'image_url' => $stepImageUrl,
                ]);
            }

            // Update nutrition info
            $recipe->nutritionInfo()->delete();
            if (!empty($validated['nutrition'])) {
                $nutrition = $validated['nutrition'];
                $recipe->nutritionInfo()->create([
                    'calories_per_serving' => $nutrition['calories'] ?? null,
                    'protein_grams' => $nutrition['protein_g'] ?? null,
                    'carbs_grams' => $nutrition['carbs_g'] ?? null,
                    'fat_grams' => $nutrition['fat_g'] ?? null,
                    'fiber_grams' => $nutrition['fiber_g'] ?? null,
                    'sugar_grams' => $nutrition['sugar_g'] ?? null,
                    'sodium_mg' => $nutrition['sodium_mg'] ?? null,
                ]);
            }

            \DB::commit();
            return redirect()->route('recipes.index')->with('success', 'Recipe updated successfully!');
        } catch (\Exception $e) {
            \DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Failed to update recipe: ' . $e->getMessage()]);
        }
    }

    /**
     * Toggle the public status of the specified recipe.
     */
    public function togglePublic(Request $request, Recipe $recipe)
    {
        // Check if user can modify this recipe
        if ($recipe->user_id !== auth()->id()) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'is_public' => 'required|boolean',
        ]);

        $recipe->update([
            'is_public' => $validated['is_public'],
        ]);

        return redirect()->back()->with('success', 'Recipe has been updated');
    }

    /**
     * Remove the specified recipe.
     */
    /**
     * Display the specified recipe for public viewing.
     * This method is used for unauthenticated users viewing public recipes.
     */
    public function publicShow(string $id): Response
    {
        $recipe = Recipe::with([
            'categories.parent',
            'tags',
            'user',
            'instructions' => function ($query) {
                $query->orderBy('step_number');
            },
            'nutritionInfo',
            'recipeIngredients.ingredient',
            'recipeIngredients.unit'
        ])->findOrFail($id);

        // Only show public recipes for this route
        if (!$recipe->is_public) {
            abort(404, 'Recipe not found');
        }

        // Get categories for navigation dropdown
        $categories = \App\Models\Category::whereNull('parent_id')
            ->with('children')
            ->orderBy('name')
            ->get();

        return Inertia::render('Main/RecipeShow', [
            'recipe' => $recipe,
            'categories' => $categories,
        ]);
    }

    public function destroy(string $id)
    {
        // Placeholder for future implementation
        $recipe = Recipe::findOrFail($id);
        $recipe->delete();
        return redirect()->route('recipes.index')->with('success', 'Recipe deleted successfully!');
    }
}
