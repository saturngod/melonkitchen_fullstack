<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRecipeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Step 1: Information
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'servings' => 'required|integer|min:1',
            'difficulty' => 'required|in:beginner,easy,medium,hard,expert',
            'prep_time_minutes' => 'required|integer|min:0',
            'cook_time_minutes' => 'required|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'youtube_url' => 'nullable|url',
            
            // Step 2: Category/Tags/Ingredients
            'category_id' => 'required|exists:categories,id',
            'tag_ids' => 'array',
            'tag_ids.*' => 'exists:tags,id',
            'ingredients' => 'required|array|min:1',
            'ingredients.*.ingredient_id' => 'required|exists:ingredients,id',
            'ingredients.*.quantity' => 'required|numeric|min:0',
            'ingredients.*.unit_id' => 'required|exists:units,id',
            'ingredients.*.notes' => 'nullable|string|max:255',
            'ingredients.*.is_optional' => 'boolean',
            
            // Step 3: Instructions
            'instructions' => 'required|array|min:1',
            'instructions.*.instruction' => 'required|string',
            'instructions.*.image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            
            // Step 4: Nutrition (all optional)
            'nutrition.calories' => 'nullable|numeric|min:0',
            'nutrition.protein_g' => 'nullable|numeric|min:0',
            'nutrition.carbs_g' => 'nullable|numeric|min:0',
            'nutrition.fat_g' => 'nullable|numeric|min:0',
            'nutrition.fiber_g' => 'nullable|numeric|min:0',
            'nutrition.sugar_g' => 'nullable|numeric|min:0',
            'nutrition.sodium_mg' => 'nullable|numeric|min:0',
        ];
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Recipe title is required.',
            'description.required' => 'Recipe description is required.',
            'servings.required' => 'Number of servings is required.',
            'servings.min' => 'Servings must be at least 1.',
            'difficulty.required' => 'Difficulty level is required.',
            'difficulty.in' => 'Please select a valid difficulty level.',
            'prep_time_minutes.required' => 'Preparation time is required.',
            'prep_time_minutes.min' => 'Preparation time cannot be negative.',
            'cook_time_minutes.required' => 'Cooking time is required.',
            'cook_time_minutes.min' => 'Cooking time cannot be negative.',
            'image.image' => 'Recipe image must be a valid image file.',
            'image.mimes' => 'Recipe image must be a JPEG, PNG, JPG, or WebP file.',
            'image.max' => 'Recipe image must not exceed 2MB.',
            'youtube_url.url' => 'Please enter a valid YouTube URL.',
            'category_id.required' => 'Please select a category for your recipe.',
            'category_id.exists' => 'Selected category does not exist.',
            'ingredients.required' => 'At least one ingredient is required.',
            'ingredients.min' => 'At least one ingredient is required.',
            'ingredients.*.ingredient_id.required' => 'Please select an ingredient.',
            'ingredients.*.ingredient_id.exists' => 'Selected ingredient does not exist.',
            'ingredients.*.quantity.required' => 'Ingredient quantity is required.',
            'ingredients.*.quantity.min' => 'Ingredient quantity cannot be negative.',
            'ingredients.*.unit_id.required' => 'Please select a unit for the ingredient.',
            'ingredients.*.unit_id.exists' => 'Selected unit does not exist.',
            'instructions.required' => 'At least one instruction step is required.',
            'instructions.min' => 'At least one instruction step is required.',
            'instructions.*.instruction.required' => 'Instruction text is required.',
            'instructions.*.image.image' => 'Instruction image must be a valid image file.',
            'instructions.*.image.mimes' => 'Instruction image must be a JPEG, PNG, JPG, or WebP file.',
            'instructions.*.image.max' => 'Instruction image must not exceed 2MB.',
        ];
    }
}