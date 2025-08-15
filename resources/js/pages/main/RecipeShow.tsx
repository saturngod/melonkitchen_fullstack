import { Head } from '@inertiajs/react';
import TopNavigation from '@/components/TopNavigation';
import RecipeHeader from '@/components/recipe/RecipeHeader';
import RecipeMetadata from '@/components/recipe/RecipeMetadata';
import RecipeIngredients from '@/components/recipe/RecipeIngredients';
import RecipeInstructions from '@/components/recipe/RecipeInstructions';
import RecipeNutrition from '@/components/recipe/RecipeNutrition';
import { DetailedRecipe, Category } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface PublicRecipeShowProps {
    recipe: DetailedRecipe;
    categories?: Category[];
}

export default function PublicRecipeShow({ recipe, categories = [] }: PublicRecipeShowProps) {
    const handleBackToHome = () => {
        window.location.href = '/';
    };

    return (
        <>
            <Head title={recipe.title} />

            {/* Top Navigation */}
            <TopNavigation categories={categories} />

            <div className="min-h-screen bg-background">
                {/* Hero Section */}
                <div className="relative">
                    <RecipeHeader recipe={recipe} />
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Back Button */}
                    <div className="mb-8">
                        <Button
                            variant="outline"
                            onClick={handleBackToHome}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Recipe Details */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Recipe Info Card */}
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    Ingredients
                                </h2>
                                <RecipeIngredients ingredients={recipe.recipe_ingredients} />
                            </div>

                            {/* Instructions Card */}
                            <div className="bg-card rounded-lg border shadow-sm p-6">
                                <h2 className="text-lg font-semibold mb-4 flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    Instructions
                                </h2>
                                <RecipeInstructions instructions={recipe.instructions} />
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <div className="space-y-6">
                            {/* Recipe by */}
                            <div className="bg-card rounded-lg border shadow-sm p-6">
                                <h2 className="text-lg font-semibold mb-4">Recipe by</h2>
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="text-primary font-semibold">
                                            {recipe.user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-medium">{recipe.user.name}</p>
                                        <p className="text-sm text-muted-foreground">Recipe Creator</p>
                                    </div>
                                </div>
                            </div>

                            {/* Categories & Tags */}
                            <div className="bg-card rounded-lg border shadow-sm p-6">
                                <h2 className="text-lg font-semibold mb-4">Categories & Tags</h2>
                                <div className="space-y-4">
                                    {recipe.categories && recipe.categories.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground mb-2">Categories</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {recipe.categories.map((category) => (
                                                    <Badge
                                                        key={category.id}
                                                        variant="secondary"
                                                        className="text-xs"
                                                    >
                                                        {category.parent ? `${category.parent.name} > ${category.name}` : category.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {recipe.tags && recipe.tags.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground mb-2">Tags</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {recipe.tags.map((tag) => (
                                                    <Badge
                                                        key={tag.id}
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        {tag.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Nutrition */}
                            {recipe.nutritionInfo && (
                                <div className="bg-card rounded-lg border shadow-sm p-6">
                                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        Nutrition
                                    </h2>
                                    <RecipeNutrition nutrition={recipe.nutritionInfo} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
