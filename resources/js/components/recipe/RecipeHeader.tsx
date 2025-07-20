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
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-6">
                {recipe.title}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left column - Image */}
                <div>
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                        {recipe.image_url && !imageError ? (
                            <>
                                {imageLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                    </div>
                                )}
                                <img
                                    src={recipe.image_url}
                                    alt={`${recipe.title} recipe image`}
                                    className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'
                                        }`}
                                    onError={handleImageError}
                                    onLoad={handleImageLoad}
                                    loading="lazy"
                                />
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                                <div className="text-center">
                                    <svg
                                        className="mx-auto h-12 w-12 text-muted-foreground mb-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                                        />
                                    </svg>
                                    <span className="text-sm text-muted-foreground">No image available</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right column - Basic information */}
                <div className="space-y-6">
                    {/* Description */}
                    {recipe.description && (
                        <div>
                            <h3 className="text-lg font-medium mb-2">Description</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {recipe.description}
                            </p>
                        </div>
                    )}

                    {/* Basic recipe info grid */}
                    <div>
                        <h3 className="text-lg font-medium mb-3">Recipe Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {recipe.prep_time_minutes && (
                                <div className="bg-muted/50 p-3 rounded-lg">
                                    <span className="text-sm font-medium text-muted-foreground block">Prep Time</span>
                                    <p className="text-lg font-semibold">{recipe.prep_time_minutes} min</p>
                                </div>
                            )}
                            {recipe.cook_time_minutes && (
                                <div className="bg-muted/50 p-3 rounded-lg">
                                    <span className="text-sm font-medium text-muted-foreground block">Cook Time</span>
                                    <p className="text-lg font-semibold">{recipe.cook_time_minutes} min</p>
                                </div>
                            )}
                            {recipe.servings && (
                                <div className="bg-muted/50 p-3 rounded-lg">
                                    <span className="text-sm font-medium text-muted-foreground block">Servings</span>
                                    <p className="text-lg font-semibold">{recipe.servings}</p>
                                </div>
                            )}
                            {recipe.difficulty && (
                                <div className="bg-muted/50 p-3 rounded-lg">
                                    <span className="text-sm font-medium text-muted-foreground block">Difficulty</span>
                                    <p className="text-lg font-semibold capitalize">{recipe.difficulty}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Total time calculation */}
                    {(recipe.prep_time_minutes || recipe.cook_time_minutes) && (
                        <div className="bg-primary/10 p-4 rounded-lg">
                            <span className="text-sm font-medium text-primary block">Total Time</span>
                            <p className="text-xl font-bold text-primary">
                                {(recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0)} minutes
                            </p>
                        </div>
                    )}

                    {/* YouTube link if available */}
                    {recipe.youtube_url && (
                        <div>
                            <a
                                href={recipe.youtube_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                                Watch on YouTube
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}