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
                <div className="bg-muted rounded-lg p-6 border">
                    <svg className="mx-auto h-12 w-12 text-muted-foreground mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                    </svg>
                    <p className="font-medium">Nutrition information not available</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        No nutritional values have been provided for this recipe.
                    </p>
                </div>
            </div>
        );
    }

    // Nutrition facts data with clean styling
    const nutritionFacts = [
        {
            key: 'calories_per_serving',
            label: 'Calories',
            value: nutrition.calories_per_serving,
            unit: '',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
            )
        },
        {
            key: 'protein_grams',
            label: 'Protein',
            value: nutrition.protein_grams,
            unit: 'g',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            )
        },
        {
            key: 'carbs_grams',
            label: 'Carbohydrates',
            value: nutrition.carbs_grams,
            unit: 'g',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            )
        },
        {
            key: 'fat_grams',
            label: 'Fat',
            value: nutrition.fat_grams,
            unit: 'g',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            )
        },
        {
            key: 'fiber_grams',
            label: 'Fiber',
            value: nutrition.fiber_grams,
            unit: 'g',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            )
        },
        {
            key: 'sugar_grams',
            label: 'Sugar',
            value: nutrition.sugar_grams,
            unit: 'g',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            )
        },
        {
            key: 'sodium_mg',
            label: 'Sodium',
            value: nutrition.sodium_mg,
            unit: 'mg',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        }
    ];

    // Filter out nutrition facts that have values
    const availableNutrition = nutritionFacts.filter(fact =>
        fact.value !== null && fact.value !== undefined && fact.value > 0
    );

    if (availableNutrition.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="bg-muted rounded-lg p-6 border">
                    <p className="font-medium">Nutrition information not available</p>
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
            <Card>
                <CardHeader className="bg-primary text-primary-foreground">
                    <CardTitle className="text-xl">Nutrition Facts</CardTitle>
                    {servings && (
                        <p className="text-sm text-primary-foreground/80">
                            Per serving ({servings} servings total)
                        </p>
                    )}
                </CardHeader>

                <CardContent className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {availableNutrition.map((fact) => (
                            <div
                                key={fact.key}
                                className="bg-muted border rounded-lg p-4 text-center transition-all duration-200 hover:shadow-md hover:scale-105"
                            >
                                <div className="text-muted-foreground mx-auto mb-2">
                                    {fact.icon}
                                </div>
                                <div className="text-2xl font-bold mb-1">
                                    {fact.value}
                                    <span className="text-sm ml-1">{fact.unit}</span>
                                </div>
                                <div className="text-sm font-medium text-muted-foreground">
                                    {fact.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Nutrition Facts Breakdown */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Nutritional Breakdown
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    {/* Calories breakdown if available */}
                    {nutrition.calories_per_serving && (nutrition.protein_grams || nutrition.carbs_grams || nutrition.fat_grams) && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {nutrition.protein_grams && (
                                <div className="text-center">
                                    <div className="text-lg font-bold">
                                        {Math.round((nutrition.protein_grams * 4 / nutrition.calories_per_serving) * 100)}%
                                    </div>
                                    <div className="text-sm text-muted-foreground">from Protein</div>
                                </div>
                            )}
                            {nutrition.carbs_grams && (
                                <div className="text-center">
                                    <div className="text-lg font-bold">
                                        {Math.round((nutrition.carbs_grams * 4 / nutrition.calories_per_serving) * 100)}%
                                    </div>
                                    <div className="text-sm text-muted-foreground">from Carbs</div>
                                </div>
                            )}
                            {nutrition.fat_grams && (
                                <div className="text-center">
                                    <div className="text-lg font-bold">
                                        {Math.round((nutrition.fat_grams * 9 / nutrition.calories_per_serving) * 100)}%
                                    </div>
                                    <div className="text-sm text-muted-foreground">from Fat</div>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Nutrition disclaimer */}
            <div className="bg-muted border rounded-lg p-4">
                <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <p className="text-sm font-medium">
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