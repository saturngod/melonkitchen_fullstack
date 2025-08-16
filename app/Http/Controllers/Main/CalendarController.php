<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Services\Contracts\CalendarServiceInterface;
use App\Repositories\Contracts\CategoryRepositoryInterface;
use App\DataTransferObjects\CalendarFiltersDTO;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CalendarController extends Controller
{
    public function __construct(
        private readonly CalendarServiceInterface $calendarService,
        private readonly CategoryRepositoryInterface $categoryRepository
    ) {}

    public function index(Request $request): Response
    {
        $filters = new CalendarFiltersDTO(
            userId: auth()->id(),
            date: $request->get('date', now()->format('Y-m-d')),
            view: $request->get('view', 'month')
        );

        $calendarData = $this->calendarService->getCalendarData($filters);
        $categories = $this->categoryRepository->getParentCategoriesWithChildren();

        return Inertia::render('main/calendar', [
            'calendarData' => $calendarData->toArray(),
            'categories' => $categories
        ]);
    }
}
