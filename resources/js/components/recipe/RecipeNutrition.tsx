import { NutritionInfo } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RecipeNutritionProps {
    nutrition?: NutritionInfo;
    servings?: number;
}

export default function RecipeNutrition({ nutrition, servings }: RecipeNutritionProps) {
    if (!nutrition) {
        return (
            <div className="text-center py-8">
                <div className="bg-muted/30 rounded-lg p-6">
                    <svg className="mx-auto h-12 w-12 text-muted-foreground mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c0 .621-.504 1.125-1.125 1.125H18a2.25 2.25 0 01-2.25-2.25V9.375c0-.621.504-1.125 1.125-1.125H20.25a2.25 2.25 0 012.25 2.25v.75m-12 0v-1.5m12 1.5v-1.5m0 0V9.375a2.25 2.25 0 00-2.25-2.25H15a2.25 2.25 0 00-2.25 2.25v.75m12 1.5V21a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V9.75m12-3V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25" />
                    </svg>
                    <p className="text-muted-foreground">Nutrition information not available</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        The recipe author hasn't provided nutritional data for this recipe.
                    </p>
                </div>
            </div>
        );
    }

    // Define nutrition facts with their display information
    const nutritionFacts = [
        {
            key: 'calories_per_serving',
            label: 'Calories',
            value: nutrition.calories_per_serving,
            unit: 'kcal',
            color: 'text-red-600 dark:text-red-400',
            bgColor: 'bg-red-50 dark:bg-red-950/20',
            borderColor: 'border-red-200 dark:border-red-800'
        },
        {
            key: 'protein_grams',
            label: 'Protein',
            value: nutrition.protein_grams,
            unit: 'g',
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-50 dark:bg-blue-950/20',
            borderColor: 'border-blue-200 dark:border-blue-800'
        },
        {
            key: 'carbs_grams',
            label: 'Carbohydrates',
            value: nutrition.carbs_grams,
            unit: 'g',
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-50 dark:bg-green-950/20',
            borderColor: 'border-green-200 dark:border-green-800'
        },
        {
            key: 'fat_grams',
            label: 'Fat',
            value: nutrition.fat_grams,
            unit: 'g',
            color: 'text-yellow-600 dark:text-yellow-400',
            bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
            borderColor: 'border-yellow-200 dark:border-yellow-800'
        },
        {
            key: 'fiber_grams',
            label: 'Fiber',
            value: nutrition.fiber_grams,
            unit: 'g',
            color: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-50 dark:bg-purple-950/20',
            borderColor: 'border-purple-200 dark:border-purple-800'
        },
        {
            key: 'sugar_grams',
            label: 'Sugar',
            value: nutrition.sugar_grams,
            unit: 'g',
            color: 'text-pink-600 dark:text-pink-400',
            bgColor: 'bg-pink-50 dark:bg-pink-950/20',
            borderColor: 'border-pink-200 dark:border-pink-800'
        },
        {
            key: 'sodium_mg',
            label: 'Sodium',
            value: nutrition.sodium_mg,
            unit: 'mg',
            color: 'text-orange-600 dark:text-orange-400',
            bgColor: 'bg-orange-50 dark:bg-orange-950/20',
            borderColor: 'border-orange-200 dark:border-orange-800'
        }
    ];

    // Filter out nutrition facts that have values
    const availableNutrition = nutritionFacts.filter(fact =>
        fact.value !== null && fact.value !== undefined && fact.value > 0
    );

    if (availableNutrition.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="bg-muted/30 rounded-lg p-6">
                    <p className="text-muted-foreground">Nutrition information not available</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        No nutritional values have been provided for this recipe.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Nutrition Facts Label Style */}
            <Card className="max-w-md mx-auto">
                <CardHeader className="text-center pb-2">
                    <CardTitle className="text-xl font-bold">Nutrition Facts</CardTitle>
                    {servings && (
                        <p className="text-sm text-muted-foreground">
                            Per serving ({servings} servings total)
                        </p>
                    )}
                </CardHeader>
                <CardContent className="space-y-3">
                    {availableNutrition.map((fact) => (
                        <div
                            key={fact.key}
                            className={`flex items-center justify-between p-3 rounded-lg border ${fact.bgColor} ${fact.borderColor}`}
                        >
                            <span className="font-medium">{fact.label}</span>
                            <span className={`font-bold text-lg ${fact.color}`}>
                                {fact.value}{fact.unit}
                            </span>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Nutrition Grid for larger displays */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {availableNutrition.map((fact) => (
                    <div
                        key={`grid-${fact.key}`}
                        className={`text-center p-4 rounded-lg border ${fact.bgColor} ${fact.borderColor}`}
                    >
                        <div className={`text-2xl font-bold ${fact.color} mb-1`}>
                            {fact.value}
                            <span className="text-sm ml-1">{fact.unit}</span>
                        </div>
                        <div className="text-sm font-medium text-muted-foreground">
                            {fact.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Nutrition disclaimer */}
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            Nutritional Information Disclaimer
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Nutritional values are estimates and may vary based on cooking methods, ingredient brands, and portion sizes.
                            Consult a nutritionist for precise dietary information.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}