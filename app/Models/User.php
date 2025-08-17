<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'username',
        'first_name',
        'last_name',
        'is_active',
        'role',
        'avatar_url',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'role' => \App\Enums\UserRole::class,
        ];
    }

    /**
     * Get the recipes created by this user.
     */
    public function recipes(): HasMany
    {
        return $this->hasMany(Recipe::class);
    }

    /**
     * Get the recipe ratings by this user.
     */
    public function recipeRatings(): HasMany
    {
        return $this->hasMany(RecipeRating::class);
    }

    /**
     * Get the recipe calendar entries for this user.
     */
    public function recipeCalendars(): HasMany
    {
        return $this->hasMany(RecipeCalendar::class);
    }

    /**
     * Get the user's favorite recipes through the pivot table.
     */
    public function favoriteRecipes(): BelongsToMany
    {
        return $this->belongsToMany(Recipe::class, 'fav_user_recipes')
            ->withTimestamps();
    }

    /**
     * Get the user's favorite recipe entries.
     */
    public function userRecipes(): HasMany
    {
        return $this->hasMany(UserRecipe::class);
    }
}
