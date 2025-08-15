import { Head } from '@inertiajs/react';
import TopNavigation from '@/components/TopNavigation';
import RecipeCard from '@/components/RecipeCard';
import Pagination, { type PaginationMeta } from '@/components/ui/pagination';
import { Recipe, Category } from '@/types';

interface HomePageProps {
    recipes: {
        data: Recipe[];
    } & PaginationMeta;
    categories: Category[];
}

export default function HomePage({ recipes, categories }: HomePageProps) {
    // For public home page, we disable the management features
    const handleTogglePublic = (id: string, isPublic: boolean) => {
        // Do nothing - this is already handled by hiding the controls
        return;
    };

    const handleEdit = (id: string) => {
        // Do nothing - this is already handled by hiding the controls
        return;
    };

    const handleDelete = (id: string) => {
        // Do nothing - this is already handled by hiding the controls
        return;
    };

    return (
        <>
            <Head title="MelonKitchen - Discover Amazing Recipes" />
            
            {/* Top Navigation */}
            <TopNavigation categories={categories} />

            {/* Main Content */}
            <div className="min-h-screen bg-background">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                            Welcome to <span className="text-orange-600">MelonKitchen</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Discover amazing recipes from our community of home cooks. 
                            Find your next favorite dish and share your own culinary creations.
                        </p>
                    </div>
                </div>

                {/* Recipe List Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Latest Recipes</h2>
                        <p className="text-gray-600">
                            {recipes.data.length} of {recipes.total} recipes
                        </p>
                    </div>

                    {/* Recipe Grid */}
                    {recipes.data.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground text-lg">
                                No recipes found. Be the first to share a recipe!
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                                {recipes.data.map((recipe) => (
                                    <PublicRecipeCard
                                        key={recipe.id}
                                        recipe={recipe}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="flex justify-center">
                                <Pagination meta={recipes} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

// Simplified Recipe Card for public view
function PublicRecipeCard({ recipe }: { recipe: Recipe }) {
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
        window.location.href = `/recipes/${recipe.id}`;
    };

    return (
        <div
            className="h-full flex flex-col relative bg-white rounded-lg shadow-sm border hover:shadow-lg transition-shadow duration-200 cursor-pointer overflow-hidden"
            onClick={handleCardClick}
        >
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