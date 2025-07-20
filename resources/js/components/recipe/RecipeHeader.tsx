import { useState } from 'react';
import { DetailedRecipe } from '@/types';

interface RecipeHeaderProps {
    recipe: DetailedRecipe;
}

export default function RecipeHeader({ recipe }: RecipeHeaderProps) {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const handleImageError = () => {
        setImageError(true);
        setImageLoading(false);
    };

    const handleImageLoad = () => {
        setImageLoading(false);
    };

    return (
        <div>
            {/* Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Left column - Content */}
                <div className="order-2 lg:order-1 space-y-6">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold leading-tight mb-4">
                            {recipe.title}
                        </h1>

                        {recipe.description && (
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {recipe.description}
                            </p>
                        )}
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {recipe.prep_time_minutes && (
                            <div className="bg-card border rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold">
                                    {recipe.prep_time_minutes}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    min prep
                                </div>
                            </div>
                        )}
                        {recipe.cook_time_minutes && (
                            <div className="bg-card border rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold">
                                    {recipe.cook_time_minutes}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    min cook
                                </div>
                            </div>
                        )}
                        {recipe.servings && (
                            <div className="bg-card border rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold">
                                    {recipe.servings}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    servings
                                </div>
                            </div>
                        )}
                        {recipe.difficulty && (
                            <div className="bg-card border rounded-lg p-4 text-center">
                                <div className="text-lg font-bold capitalize">
                                    {recipe.difficulty}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    difficulty
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Total time and YouTube link */}
                    <div className="flex flex-wrap gap-4 items-center">
                        {(recipe.prep_time_minutes || recipe.cook_time_minutes) && (
                            <div className="bg-primary text-primary-foreground px-6 py-3 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="font-medium">
                                        Total: {(recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0)} min
                                    </span>
                                </div>
                            </div>
                        )}

                        {recipe.youtube_url && (
                            <a
                                href={recipe.youtube_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-2 bg-destructive text-destructive-foreground px-6 py-3 rounded-lg hover:bg-destructive/90 transition-colors"
                            >
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                                <span className="font-medium">Watch Tutorial</span>
                            </a>
                        )}
                    </div>
                </div>

                {/* Right column - Image */}
                <div className="order-1 lg:order-2">
                    <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden border relative">
                        {recipe.image_url && !imageError ? (
                            <>
                                {imageLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
                                    </div>
                                )}
                                <img
                                    src={recipe.image_url}
                                    alt={`${recipe.title} recipe image`}
                                    className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                                    onError={handleImageError}
                                    onLoad={handleImageLoad}
                                    loading="lazy"
                                />
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                                <div className="text-center p-8">
                                    <svg
                                        className="mx-auto h-16 w-16 text-muted-foreground mb-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1}
                                            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                                        />
                                    </svg>
                                    <p className="text-sm font-medium text-muted-foreground">Recipe Image</p>
                                    <p className="text-xs text-muted-foreground mt-1">No image available</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}