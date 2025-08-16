<?php

namespace App\DataTransferObjects;

use Illuminate\Support\Collection;

readonly class CalendarDataDTO
{
    public function __construct(
        public Collection $calendarDays,
        public Collection $aggregatedIngredients,
        public Collection $selectedDateRecipes,
        public string $currentView,
        public string $currentDate,
        public array $viewTabs
    ) {}

    public function toArray(): array
    {
        return [
            'calendarDays' => $this->calendarDays,
            'aggregatedIngredients' => $this->aggregatedIngredients,
            'selectedDateRecipes' => $this->selectedDateRecipes,
            'currentView' => $this->currentView,
            'currentDate' => $this->currentDate,
            'viewTabs' => $this->viewTabs,
        ];
    }
}
