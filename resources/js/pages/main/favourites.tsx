import { Head, router } from '@inertiajs/react';
import TopNavigation from '@/components/TopNavigation';
import { Recipe, Category } from '@/types';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import Pagination, { PaginationMeta } from '@/components/ui/pagination';
import { toast } from 'sonner';
import { useState } from 'react';

interface FavouritesPageProps {
    favoriteRecipes: {
        data: Recipe[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
        path: string;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
}

export default function FavouritesPage({ favoriteRecipes }: FavouritesPageProps) {
    const [recipes, setRecipes] = useState(favoriteRecipes.data);

    const handleRemoveFavourite = async (recipeId: string) => {
        try {
            const response = await fetch('/api/user-recipe/toggle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
                },
                body: JSON.stringify({
                    recipe_id: recipeId,
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Remove the recipe from the list
                setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== recipeId));
                toast.success('Recipe removed from favourites');
            } else {
                toast.error('Failed to remove recipe from favourites');
            }
        } catch (error) {
            console.error('Error removing favourite:', error);
            toast.error('Failed to remove recipe from favourites');
        }
    };

    return (
        <>
            <Head title="My Favourites - MelonKitchen" />

            {/* Top Navigation */}
            <TopNavigation categories={[]} />

            {/* Main Content */}
            <div className="min-h-screen bg-background">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-red-50 to-pink-50 py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                            My <span className="text-red-600">Favourites</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Your collection of favorite recipes. Cook what you love!
                        </p>
                    </div>
                </div>

                {/* Recipe List Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Favourite Recipes
                        </h2>
                        <p className="text-gray-600">
                            {favoriteRecipes.total} favourite{favoriteRecipes.total !== 1 ? 's' : ''}
                            {favoriteRecipes.total > 0 && favoriteRecipes.from && favoriteRecipes.to && (
                                <span className="ml-2 text-sm">
                                    (Showing {favoriteRecipes.from}-{favoriteRecipes.to})
                                </span>
                            )}
                        </p>
                    </div>

                    {/* Recipe Grid */}
                    {recipes.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">💝</div>
                            <p className="text-muted-foreground text-lg mb-4">
                                No favourite recipes yet
                            </p>
                            <p className="text-muted-foreground">
                                Explore recipes and save your favorites by clicking the heart button!
                            </p>
                            <Button
                                className="mt-6"
                                onClick={() => router.get('/')}
                            >
                                Discover Recipes
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {recipes.map((recipe) => (
                                <FavouriteRecipeCard
                                    key={recipe.id}
                                    recipe={recipe}
                                    onRemoveFavourite={handleRemoveFavourite}
                                />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {favoriteRecipes.last_page > 1 && (
                        <div className="mt-12 flex justify-center">
                            <Pagination
                                meta={{
                                    current_page: favoriteRecipes.current_page,
                                    last_page: favoriteRecipes.last_page,
                                    from: favoriteRecipes.from,
                                    to: favoriteRecipes.to,
                                    total: favoriteRecipes.total,
                                    per_page: favoriteRecipes.per_page,
                                    path: favoriteRecipes.path,
                                    links: favoriteRecipes.links,
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

// Favourite Recipe Card Component
function FavouriteRecipeCard({
    recipe,
    onRemoveFavourite
}: {
    recipe: Recipe;
    onRemoveFavourite: (id: string) => void;
}) {
    const formatCategories = (categories: Recipe['categories']) => {
        if (!categories || categories.length === 0) return 'No category';

        return categories.map(category => {
            if (category.parent) {
                return `${category.parent.name} | ${category.name}`;
            }
            return category.name;
        }).join(', ');
    };

    const handleCardClick = () => {
        // Navigate to recipe show page (public view)
        router.get(`/recipes/${recipe.id}`);
    };

    const handleRemoveFavourite = () => {
        onRemoveFavourite(recipe.id);
    };

    return (
        <div
            className="h-full flex flex-col relative bg-white rounded-lg shadow-sm border hover:shadow-lg transition-shadow duration-200 cursor-pointer overflow-hidden"
            onClick={handleCardClick}
        >
            {/* Three-dot dropdown menu */}
            <div className="absolute top-2 right-2 z-10">
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 bg-white/80 hover:bg-white"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <span className="sr-only">Open menu</span>
                            ⋮
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onSelect={handleRemoveFavourite}
                            className="text-destructive focus:text-destructive"
                        >
                            Remove Favourite
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Image */}
            <div className="aspect-video bg-muted overflow-hidden">
                {recipe.image_url ? (
                    <img
                        src={recipe.image_url}
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.parentElement!.innerHTML = `
                                <div class="w-full h-full flex items-center justify-center bg-muted">
                                    <span class="text-muted-foreground text-sm">No image</span>
                                </div>
                            `;
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                        <span className="text-muted-foreground text-sm">No image</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col">
                <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">{recipe.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2 leading-relaxed">
                        {recipe.description}
                    </p>
                    <div className="text-sm text-muted-foreground mb-3">
                        {formatCategories(recipe.categories)}
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">
                        By {recipe.user.name}
                    </div>
                </div>

                {/* Tags */}
                {recipe.tags && recipe.tags.length > 0 && (
                    <div className="mt-auto">
                        <div className="flex flex-wrap gap-1">
                            {recipe.tags.map((tag) => (
                                <span
                                    key={tag.id}
                                    className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
                                >
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
