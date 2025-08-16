<?php

namespace App\Services;

use App\Services\Contracts\CalendarServiceInterface;
use App\DataTransferObjects\CalendarFiltersDTO;
use App\DataTransferObjects\CalendarDataDTO;
use App\DataTransferObjects\CalendarDayDTO;
use App\Models\RecipeCalendar;
use App\Models\Recipe;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class CalendarService implements CalendarServiceInterface
{
    public function getCalendarData(CalendarFiltersDTO $filters): CalendarDataDTO
    {
        $currentDate = Carbon::parse($filters->date);
        
        $calendarDays = $this->generateCalendarDays($currentDate, $filters);
        $selectedDateRecipes = $this->getRecipesForDate($filters->date, $filters->userId);
        $aggregatedIngredients = $this->getAggregatedIngredients($filters->date, $filters->userId);

        return new CalendarDataDTO(
            calendarDays: $calendarDays,
            aggregatedIngredients: $aggregatedIngredients,
            selectedDateRecipes: $selectedDateRecipes,
            currentView: $filters->view,
            currentDate: $filters->date,
            viewTabs: ['day', 'week', 'month']
        );
    }

    private function generateCalendarDays(Carbon $currentDate, CalendarFiltersDTO $filters): Collection
    {
        switch ($filters->view) {
            case 'day':
                return $this->generateDayView($currentDate, $filters);
            case 'week':
                return $this->generateWeekView($currentDate, $filters);
            case 'month':
            default:
                return $this->generateMonthView($currentDate, $filters);
        }
    }

    private function generateDayView(Carbon $currentDate, CalendarFiltersDTO $filters): Collection
    {
        $dayRecipes = $this->getRecipesForDate($currentDate->format('Y-m-d'), $filters->userId);
        
        return collect([
            new CalendarDayDTO(
                date: $currentDate->format('Y-m-d'),
                day: $currentDate->day,
                isCurrentMonth: true,
                isToday: $currentDate->isToday(),
                isSelected: true,
                recipes: $dayRecipes->take(5)->toArray()
            )
        ]);
    }

    private function generateWeekView(Carbon $currentDate, CalendarFiltersDTO $filters): Collection
    {
        $startOfWeek = $currentDate->copy()->startOfWeek();
        $days = collect();

        for ($i = 0; $i < 7; $i++) {
            $date = $startOfWeek->copy()->addDays($i);
            $dayRecipes = $this->getRecipesForDate($date->format('Y-m-d'), $filters->userId);

            $days->push(new CalendarDayDTO(
                date: $date->format('Y-m-d'),
                day: $date->day,
                isCurrentMonth: $date->month === $currentDate->month,
                isToday: $date->isToday(),
                isSelected: $date->format('Y-m-d') === $filters->date,
                recipes: $dayRecipes->take(5)->toArray()
            ));
        }

        return $days;
    }

    private function generateMonthView(Carbon $currentDate, CalendarFiltersDTO $filters): Collection
    {
        $startOfMonth = $currentDate->copy()->startOfMonth();
        $startOfCalendar = $startOfMonth->copy()->startOfWeek();
        $endOfMonth = $currentDate->copy()->endOfMonth();
        $endOfCalendar = $endOfMonth->copy()->endOfWeek();

        $days = collect();
        $date = $startOfCalendar->copy();

        while ($date <= $endOfCalendar) {
            $dayRecipes = $this->getRecipesForDate($date->format('Y-m-d'), $filters->userId);

            $days->push(new CalendarDayDTO(
                date: $date->format('Y-m-d'),
                day: $date->day,
                isCurrentMonth: $date->month === $currentDate->month,
                isToday: $date->isToday(),
                isSelected: $date->format('Y-m-d') === $filters->date,
                recipes: $dayRecipes->take(5)->toArray()
            ));

            $date->addDay();
        }

        return $days;
    }

    private function getRecipesForDate(string $date, ?string $userId): Collection
    {
        if (!$userId) {
            return collect();
        }

        return RecipeCalendar::with(['recipe.user', 'recipe.categories'])
            ->where('user_id', $userId)
            ->where('date', $date)
            ->get()
            ->map(function ($recipeCalendar) {
                return [
                    'id' => $recipeCalendar->recipe->id,
                    'title' => $recipeCalendar->recipe->title,
                    'slug' => $recipeCalendar->recipe->slug,
                    'prep_time' => $recipeCalendar->recipe->prep_time,
                    'cook_time' => $recipeCalendar->recipe->cook_time,
                    'servings' => $recipeCalendar->recipe->servings,
                    'author' => $recipeCalendar->recipe->user->name,
                    'categories' => $recipeCalendar->recipe->categories->pluck('name')->toArray(),
                ];
            });
    }

    private function getAggregatedIngredients(string $date, ?string $userId): Collection
    {
        if (!$userId) {
            return collect();
        }

        $recipeIds = RecipeCalendar::where('user_id', $userId)
            ->where('date', $date)
            ->pluck('recipe_id');

        if ($recipeIds->isEmpty()) {
            return collect();
        }

        $ingredients = Recipe::whereIn('id', $recipeIds)
            ->with(['recipeIngredients.ingredient', 'recipeIngredients.unit'])
            ->get()
            ->flatMap(function ($recipe) {
                return $recipe->recipeIngredients;
            })
            ->groupBy('ingredient.name')
            ->map(function ($ingredientGroup, $ingredientName) {
                $totalQuantity = $ingredientGroup->sum('quantity');
                $unit = $ingredientGroup->first()->unit?->name ?? '';
                
                return [
                    'name' => $ingredientName,
                    'quantity' => $totalQuantity,
                    'unit' => $unit,
                    'display' => $ingredientName . ' ' . $totalQuantity . ($unit ? ' ' . $unit : ''),
                ];
            })
            ->values();

        return $ingredients;
    }
}
