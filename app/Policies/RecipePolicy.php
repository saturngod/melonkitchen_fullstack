<?php

namespace App\Policies;

use App\Models\Recipe;
use App\Models\User;
use App\Enums\UserRole;

class RecipePolicy
{
    /**
     * Determine whether the user can view any recipes.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the recipe.
     */
    public function view(User $user, Recipe $recipe): bool
    {
        // Anyone can view public recipes
        if ($recipe->is_public) {
            return true;
        }
        
        // Users can view their own recipes
        return $user->id === $recipe->user_id;
    }

    /**
     * Determine whether the user can create recipes.
     */
    public function create(User $user): bool
    {
        // All authenticated users can create recipes
        return true;
    }

    /**
     * Determine whether the user can update the recipe.
     */
    public function update(User $user, Recipe $recipe): bool
    {
        // Users can update their own recipes, admins can update any recipe
        return $user->id === $recipe->user_id || $user->role === UserRole::ADMIN;
    }

    /**
     * Determine whether the user can delete the recipe.
     */
    public function delete(User $user, Recipe $recipe): bool
    {
        // Users can delete their own recipes, admins can delete any recipe
        return $user->id === $recipe->user_id || $user->role === UserRole::ADMIN;
    }
}
