<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\Recipe;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    function index(Request $request) {
        // Get public recipes with relationships
        $recipes = Recipe::with(['user', 'categories.parent', 'tags'])
            ->where('is_public', true)
            ->latest()
            ->paginate(12);
            
        // Get categories for navigation dropdown
        $categories = Category::whereNull('parent_id')
            ->with('children')
            ->orderBy('name')
            ->get();

        return Inertia::render('main/home', [
            'recipes' => $recipes,
            'categories' => $categories,
        ]);
    }
}
