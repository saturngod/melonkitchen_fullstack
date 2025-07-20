<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NutritionInfo extends Model
{
    use HasFactory, HasUuids;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'nutrition_info';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'recipe_id',
        'calories_per_serving',
        'protein_grams',
        'carbs_grams',
        'fat_grams',
        'fiber_grams',
        'sugar_grams',
        'sodium_mg',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'calories_per_serving' => 'decimal:2',
            'protein_grams' => 'decimal:2',
            'carbs_grams' => 'decimal:2',
            'fat_grams' => 'decimal:2',
            'fiber_grams' => 'decimal:2',
            'sugar_grams' => 'decimal:2',
            'sodium_mg' => 'decimal:2',
        ];
    }

    /**
     * Get the recipe that owns this nutrition info.
     */
    public function recipe(): BelongsTo
    {
        return $this->belongsTo(Recipe::class);
    }
}
