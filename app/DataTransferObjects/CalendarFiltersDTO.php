<?php

namespace App\DataTransferObjects;

readonly class CalendarFiltersDTO
{
    public function __construct(
        public ?string $userId,
        public string $date,
        public string $view = 'month'
    ) {}
}
