<?php

namespace App\Http\Controllers\Main;

use App\DataTransferObjects\MyRecipesFiltersDTO;
use App\Http\Controllers\Controller;
use App\Services\Contracts\MyRecipesServiceInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MyRecipesController extends Controller
{
    public function __construct(
        private MyRecipesServiceInterface $myRecipesService
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();

        // Create filters from request
        $filters = new MyRecipesFiltersDTO(
            category: $request->get('category'),
            visibility: $request->get('visibility'),
            perPage: (int) $request->get('per_page', 12)
        );

        // Get my recipes data
        $data = $this->myRecipesService->getMyRecipesData($user, $filters);

        return Inertia::render('main/my-recipes', [
            'recipes' => $data->recipes,
            'categories' => $data->categories,
            'totalRecipes' => $data->totalRecipes,
            'publicRecipes' => $data->publicRecipes,
            'privateRecipes' => $data->privateRecipes,
            'filters' => $filters->toArray(),
        ]);
    }
}
