<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Ingredient;
use App\Models\IngredientUnit;

class IngredientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $query = \App\Models\Ingredient::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                  ->orWhere('description', 'like', "%$search%");
            });
        }

        $ingredients = $query->with(['units'])
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();

        return inertia('ingredient/index', [
            'ingredients' => $ingredients,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'units' => ['required', 'string'], // comma separated
        ]);

        $ingredient = \App\Models\Ingredient::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? '',
        ]);

        $unitNames = array_map('trim', explode(',', $validated['units']));
        $unitIds = [];
        
        foreach ($unitNames as $unitName) {
            if (!empty($unitName)) {
                // Find or create the unit
                $unit = \App\Models\Unit::firstOrCreate(
                    ['name' => $unitName],
                    ['abbreviation' => null, 'unit_type' => 'custom']
                );
                $unitIds[] = $unit->id;
            }
        }
        
        // Attach units to ingredient
        $ingredient->units()->attach($unitIds);

        return redirect()->back()->with('success', 'Ingredient created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $ingredient = \App\Models\Ingredient::findOrFail($id);
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'units' => ['required', 'string'], // comma separated
        ]);

        $ingredient->update([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? '',
        ]);

        // Detach all current units
        $ingredient->units()->detach();
        
        $unitNames = array_map('trim', explode(',', $validated['units']));
        $unitIds = [];
        
        foreach ($unitNames as $unitName) {
            if (!empty($unitName)) {
                // Find or create the unit
                $unit = \App\Models\Unit::firstOrCreate(
                    ['name' => $unitName],
                    ['abbreviation' => null, 'unit_type' => 'custom']
                );
                $unitIds[] = $unit->id;
            }
        }
        
        // Attach new units to ingredient
        $ingredient->units()->attach($unitIds);

        return redirect()->back()->with('success', 'Ingredient updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $ingredient = \App\Models\Ingredient::findOrFail($id);
        $ingredient->units()->detach(); // Remove associations
        $ingredient->delete();
        return redirect()->back()->with('success', 'Ingredient deleted successfully');
    }
}
