import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Filter, Clock, Users, Star, Eye, EyeOff, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import TopNavigation from '@/components/TopNavigation';
import { Category, Recipe, User, Tag } from '@/types';

interface MyRecipesPageProps {
    recipes: {
        data: Recipe[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    categories: Category[];
    filters: {
        category: string | null;
        visibility: string | null;
        per_page: number;
    };
    totalRecipes: number;
    publicRecipes: number;
    privateRecipes: number;
}

interface RecipeWithRelations extends Recipe {
    user: User;
    categories: Category[];
    tags: Tag[];
}

export default function MyRecipes({
    recipes,
    categories,
    filters,
    totalRecipes,
    publicRecipes,
    privateRecipes
}: MyRecipesPageProps) {
    const handleCategoryFilter = (categorySlug: string | null) => {
        const params: Record<string, any> = {};
        if (categorySlug) params.category = categorySlug;
        if (filters.visibility) params.visibility = filters.visibility;

        router.get('/my-recipes', params);
    };

    const handleVisibilityFilter = (visibility: string | null) => {
        const params: Record<string, any> = {};
        if (filters.category) params.category = filters.category;
        if (visibility) params.visibility = visibility;

        router.get('/my-recipes', params);
    };

    const recipesWithRelations = recipes.data as RecipeWithRelations[];

    return (
        <>
            <Head title="My Recipes - MelonKitchen" />

            {/* Top Navigation */}
            <TopNavigation categories={categories} />

            {/* Main Content */}
            <div className="min-h-screen bg-background">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                            My <span className="text-green-600">Recipes</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Manage and organize your recipe collection. Create, edit, and share your culinary creations.
                        </p>
                        <Button size="lg" asChild>
                            <Link href="/recipes/create">
                                <Plus className="w-5 h-5 mr-2" />
                                Create New Recipe
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Content Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="mb-8">

                        {/* Statistics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <Card className="border-0 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Total Recipes</p>
                                            <p className="text-3xl font-bold text-gray-900">{totalRecipes}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <Filter className="w-6 h-6 text-blue-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-0 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Public Recipes</p>
                                            <p className="text-3xl font-bold text-green-600">{publicRecipes}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                            <Eye className="w-6 h-6 text-green-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-0 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Private Recipes</p>
                                            <p className="text-3xl font-bold text-orange-600">{privateRecipes}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                            <EyeOff className="w-6 h-6 text-orange-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Filters */}
                        <Card className="border-0 shadow-sm">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">Filter Recipes</h3>

                                <div className="space-y-6">
                                    {/* Visibility Filters */}
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-3">Visibility</h4>
                                        <div className="flex flex-wrap gap-2">
                                            <Button
                                                variant={!filters.visibility ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => handleVisibilityFilter(null)}
                                            >
                                                All Recipes
                                            </Button>
                                            <Button
                                                variant={filters.visibility === 'public' ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => handleVisibilityFilter('public')}
                                                className={filters.visibility === 'public' ?
                                                    "bg-green-600 hover:bg-green-700 text-white" :
                                                    "text-green-600 border-green-200 hover:bg-green-50"
                                                }
                                            >
                                                <Eye className="w-3 h-3 mr-1" />
                                                Public
                                            </Button>
                                            <Button
                                                variant={filters.visibility === 'private' ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => handleVisibilityFilter('private')}
                                                className={filters.visibility === 'private' ?
                                                    "bg-orange-600 hover:bg-orange-700 text-white" :
                                                    "text-orange-600 border-orange-200 hover:bg-orange-50"
                                                }
                                            >
                                                <EyeOff className="w-3 h-3 mr-1" />
                                                Private
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Category Filters */}
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-3">Categories</h4>
                                        <div className="flex flex-wrap gap-2">
                                            <Button
                                                variant={!filters.category ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => handleCategoryFilter(null)}
                                            >
                                                All Categories
                                            </Button>
                                            {categories.slice(0, 8).map((category) => (
                                                <Button
                                                    key={category.id}
                                                    variant={filters.category === category.slug ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => handleCategoryFilter(category.slug)}
                                                >
                                                    {category.name}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Results */}
                    {recipesWithRelations.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-6xl mb-6">📚</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                {filters.category || filters.visibility ? 'No recipes found' : 'No recipes yet'}
                            </h3>
                            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                                {filters.category || filters.visibility
                                    ? 'Try adjusting your filters to see more recipes'
                                    : 'Start creating your first recipe to build your collection'
                                }
                            </p>
                            <div className="flex flex-wrap gap-3 justify-center">
                                {(filters.category || filters.visibility) && (
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        onClick={() => router.get('/my-recipes')}
                                    >
                                        Clear Filters
                                    </Button>
                                )}
                                <Button size="lg" asChild>
                                    <Link href="/recipes/create">
                                        <Plus className="w-5 h-5 mr-2" />
                                        Create Recipe
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Recipe Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                                {recipesWithRelations.map((recipe) => (
                                    <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow border-0 shadow-sm pt-0">
                                        <div className="aspect-video bg-muted relative overflow-hidden">
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
                                            {/* Visibility indicator */}
                                            <div className="absolute top-3 right-3">
                                                {recipe.is_public ? (
                                                    <Badge className="bg-green-500 hover:bg-green-600 border-0">
                                                        <Eye className="w-3 h-3 mr-1" />
                                                        Public
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-0">
                                                        <EyeOff className="w-3 h-3 mr-1" />
                                                        Private
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-4 flex-1 flex flex-col">
                                            <div className="flex-1">
                                                <Link
                                                    href={`/recipes/${recipe.id}`}
                                                    className="font-semibold text-lg mb-2 line-clamp-1 hover:text-primary block"
                                                >
                                                    {recipe.title}
                                                </Link>
                                                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                                                    <span>by {recipe.user.name}</span>
                                                    <Link
                                                        href={`/dashboard/recipes/${recipe.id}/edit`}
                                                        className="text-primary hover:underline font-medium"
                                                    >
                                                        Edit
                                                    </Link>
                                                </div>

                                                {recipe.description && (
                                                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
                                                        {recipe.description}
                                                    </p>
                                                )}

                                                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                                                    {recipe.prep_time_minutes && (
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {recipe.prep_time_minutes + (recipe.cook_time_minutes || 0)}m
                                                        </div>
                                                    )}
                                                    {recipe.servings && (
                                                        <div className="flex items-center gap-1">
                                                            <Users className="w-3 h-3" />
                                                            {recipe.servings}
                                                        </div>
                                                    )}
                                                    {recipe.difficulty && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            {recipe.difficulty}
                                                        </Badge>
                                                    )}
                                                </div>

                                                {recipe.categories.length > 0 && (
                                                    <div className="mt-auto">
                                                        <div className="flex flex-wrap gap-1">
                                                            {recipe.categories.slice(0, 2).map((category) => (
                                                                <Badge
                                                                    key={category.id}
                                                                    variant="outline"
                                                                    className="text-xs"
                                                                >
                                                                    {category.name}
                                                                </Badge>
                                                            ))}
                                                            {recipe.categories.length > 2 && (
                                                                <Badge variant="outline" className="text-xs">
                                                                    +{recipe.categories.length - 2}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            {/* Pagination */}
                            {recipes.last_page > 1 && (
                                <Card className="border-0 shadow-sm">
                                    <CardContent className="p-6">
                                        <div className="flex justify-center items-center gap-2">
                                            {recipes.links.map((link, index) => {
                                                if (!link.url) {
                                                    return (
                                                        <span
                                                            key={index}
                                                            className="px-4 py-2 text-muted-foreground"
                                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                                        />
                                                    );
                                                }

                                                return (
                                                    <Link
                                                        key={index}
                                                        href={link.url}
                                                        className={`px-4 py-2 rounded-lg transition-colors ${link.active
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700'
                                                            }`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
