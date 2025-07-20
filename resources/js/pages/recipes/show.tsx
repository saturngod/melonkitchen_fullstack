import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import RecipeHeader from '@/components/recipe/RecipeHeader';
import RecipeMetadata from '@/components/recipe/RecipeMetadata';
import RecipeIngredients from '@/components/recipe/RecipeIngredients';
import RecipeInstructions from '@/components/recipe/RecipeInstructions';
import RecipeNutrition from '@/components/recipe/RecipeNutrition';
import RecipeActions from '@/components/recipe/RecipeActions';
import RecipeShowSkeleton from '@/components/recipe/RecipeShowSkeleton';
import { Button } from '@/components/ui/button';
import { DetailedRecipe } from '@/types';
import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

interface RecipeShowProps {
    recipe: DetailedRecipe;
}

export default function RecipeShow({ recipe }: RecipeShowProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [networkError, setNetworkError] = useState(false);
    const { errors } = usePage().props;

    // Handle network errors
    useEffect(() => {
        const handleOnline = () => setNetworkError(false);
        const handleOffline = () => setNetworkError(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Check initial network status
        if (!navigator.onLine) {
            setNetworkError(true);
        }

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Handle any server-side errors
    useEffect(() => {
        if (errors && Object.keys(errors).length > 0) {
            setHasError(true);
        }
    }, [errors]);

    const breadcrumbs = [
        { title: 'Recipes', href: '/dashboard/recipes' },
        { title: recipe?.title || 'Recipe', href: `/dashboard/recipes/${recipe?.id || ''}` },
    ];

    // Network error state
    if (networkError) {
        return (
            <AppLayout breadcrumbs={[{ title: 'Recipes', href: '/dashboard/recipes' }]}>
                <Head title="Connection Error" />

                <div className="max-w-2xl mx-auto text-center py-12">
                    <div className="mb-6">
                        <svg className="mx-auto h-24 w-24 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </div>

                    <h1 className="text-2xl font-bold text-foreground mb-4">
                        Connection Error
                    </h1>

                    <p className="text-muted-foreground mb-8 leading-relaxed">
                        Unable to load the recipe due to a network connection issue.
                        Please check your internet connection and try again.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            onClick={() => window.location.reload()}
                            className="flex items-center gap-2"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Retry
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => router.get(route('recipes.index'))}
                            className="flex items-center gap-2"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Recipes
                        </Button>
                    </div>
                </div>
            </AppLayout>
        );
    }

    // Error state
    if (hasError || !recipe) {
        return (
            <AppLayout breadcrumbs={[{ title: 'Recipes', href: '/dashboard/recipes' }]}>
                <Head title="Recipe Not Found" />

                <div className="max-w-2xl mx-auto text-center py-12">
                    <div className="mb-6">
                        <svg className="mx-auto h-24 w-24 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>

                    <h1 className="text-2xl font-bold text-foreground mb-4">
                        Recipe Not Found
                    </h1>

                    <p className="text-muted-foreground mb-8 leading-relaxed">
                        The recipe you're looking for doesn't exist or you don't have permission to view it.
                        It may have been deleted or made private by the author.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            onClick={() => router.get(route('recipes.index'))}
                            className="flex items-center gap-2"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Recipes
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => window.location.reload()}
                            className="flex items-center gap-2"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Try Again
                        </Button>
                    </div>
                </div>
            </AppLayout>
        );
    }

    // Loading state
    if (isLoading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Loading Recipe..." />
                <RecipeShowSkeleton />
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={recipe.title} />

            <div className="max-w-7xl mx-auto">
                {/* Recipe Header Section */}
                <RecipeHeader recipe={recipe} />

                {/* Placeholder sections for detailed components */}
                <div className="space-y-8">
                    {/* Categories and Tags section */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Recipe Information</h2>
                        <RecipeMetadata recipe={recipe} />
                    </div>

                    {/* Ingredients section */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
                        <RecipeIngredients ingredients={recipe.recipeIngredients} />
                    </div>

                    {/* Instructions section */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Instructions</h2>
                        <RecipeInstructions instructions={recipe.instructions} />
                    </div>

                    {/* Nutrition section */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Nutrition Information</h2>
                        <RecipeNutrition nutrition={recipe.nutritionInfo} servings={recipe.servings} />
                    </div>

                    {/* Actions section */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Actions</h2>
                        <RecipeActions recipe={recipe} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}