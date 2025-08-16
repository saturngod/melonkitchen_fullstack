<?php

namespace App\DataTransferObjects;

readonly class CalendarDayDTO
{
    public function __construct(
        public string $date,
        public int $day,
        public bool $isCurrentMonth,
        public bool $isToday,
        public bool $isSelected,
        public array $recipes
    ) {}

    public function toArray(): array
    {
        return [
            'date' => $this->date,
            'day' => $this->day,
            'isCurrentMonth' => $this->isCurrentMonth,
            'isToday' => $this->isToday,
            'isSelected' => $this->isSelected,
            'recipes' => $this->recipes,
        ];
    }
}
