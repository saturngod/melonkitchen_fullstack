import { RecipeIngredient } from '@/types';

interface RecipeIngredientsProps {
    ingredients: RecipeIngredient[];
}

export default function RecipeIngredients({ ingredients }: RecipeIngredientsProps) {
    if (!ingredients || ingredients.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="bg-muted rounded-lg p-6 border">
                    <svg className="mx-auto h-12 w-12 text-muted-foreground mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <p className="font-medium">No ingredients specified</p>
                    <p className="text-sm text-muted-foreground mt-1">This recipe doesn't have any ingredients listed yet.</p>
                </div>
            </div>
        );
    }

    const requiredIngredients = ingredients.filter(ing => !ing.is_optional);
    const optionalIngredients = ingredients.filter(ing => ing.is_optional);

    return (
        <div className="space-y-6">
            {/* Required Ingredients */}
            {requiredIngredients.length > 0 && (
                <div>
                    <h4 className="text-sm font-semibold mb-4 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Required ({requiredIngredients.length})
                    </h4>
                    <div className="space-y-3">
                        {requiredIngredients.map((recipeIngredient) => (
                            <div
                                key={recipeIngredient.id}
                                className="flex items-start space-x-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                            >


                                {/* Ingredient details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-baseline space-x-3 flex-wrap">
                                        {/* Quantity and unit */}
                                        {recipeIngredient.quantity && (
                                            <span className="font-bold text-base">
                                                {recipeIngredient.quantity}
                                                {recipeIngredient.unit && (
                                                    <span className="ml-1 text-sm font-medium">
                                                        {recipeIngredient.unit.abbreviation || recipeIngredient.unit.name}
                                                    </span>
                                                )}
                                            </span>
                                        )}

                                        {/* Ingredient name */}
                                        <span className="font-medium text-sm">
                                            {recipeIngredient.ingredient.name}
                                        </span>
                                    </div>

                                    {/* Notes */}
                                    {recipeIngredient.notes && (
                                        <p className="text-xs text-muted-foreground mt-2 italic bg-muted px-3 py-2 rounded-md">
                                            <svg className="w-3 h-3 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {recipeIngredient.notes}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Optional Ingredients */}
            {optionalIngredients.length > 0 && (
                <div>
                    <h4 className="text-sm font-semibold mb-4 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        Optional ({optionalIngredients.length})
                    </h4>
                    <div className="space-y-3">
                        {optionalIngredients.map((recipeIngredient) => (
                            <div
                                key={recipeIngredient.id}
                                className="flex items-start space-x-4 p-3 rounded-lg border-2 border-dashed bg-card hover:bg-accent/50 transition-colors"
                            >
                                {/* Checkbox for ingredient tracking */}
                                <div className="flex-shrink-0 mt-1">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border"
                                        aria-label={`Mark ${recipeIngredient.ingredient.name} as completed`}
                                    />
                                </div>

                                {/* Ingredient details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-baseline space-x-3 flex-wrap">
                                        {/* Quantity and unit */}
                                        {recipeIngredient.quantity && (
                                            <span className="font-bold text-base">
                                                {recipeIngredient.quantity}
                                                {recipeIngredient.unit && (
                                                    <span className="ml-1 text-sm font-medium">
                                                        {recipeIngredient.unit.abbreviation || recipeIngredient.unit.name}
                                                    </span>
                                                )}
                                            </span>
                                        )}

                                        {/* Ingredient name */}
                                        <span className="font-medium text-sm text-muted-foreground">
                                            {recipeIngredient.ingredient.name}
                                        </span>

                                        {/* Optional indicator */}
                                        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full font-medium">
                                            Optional
                                        </span>
                                    </div>

                                    {/* Notes */}
                                    {recipeIngredient.notes && (
                                        <p className="text-xs text-muted-foreground mt-2 italic bg-muted px-3 py-2 rounded-md">
                                            <svg className="w-3 h-3 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {recipeIngredient.notes}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Ingredients summary */}
            <div className="bg-muted border rounded-lg p-4">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                        <span className="font-medium">
                            <svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v1a2 2 0 002 2h2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v1a2 2 0 01-2 2H9V9z" />
                            </svg>
                            Total: <span className="font-bold">{ingredients.length}</span> ingredients
                        </span>
                        <span className="font-medium text-muted-foreground">
                            <svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            Optional: <span className="font-bold">{optionalIngredients.length}</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Shopping list hint */}
            <div className="bg-muted border rounded-lg p-4">
                <div className="flex items-start space-x-3">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <div>
                        <p className="text-sm font-medium">
                            Shopping Tip
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Check off ingredients as you gather them to keep track of what you need. Required ingredients are essential for the recipe, while optional ones can enhance the flavor.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}