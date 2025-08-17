<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\Recipe;
use App\Models\Category;
use App\Models\Tag;
use App\Models\Ingredient;
use App\Models\Unit;
use App\Services\Contracts\PublicRecipeServiceInterface;
use App\Http\Controllers\Auth\Concerns\HasRoleBasedRedirect;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MainRecipeController extends Controller
{
    use HasRoleBasedRedirect;

    public function __construct(
        private readonly PublicRecipeServiceInterface $publicRecipeService
    ) {}

    /**
     * Display the specified recipe for public viewing.
     */
    public function show(Recipe $recipe): Response
    {
        if (!$this->publicRecipeService->canViewPublicly($recipe)) {
            abort(404);
        }

        $recipeShowData = $this->publicRecipeService->getPublicRecipeShowData($recipe);

        return Inertia::render('main/public-recipe-show', $recipeShowData->toArray());
    }

    /**
     * Show the form for creating a new recipe using main site layout.
     */
    public function create(): Response
    {
        return Inertia::render('main/recipe-create', [
            'categories' => Category::with(['parent', 'children'])->whereNull('parent_id')->get(),
            'tags' => Tag::where('is_public', true)
                ->orWhere('created_user_id', auth()->id())
                ->get(),
            'ingredients' => Ingredient::with('units')->get(),
            'units' => Unit::all(),
        ]);
    }

    /**
     * Store a newly created recipe.
     */
    public function store(Request $request): RedirectResponse
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
                'is_public' => $validated['is_public'] ?? false,
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
            
            // Always redirect to my-recipes for main site users
            return redirect()->route('my-recipes')->with('success', 'Recipe created successfully!');
            
        } catch (\Exception $e) {
            \DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Failed to create recipe: ' . $e->getMessage()]);
        }
    }

    /**
     * Show the form for editing the specified recipe using main site layout.
     */
    public function edit(Recipe $recipe): Response
    {
        // Check authorization
        $this->authorize('update', $recipe);

        $recipe->load([
            'categories.parent',
            'tags',
            'recipeIngredients.ingredient',
            'recipeIngredients.unit',
            'instructions' => function ($query) {
                $query->orderBy('step_number');
            },
            'nutritionInfo'
        ]);

        return Inertia::render('main/recipe-edit', [
            'recipe' => $recipe,
            'categories' => Category::with(['parent', 'children'])->whereNull('parent_id')->get(),
            'tags' => Tag::where('is_public', true)
                ->orWhere('created_user_id', auth()->id())
                ->get(),
            'ingredients' => Ingredient::with('units')->get(),
            'units' => Unit::all(),
        ]);
    }

    /**
     * Update the specified recipe.
     */
    public function update(Request $request, Recipe $recipe): RedirectResponse
    {
        // Check authorization
        $this->authorize('update', $recipe);

        $validated = $request->validate((new \App\Http\Requests\StoreRecipeRequest())->rules());

        \DB::beginTransaction();
        try {
            // Handle recipe image upload
            $imageUrl = $recipe->image_url;
            if ($request->hasFile('image')) {
                // Delete old image if it exists
                if ($recipe->image_url) {
                    $oldImagePath = str_replace('/storage/', 'public/', $recipe->image_url);
                    \Storage::delete($oldImagePath);
                }
                
                $image = $request->file('image');
                $imagePath = $image->store('public/recipes');
                $imageUrl = \Storage::url($imagePath);
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
                'is_public' => $validated['is_public'] ?? false,
            ]);

            // Update categories
            $recipe->categories()->sync($validated['category_id'] ? [$validated['category_id']] : []);

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
            
            // Always redirect to my-recipes for main site users
            return redirect()->route('my-recipes')->with('success', 'Recipe updated successfully!');
            
        } catch (\Exception $e) {
            \DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Failed to update recipe: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified recipe from storage.
     */
    public function destroy(Recipe $recipe): RedirectResponse
    {
        // Check authorization
        $this->authorize('delete', $recipe);

        try {
            // Delete recipe image if it exists
            if ($recipe->image_url) {
                $imagePath = str_replace('/storage/', 'public/', $recipe->image_url);
                \Storage::delete($imagePath);
            }
            
            // Delete instruction images if they exist
            foreach ($recipe->instructions as $instruction) {
                if ($instruction->image_url) {
                    $instructionImagePath = str_replace('/storage/', 'public/', $instruction->image_url);
                    \Storage::delete($instructionImagePath);
                }
            }
            
            $recipe->delete();
            
            return redirect()->route('my-recipes')->with('success', 'Recipe deleted successfully!');
            
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to delete recipe: ' . $e->getMessage()]);
        }
    }
}
