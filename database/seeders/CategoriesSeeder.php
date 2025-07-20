<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class CategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $markdown = File::get(base_path('PRDs/data/category.md'));
        $lines = explode(PHP_EOL, $markdown);

        $parentCategory = null;

        foreach ($lines as $line) {
            if (empty(trim($line))) {
                continue;
            }

            if (str_starts_with($line, '```markdown') || str_starts_with($line, '```')) {
                continue;
            }

            $trimmedLine = ltrim($line);
            $level = strlen($line) - strlen($trimmedLine);

            $name = trim(str_replace('-', '', $trimmedLine));

            if ($level === 0) {
                $parentCategory = Category::firstOrCreate(
                    ['name' => $name, 'parent_id' => null],
                    ['slug' => Str::slug($name)]
                );
            } else {
                if ($parentCategory) {
                    $slug = Str::slug($parentCategory->name . ' ' . $name);
                    Category::firstOrCreate(
                        ['name' => $name, 'parent_id' => $parentCategory->id],
                        ['slug' => $slug]
                    );
                }
            }
        }
    }
}
