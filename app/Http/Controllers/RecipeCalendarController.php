<?php

namespace App\Http\Controllers;

use App\Models\RecipeCalendar;
use App\Models\Recipe;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;

class RecipeCalendarController extends Controller
{
    /**
     * Add a recipe to user's calendar for a specific date.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'recipe_id' => 'required|exists:recipes,id',
                'date' => 'required|date|after_or_equal:today',
            ]);

            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication required'
                ], 401);
            }

            // Check if recipe exists and is public
            $recipe = Recipe::find($validated['recipe_id']);
            if (!$recipe || !$recipe->is_public) {
                return response()->json([
                    'success' => false,
                    'message' => 'Recipe not found or not accessible'
                ], 404);
            }

            // Create or update calendar entry
            $recipeCalendar = RecipeCalendar::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'recipe_id' => $validated['recipe_id'],
                    'date' => Carbon::parse($validated['date'])->format('Y-m-d'),
                ],
                [
                    'user_id' => $user->id,
                    'recipe_id' => $validated['recipe_id'],
                    'date' => Carbon::parse($validated['date'])->format('Y-m-d'),
                ]
            );

            return response()->json([
                'success' => true,
                'message' => 'Recipe added to calendar successfully',
                'data' => [
                    'id' => $recipeCalendar->id,
                    'recipe_title' => $recipe->title,
                    'date' => $recipeCalendar->date->format('Y-m-d'),
                ]
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while adding recipe to calendar'
            ], 500);
        }
    }

    /**
     * Remove a recipe from user's calendar.
     */
    public function destroy(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'recipe_id' => 'required|exists:recipes,id',
                'date' => 'required|date',
            ]);

            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication required'
                ], 401);
            }

            $deleted = RecipeCalendar::where('user_id', $user->id)
                ->where('recipe_id', $validated['recipe_id'])
                ->where('date', Carbon::parse($validated['date'])->format('Y-m-d'))
                ->delete();

            if ($deleted) {
                return response()->json([
                    'success' => true,
                    'message' => 'Recipe removed from calendar successfully'
                ], 200);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Calendar entry not found'
                ], 404);
            }

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while removing recipe from calendar'
            ], 500);
        }
    }

    /**
     * Get user's calendar entries for a specific date range.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
            ]);

            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication required'
                ], 401);
            }

            $query = RecipeCalendar::with(['recipe'])
                ->where('user_id', $user->id);

            if (isset($validated['start_date'])) {
                $query->where('date', '>=', $validated['start_date']);
            }

            if (isset($validated['end_date'])) {
                $query->where('date', '<=', $validated['end_date']);
            }

            $calendarEntries = $query->orderBy('date')->get();

            return response()->json([
                'success' => true,
                'data' => $calendarEntries->map(function ($entry) {
                    return [
                        'id' => $entry->id,
                        'date' => $entry->date->format('Y-m-d'),
                        'recipe' => [
                            'id' => $entry->recipe->id,
                            'title' => $entry->recipe->title,
                            'prep_time_minutes' => $entry->recipe->prep_time_minutes,
                            'cook_time_minutes' => $entry->recipe->cook_time_minutes,
                            'image_url' => $entry->recipe->image_url,
                        ]
                    ];
                })
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching calendar entries'
            ], 500);
        }
    }
}
