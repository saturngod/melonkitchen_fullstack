<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\IngredientUnits;

class Ingredient extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
    ];

    /**
     * Get the units for this ingredient through the pivot table.
     */
    public function units(): BelongsToMany
    {
        return $this->belongsToMany(Unit::class, 'ingredient_units');
    }

    /**
     * Get the ingredient units for this ingredient.
     */
    public function ingredientUnits(): HasMany
    {
        return $this->hasMany(IngredientUnit::class);
    }

    /**
     * Get the recipe ingredients that use this ingredient.
     */
    public function recipeIngredients(): HasMany
    {
        return $this->hasMany(RecipeIngredient::class);
    }
}
