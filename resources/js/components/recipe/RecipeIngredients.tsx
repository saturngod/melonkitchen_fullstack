import { RecipeIngredient } from '@/types';

interface RecipeIngredientsProps {
    ingredients: RecipeIngredient[];
}

export default function RecipeIngredients({ ingredients }: RecipeIngredientsProps) {
    if (!ingredients || ingredients.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">No ingredients specified</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-3">
                {ingredients.map((recipeIngredient) => (
                    <div
                        key={recipeIngredient.id}
                        className={`flex items-start gap-4 p-4 rounded-lg border ${recipeIngredient.is_optional
                                ? 'border-dashed border-muted-foreground/30 bg-muted/20'
                                : 'border-border bg-card'
                            }`}
                    >
                        {/* Checkbox for ingredient tracking */}
                        <div className="flex-shrink-0 mt-1">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-border"
                                aria-label={`Mark ${recipeIngredient.ingredient.name} as completed`}
                            />
                        </div>

                        {/* Ingredient details */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 flex-wrap">
                                {/* Quantity and unit */}
                                {recipeIngredient.quantity && (
                                    <span className="font-semibold text-primary">
                                        {recipeIngredient.quantity}
                                        {recipeIngredient.unit && (
                                            <span className="ml-1">
                                                {recipeIngredient.unit.abbreviation || recipeIngredient.unit.name}
                                            </span>
                                        )}
                                    </span>
                                )}

                                {/* Ingredient name */}
                                <span className={`font-medium ${recipeIngredient.is_optional ? 'text-muted-foreground' : 'text-foreground'
                                    }`}>
                                    {recipeIngredient.ingredient.name}
                                </span>

                                {/* Optional indicator */}
                                {recipeIngredient.is_optional && (
                                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                                        Optional
                                    </span>
                                )}
                            </div>

                            {/* Notes */}
                            {recipeIngredient.notes && (
                                <p className="text-sm text-muted-foreground mt-1 italic">
                                    {recipeIngredient.notes}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Ingredients summary */}
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                        Total ingredients: <span className="font-medium">{ingredients.length}</span>
                    </span>
                    <span className="text-muted-foreground">
                        Optional: <span className="font-medium">
                            {ingredients.filter(ing => ing.is_optional).length}
                        </span>
                    </span>
                </div>
            </div>

            {/* Shopping list hint */}
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            Shopping Tip
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                            Check off ingredients as you gather them to keep track of what you need.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}