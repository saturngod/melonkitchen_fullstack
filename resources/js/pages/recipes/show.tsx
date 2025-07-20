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

    console.log(recipe)
    console.log(recipe.recipe_ingredients)

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

            <div className="min-h-screen bg-background">
                {/* Hero Section */}
                <div className="bg-card border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <RecipeHeader recipe={recipe} />
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Recipe Sidebar */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Recipe Quick Info Card */}
                            <div className="bg-card rounded-lg border shadow-sm p-6">
                                <h2 className="text-lg font-semibold mb-4 flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Recipe Info
                                </h2>
                                <RecipeMetadata recipe={recipe} />
                            </div>

                            {/* Ingredients Card */}
                            <div className="bg-card rounded-lg border shadow-sm p-6">
                                <h2 className="text-lg font-semibold mb-4 flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v1a2 2 0 002 2h2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v1a2 2 0 01-2 2H9V9z" />
                                    </svg>
                                    Ingredients
                                </h2>
                                <RecipeIngredients ingredients={recipe.recipe_ingredients} />
                            </div>

                            {/* Nutrition Card */}
                            {recipe.nutritionInfo && (
                                <div className="bg-card rounded-lg border shadow-sm p-6">
                                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        Nutrition Facts
                                    </h2>
                                    <RecipeNutrition nutrition={recipe.nutritionInfo} servings={recipe.servings} />
                                </div>
                            )}
                        </div>

                        {/* Right Column - Instructions & Actions */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Instructions Card */}
                            <div className="bg-card rounded-lg border shadow-sm p-6">
                                <h2 className="text-xl font-semibold mb-6 flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                    Cooking Instructions
                                </h2>
                                <RecipeInstructions instructions={recipe.instructions} />
                            </div>

                            {/* Actions Card */}
                            <div className="bg-card rounded-lg border shadow-sm p-6">
                                <h2 className="text-lg font-semibold mb-4 flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Recipe Actions
                                </h2>
                                <RecipeActions recipe={recipe} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}