<?php

namespace App\Http\Controllers\Main;

use App\DataTransferObjects\HomePageFiltersDTO;
use App\Http\Controllers\Controller;
use App\Models\Recipe;
use App\Services\Contracts\HomePageServiceInterface;
use App\Services\Contracts\RecipeDetailServiceInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __construct(
        private readonly HomePageServiceInterface $homePageService,
        private readonly RecipeDetailServiceInterface $recipeDetailService
    ) {}

    public function index(Request $request): Response
    {
        $filters = HomePageFiltersDTO::fromRequest($request->all());
        $homePageData = $this->homePageService->getHomePageData($filters);

        return Inertia::render('main/home', $homePageData->toArray());
    }

    public function show(Recipe $recipe): Response
    {
        if (!$this->recipeDetailService->canViewPublicly($recipe)) {
            abort(404);
        }

        $recipeDetailData = $this->recipeDetailService->getPublicRecipeDetail($recipe);

        return Inertia::render('main/public-recipe-show', $recipeDetailData->toArray());
    }
}
