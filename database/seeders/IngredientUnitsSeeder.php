<?php

namespace Database\Seeders;

use App\Models\Ingredient;
use App\Models\IngredientUnit;
use App\Models\Unit;
use Illuminate\Database\Seeder;

class IngredientUnitsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ingredientUnits = [
            // Meats, Poultry, Seafood
            '၀က်သား' => ['Kilogram', 'Gram', 'Viss', 'Tical'],
            'ကြက်သား' => ['Kilogram', 'Gram', 'Viss', 'Tical'],
            'အမဲသား' => ['Kilogram', 'Gram', 'Viss', 'Tical'],
            'ဆိတ်သား' => ['Kilogram', 'Gram', 'Viss', 'Tical'],
            'ငါး' => ['Kilogram', 'Gram', 'Viss', 'Tical', 'Piece'],
            'ကင်းမွန်' => ['Kilogram', 'Gram', 'Viss', 'Tical', 'Piece'],
            'ပုဇွန်' => ['Kilogram', 'Gram', 'Viss', 'Tical'],
            'ဂဏန်း' => ['Kilogram', 'Gram', 'Viss', 'Tical', 'Piece'],
            'ပြည်ကြီးငါး' => ['Kilogram', 'Gram', 'Viss', 'Tical', 'Piece'],
            '‌ရေဘဝဲ' => ['Gram', 'Kilogram', 'Viss', 'Tical'],
            'ငါးဖယ်' => ['Kilogram', 'Gram', 'Viss', 'Tical', 'Piece'],
            'ဂုံးမင်း' => ['Kilogram', 'Gram', 'Viss'],
            'ကြက်/၀က်' => ['Kilogram', 'Gram', 'Viss', 'Tical'],
            'ကြက်/၀က်/အမဲ/ဆိတ်' => ['Kilogram', 'Gram', 'Viss', 'Tical'],
            'ပုဇွန်/ရေဘ၀ဲ/ကင်းမွန်' => ['Kilogram', 'Gram', 'Viss', 'Tical'],

            // Vegetables - Bulbs & Roots
            'ကြက်သွန်နီ' => ['Kilogram', 'Gram', 'Piece', 'Round'],
            'ကြက်သွန်ဖြူ' => ['Gram', 'Clove', 'Clove (burmese)', 'Head', 'Bulb'],
            'အာလူး' => ['Kilogram', 'Gram', 'Piece', 'Round'],
            'မုန်လာဥနီ' => ['Kilogram', 'Gram', 'Piece'],
            'ဂျင်း' => ['Gram', 'Piece', 'Slice', 'Inch'],
            'ဂျင်းစိမ်း' => ['Gram', 'Piece', 'Slice', 'Inch'],
            'နနွင်း' => ['Gram', 'Teaspoon', 'Piece', 'Slice'],
            'ပဒဲကော' => ['Gram', 'Piece', 'Slice'],
            'ကန်စွန်းဥ' => ['Kilogram', 'Gram', 'Piece', 'Round'],
            'ပိန်းဥ' => ['Kilogram', 'Gram', 'Piece'],
            'မျှစ်' => ['Kilogram', 'Gram', 'Bunch', 'Piece', 'Can'],
            'ကြာစွယ်' => ['Kilogram', 'Gram', 'Piece'],
            'မုန်လာဥ' => ['Kilogram', 'Gram', 'Piece'],
            'မုန်လာဥဝါ' => ['Kilogram', 'Gram', 'Piece'],
            'စိမ်းစားဥ' => ['Kilogram', 'Gram', 'Piece'],
            'ပီလောပီနံဥ' => ['Kilogram', 'Gram', 'Piece'],
            'ဝဥ' => ['Kilogram', 'Gram', 'Piece'],

            // Vegetables - Leafy Greens
            'ကန်စွန်းရွက်' => ['Gram', 'Bunch'],
            'နံနံပင်' => ['Gram', 'Bunch', 'Sprig'],
            'ကြက်သွန်မြိတ်' => ['Gram', 'Bunch', 'Stalk'],
            'ချဉ်ပေါင်ရွက်' => ['Gram', 'Bunch'],
            'ဆလပ်ရွက်' => ['Gram', 'Head', 'Leaf'],
            'ဂေါ်ဖီထုပ်' => ['Kilogram', 'Gram', 'Head', 'Piece'],
            'ဂေါ်ဖီထုပ် အနီ' => ['Kilogram', 'Gram', 'Head', 'Piece'],
            'ကိုက်လန်ရွက်' => ['Gram', 'Bunch'],
            'မုန်ညင်းစိမ်း' => ['Gram', 'Bunch', 'Kilogram'],
            'မုန်ညင်းဖြူ' => ['Gram', 'Bunch', 'Kilogram'],
            'ဟင်းနုနွယ်' => ['Gram', 'Bunch'],
            'မြင်းခွါရွက်' => ['Gram', 'Bunch'],
            'ပင်စိမ်းရွက်' => ['Gram', 'Bunch', 'Leaf'],
            'ဗမာပင်စိမ်း' => ['Gram', 'Bunch', 'Leaf'],
            'ယိုးဒယားပင်စိမ်း' => ['Gram', 'Bunch', 'Leaf'],
            'ပူစီနံ' => ['Gram', 'Bunch', 'Sprig'],
            'ရှမ်းနံနံ' => ['Gram', 'Bunch', 'Leaf'],
            'ပျဉ်းတော်သိမ်ရွက်' => ['Gram', 'Sprig', 'Bunch'],
            'ဒန့်ဒလွန်ရွက်' => ['Gram', 'Bunch', 'Cup'],
            'ကင်ပွန်းချဉ်ရွက်' => ['Gram', 'Bunch'],
            'ဆူးပုတ်ရွက်' => ['Gram', 'Bunch'],
            'မယ်ဇလီရွက်' => ['Gram', 'Bunch'],
            'ရှောက်ရွက်' => ['Leaf', 'Gram'],
            'မန်ကျည်းရွက်' => ['Gram', 'Bunch', 'Sprig'],

            // Vegetables - Fruits & Gourds
            'ခရမ်းချဉ်သီး' => ['Kilogram', 'Gram', 'Piece', 'Round'],
            'ငရုတ်သီးစိမ်း' => ['Gram', 'Piece'],
            'ငရုတ်ပွ' => ['Kilogram', 'Gram', 'Piece'],
            'ခရမ်းသီး' => ['Kilogram', 'Gram', 'Piece'],
            'ရုံးပတီသီး' => ['Kilogram', 'Gram', 'Piece', 'Bunch'],
            'ကြက်ဟင်းခါးသီး' => ['Kilogram', 'Gram', 'Piece'],
            'သခွါးသီး' => ['Kilogram', 'Gram', 'Piece'],
            'ဘူးသီး' => ['Kilogram', 'Gram', 'Piece'],
            'ရွှေဖရုံသီး' => ['Kilogram', 'Gram', 'Piece', 'Slice'],
            'ဂေါ်ရခါးသီး' => ['Kilogram', 'Gram', 'Piece'],
            'ခဝဲသီး' => ['Kilogram', 'Gram', 'Piece'],
            'သပွတ်သီး' => ['Kilogram', 'Gram', 'Piece'],
            'ပြောင်းဖူး' => ['Piece', 'Ear', 'Gram', 'Kilogram', 'Can'],
            'ပြောင်းဖူးအသေး' => ['Gram', 'Piece', 'Can'],
            'ဒန့်ဒလွန်သီး' => ['Gram', 'Piece', 'Bunch'],

            // Fruits
            'သင်္ဘောသီး' => ['Kilogram', 'Gram', 'Piece'],
            'သံပုရာသီး' => ['Piece', 'Gram', 'Kilogram'],
            'ရှောက်သီး' => ['Piece', 'Gram', 'Kilogram'],
            'မကျည်းသီး' => ['Gram', 'Kilogram', 'Piece', 'Pod', 'Tablespoon'],
            'သလဲသီး' => ['Piece', 'Gram', 'Kilogram'],

            // Legumes & Beans
            'ပဲပြား' => ['Piece', 'Gram', 'Kilogram'],
            'တို့ဟူး' => ['Piece', 'Gram', 'Kilogram'],
            'ပဲပင်ပေါက်' => ['Gram', 'Kilogram', 'Cup'],
            'ပဲတောင့်ရှည်' => ['Gram', 'Kilogram', 'Bunch'],
            'ပဲစောင်းလျားသီး' => ['Gram', 'Kilogram', 'Piece', 'Bunch'],
            'ရွှေပဲသီး' => ['Gram', 'Kilogram', 'Cup'],
            'ကုလားပဲ' => ['Gram', 'Kilogram', 'Cup', 'Can'],
            'ပဲကြီး' => ['Gram', 'Kilogram', 'Cup'],
            'ပဲတီစိမ်း' => ['Gram', 'Kilogram', 'Cup'],
            'ပဲနီလေး' => ['Gram', 'Kilogram', 'Cup'],
            'ပဲပိစပ်' => ['Gram', 'Kilogram', 'Cup'],

            // Mushrooms
            'မှို' => ['Gram', 'Kilogram', 'Piece', 'Pack'],
            'ကောက်ရိုးမှို' => ['Gram', 'Can', 'Pack'],
            'ကြွက်နားရွက်မှို' => ['Gram', 'Piece', 'Pack'],
            'ငွေနှင်းမှို' => ['Gram', 'Pack', 'Bunch'],
            'အပ်မှို' => ['Gram', 'Pack', 'Bunch'],
            'ရှီတာကီမှို' => ['Gram', 'Piece', 'Pack'],
            'မှိုဘုရင်' => ['Gram', 'Kilogram', 'Piece', 'Pack'],

            // Spices, Herbs, Seasoning
            'ဆား' => ['Gram', 'Teaspoon', 'Tablespoon', 'Pinch'],
            'သကြား' => ['Gram', 'Teaspoon', 'Tablespoon', 'Kilogram'],
            'ငံပြာရည်' => ['Milliliter', 'Liter', 'Tablespoon', 'Teaspoon', 'Spoon'],
            'ဆီ' => ['Milliliter', 'Liter', 'Tablespoon', 'Teaspoon', 'Spoon'],
            'ငရုတ်ကောင်း' => ['Gram', 'Teaspoon', 'Tablespoon', 'Whole'],
            'စပါးလင်' => ['Stalk', 'Gram'],
            'သစ်ကြံပိုးခေါက်' => ['Gram', 'Stick', 'Teaspoon'],
            'လေးညှင်းပွင့်' => ['Gram', 'Piece', 'Teaspoon'],
            'ငါးပိ' => ['Gram', 'Kilogram', 'Tablespoon', 'Teaspoon'],
            'ပုဇွန်ခြောက်' => ['Gram', 'Kilogram', 'Cup', 'Tablespoon'],
            'နှမ်း' => ['Gram', 'Tablespoon', 'Teaspoon', 'Cup'],

            // Processed & Others
            'ပဲကြာဇံ' => ['Gram', 'Pack', 'Bunch'],
            'ငါး‌သေတ္တာ' => ['Can'],
            '‌ဆေးဘဲဥ' => ['Piece'],
            'ကြက်ဥ/ဘဲဥ' => ['Piece'],
            'Organic Wild Rocket Leaf' => ['Gram', 'Bunch'],
        ];

        foreach ($ingredientUnits as $ingredientName => $unitNames) {
            $ingredient = Ingredient::where('name', $ingredientName)->first();
            if ($ingredient) {
                foreach ($unitNames as $unitName) {
                    $unit = Unit::where('name', $unitName)->first();
                    if ($unit) {
                        IngredientUnit::firstOrCreate([
                            'ingredient_id' => $ingredient->id,
                            'unit_id' => $unit->id,
                        ]);
                    }
                }
            }
        }
    }
}
