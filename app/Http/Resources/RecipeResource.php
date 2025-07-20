<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RecipeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'prep_time_minutes' => $this->prep_time_minutes,
            'cook_time_minutes' => $this->cook_time_minutes,
            'servings' => $this->servings,
            'difficulty' => $this->difficulty,
            'is_public' => $this->is_public,
            'image_url' => $this->image_url,
            'youtube_url' => $this->youtube_url,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            
            // Relationships (user passed separately, so we don't need it here)
            'categories' => $this->whenLoaded('categories'),
            'tags' => $this->whenLoaded('tags'),
            'instructions' => $this->whenLoaded('instructions'),
            'nutrition_info' => $this->whenLoaded('nutritionInfo'),
            
            // Recipe ingredients with proper structure
            'ingredients' => $this->whenLoaded('recipeIngredients', function () {
                return $this->recipeIngredients->map(function ($recipeIngredient) {
                    return [
                        'id' => $recipeIngredient->id,
                        'ingredient_id' => $recipeIngredient->ingredient_id,
                        'quantity' => $recipeIngredient->quantity,
                        'unit_id' => $recipeIngredient->unit_id,
                        'notes' => $recipeIngredient->notes,
                        'is_optional' => $recipeIngredient->is_optional,
                        'ingredient' => $recipeIngredient->ingredient ?? null,
                        'unit' => $recipeIngredient->unit ?? null,
                    ];
                });
            }),
            
        ];
    }
}
