<?php

namespace Database\Seeders;

use App\Models\Ingredient;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class IngredientsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $markdown = File::get(base_path('PRDs/data/ingredient.md'));
        $lines = explode(PHP_EOL, $markdown);

        foreach ($lines as $line) {
            if (empty(trim($line))) {
                continue;
            }

            if (str_starts_with($line, '```markdown') || str_starts_with($line, '```')) {
                continue;
            }

            $name = trim($line);
            Ingredient::firstOrCreate(['name' => $name]);
        }
    }
}
