<?php

namespace App\Services\Contracts;

use App\DataTransferObjects\CalendarFiltersDTO;
use App\DataTransferObjects\CalendarDataDTO;

interface CalendarServiceInterface
{
    public function getCalendarData(CalendarFiltersDTO $filters): CalendarDataDTO;
}
