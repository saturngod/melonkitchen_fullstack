<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\Recipe;
use App\Services\Contracts\PublicRecipeServiceInterface;
use Inertia\Inertia;
use Inertia\Response;

class MainRecipeController extends Controller
{
    public function __construct(
        private readonly PublicRecipeServiceInterface $publicRecipeService
    ) {}

    /**
     * Display the specified recipe for public viewing.
     */
    public function show(Recipe $recipe): Response
    {
        if (!$this->publicRecipeService->canViewPublicly($recipe)) {
            abort(404);
        }

        $recipeShowData = $this->publicRecipeService->getPublicRecipeShowData($recipe);

        return Inertia::render('main/public-recipe-show', $recipeShowData->toArray());
    }
}
