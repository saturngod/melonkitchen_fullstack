<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Recipe extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'prep_time_minutes',
        'cook_time_minutes',
        'servings',
        'difficulty',
        'is_public',
        'image_url',
        'youtube_url',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_public' => 'boolean',
            'prep_time_minutes' => 'integer',
            'cook_time_minutes' => 'integer',
            'servings' => 'integer',
        ];
    }

    /**
     * Get the user who created this recipe.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the recipe instructions.
     */
    public function instructions(): HasMany
    {
        return $this->hasMany(RecipeInstruction::class)->orderBy('step_number');
    }

    /**
     * Get the nutrition information.
     */
    public function nutritionInfo(): HasOne
    {
        return $this->hasOne(NutritionInfo::class);
    }

    /**
     * Get the recipe ingredients.
     */
    public function recipeIngredients(): HasMany
    {
        return $this->hasMany(RecipeIngredient::class);
    }

    /**
     * Get the categories for this recipe.
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'recipe_categories');
    }

    /**
     * Get the tags for this recipe.
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'recipe_tags');
    }

    /**
     * Get the ratings for this recipe.
     */
    public function ratings(): HasMany
    {
        return $this->hasMany(RecipeRating::class);
    }

    /**
     * Get the calendar entries for this recipe.
     */
    public function recipeCalendars(): HasMany
    {
        return $this->hasMany(RecipeCalendar::class);
    }

    /**
     * Get the users who have favorited this recipe through the pivot table.
     */
    public function favoritedByUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'fav_user_recipes')
            ->withTimestamps();
    }

    /**
     * Get the user recipe entries for this recipe.
     */
    public function userRecipes(): HasMany
    {
        return $this->hasMany(UserRecipe::class);
    }

    /**
     * Scope a query to search recipes by title.
     */
    public function scopeSearch($query, $search)
    {
        return $query->where('title', 'like', "%{$search}%");
    }
}
