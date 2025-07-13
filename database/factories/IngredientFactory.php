<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Ingredient>
 */
class IngredientFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $ingredients = [
            // Vegetables
            'Tomato', 'Onion', 'Carrot', 'Celery', 'Bell Pepper', 'Garlic', 'Potato', 'Sweet Potato',
            'Broccoli', 'Cauliflower', 'Spinach', 'Lettuce', 'Cucumber', 'Zucchini', 'Eggplant',
            'Mushroom', 'Avocado', 'Corn', 'Green Beans', 'Asparagus', 'Cabbage', 'Kale',
            
            // Proteins
            'Chicken Breast', 'Ground Beef', 'Salmon', 'Shrimp', 'Eggs', 'Tofu', 'Black Beans',
            'Chickpeas', 'Lentils', 'Turkey', 'Pork', 'Tuna', 'Bacon', 'Ham', 'Cod',
            
            // Grains & Starches
            'Rice', 'Pasta', 'Bread', 'Quinoa', 'Oats', 'Barley', 'Couscous', 'Bulgur',
            'Flour', 'Cornstarch', 'Breadcrumbs',
            
            // Dairy
            'Milk', 'Butter', 'Cheese', 'Yogurt', 'Cream', 'Sour Cream', 'Mozzarella',
            'Parmesan', 'Cheddar', 'Feta', 'Cream Cheese',
            
            // Pantry Staples
            'Olive Oil', 'Vegetable Oil', 'Salt', 'Black Pepper', 'Sugar', 'Brown Sugar',
            'Honey', 'Vanilla Extract', 'Baking Powder', 'Baking Soda', 'Vinegar',
            'Soy Sauce', 'Hot Sauce', 'Mayonnaise', 'Mustard', 'Ketchup',
            
            // Herbs & Spices
            'Basil', 'Oregano', 'Thyme', 'Rosemary', 'Parsley', 'Cilantro', 'Dill',
            'Paprika', 'Cumin', 'Chili Powder', 'Garlic Powder', 'Onion Powder',
            'Cinnamon', 'Ginger', 'Turmeric', 'Bay Leaves',
            
            // Fruits
            'Lemon', 'Lime', 'Apple', 'Banana', 'Orange', 'Strawberries', 'Blueberries',
            'Raspberries', 'Grapes', 'Pineapple', 'Mango', 'Coconut',
            
            // Nuts & Seeds
            'Almonds', 'Walnuts', 'Pecans', 'Peanuts', 'Sunflower Seeds', 'Sesame Seeds',
            'Chia Seeds', 'Flaxseeds', 'Pine Nuts',
            
            // Canned/Jarred
            'Tomato Sauce', 'Tomato Paste', 'Coconut Milk', 'Chicken Broth', 'Vegetable Broth',
            'Canned Tomatoes', 'Olives', 'Capers', 'Pickles'
        ];

        $name = $this->faker->randomElement($ingredients);
        
        return [
            'name' => $name,
            'description' => $this->faker->optional(0.7)->sentence(
                $this->faker->numberBetween(6, 12)
            ),
        ];
    }
}
