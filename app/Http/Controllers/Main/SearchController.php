<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Services\Contracts\SearchServiceInterface;
use App\DataTransferObjects\SearchFiltersDTO;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SearchController extends Controller
{
    public function __construct(
        private readonly SearchServiceInterface $searchService
    ) {}

    public function index(Request $request): Response
    {
        $filters = new SearchFiltersDTO(
            query: $request->get('q', ''),
            category: $request->get('category'),
            perPage: (int) $request->get('per_page', 12)
        );

        $searchData = $this->searchService->search($filters);

        return Inertia::render('main/search', $searchData->toArray());
    }
}
