<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use App\Models\UserRecipe;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;

class UserRecipeController extends Controller
{
    /**
     * Display the user's favorite recipes page.
     */
    public function page(Request $request): Response
    {
        $user = Auth::user();
        
        if (!$user) {
            return redirect()->route('login');
        }

        $favoriteRecipes = $user->favoriteRecipes()
            ->with(['user', 'categories', 'tags'])
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('main/favourites', [
            'favoriteRecipes' => $favoriteRecipes,
        ]);
    }

    /**
     * Toggle a recipe as favorite for the authenticated user.
     */
    public function toggle(Request $request): JsonResponse
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'recipe_id' => 'required|uuid|exists:recipes,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid recipe ID provided.',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated.',
                ], 401);
            }

            $recipeId = $request->input('recipe_id');

            // Check if the recipe exists
            $recipe = Recipe::find($recipeId);
            if (!$recipe) {
                return response()->json([
                    'success' => false,
                    'message' => 'Recipe not found.',
                ], 404);
            }

            // Check if the user has already favorited this recipe
            $existingFavorite = UserRecipe::where('user_id', $user->id)
                ->where('recipe_id', $recipeId)
                ->first();

            if ($existingFavorite) {
                // Remove from favorites
                $existingFavorite->delete();

                return response()->json([
                    'success' => true,
                    'message' => 'Recipe removed from favorites.',
                    'data' => [
                        'is_favorite' => false,
                        'recipe_title' => $recipe->title,
                        'action' => 'removed',
                    ],
                ]);
            } else {
                // Add to favorites
                UserRecipe::create([
                    'user_id' => $user->id,
                    'recipe_id' => $recipeId,
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Recipe added to favorites.',
                    'data' => [
                        'is_favorite' => true,
                        'recipe_title' => $recipe->title,
                        'action' => 'added',
                    ],
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while processing your request.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error',
            ], 500);
        }
    }

    /**
     * Check if a recipe is favorited by the authenticated user.
     */
    public function check(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'recipe_id' => 'required|uuid|exists:recipes,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid recipe ID provided.',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated.',
                ], 401);
            }

            $recipeId = $request->input('recipe_id');

            $isFavorite = UserRecipe::where('user_id', $user->id)
                ->where('recipe_id', $recipeId)
                ->exists();

            return response()->json([
                'success' => true,
                'data' => [
                    'is_favorite' => $isFavorite,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while checking favorite status.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error',
            ], 500);
        }
    }

    /**
     * Get all favorite recipes for the authenticated user.
     */
    public function index(): JsonResponse
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated.',
                ], 401);
            }

            $favoriteRecipes = $user->favoriteRecipes()
                ->with(['user', 'categories', 'tags'])
                ->paginate(12);

            return response()->json([
                'success' => true,
                'data' => $favoriteRecipes,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching favorite recipes.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error',
            ], 500);
        }
    }
}
