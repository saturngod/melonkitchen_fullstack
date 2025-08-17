<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // Get recipe statistics
        $totalRecipes = Recipe::count();
        $publicRecipes = Recipe::where('is_public', true)->count();
        $privateRecipes = Recipe::where('is_public', false)->count();

        return Inertia::render('dashboard', [
            'stats' => [
                'totalRecipes' => $totalRecipes,
                'publicRecipes' => $publicRecipes,
                'privateRecipes' => $privateRecipes,
            ]
        ]);
    }
}
