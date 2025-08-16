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
            <Head title="My Recipes" />

            <div className="min-h-screen bg-gray-50">
                <TopNavigation categories={categories} />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Recipes</h1>
                                <p className="text-gray-600">
                                    Manage and organize your recipe collection
                                </p>
                            </div>
                            <Button asChild>
                                <Link href="/recipes/create">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Recipe
                                </Link>
                            </Button>
                        </div>

                        {/* Statistics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Total Recipes</p>
                                            <p className="text-2xl font-bold text-gray-900">{totalRecipes}</p>
                                        </div>
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <Filter className="w-4 h-4 text-blue-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Public Recipes</p>
                                            <p className="text-2xl font-bold text-green-600">{publicRecipes}</p>
                                        </div>
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <Eye className="w-4 h-4 text-green-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Private Recipes</p>
                                            <p className="text-2xl font-bold text-orange-600">{privateRecipes}</p>
                                        </div>
                                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                            <EyeOff className="w-4 h-4 text-orange-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Filters */}
                        <div className="space-y-4">
                            {/* Visibility Filters */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Visibility</h3>
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
                                        className="text-green-600 border-green-200 hover:bg-green-50"
                                    >
                                        <Eye className="w-3 h-3 mr-1" />
                                        Public
                                    </Button>
                                    <Button
                                        variant={filters.visibility === 'private' ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handleVisibilityFilter('private')}
                                        className="text-orange-600 border-orange-200 hover:bg-orange-50"
                                    >
                                        <EyeOff className="w-3 h-3 mr-1" />
                                        Private
                                    </Button>
                                </div>
                            </div>

                            {/* Category Filters */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
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
                    </div>

                    {/* Results */}
                    {recipesWithRelations.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Plus className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-medium text-gray-900 mb-2">
                                {filters.category || filters.visibility ? 'No recipes found' : 'No recipes yet'}
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {filters.category || filters.visibility
                                    ? 'Try adjusting your filters to see more recipes'
                                    : 'Start creating your first recipe to build your collection'
                                }
                            </p>
                            <div className="space-x-2">
                                {(filters.category || filters.visibility) && (
                                    <Button
                                        variant="outline"
                                        onClick={() => router.get('/my-recipes')}
                                    >
                                        Clear Filters
                                    </Button>
                                )}
                                <Button asChild>
                                    <Link href="/recipes/create">
                                        <Plus className="w-4 h-4 mr-2" />
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
                                    <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                        <div className="aspect-video bg-gray-200 relative">
                                            {recipe.image_url ? (
                                                <img
                                                    src={recipe.image_url}
                                                    alt={recipe.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    No Image
                                                </div>
                                            )}
                                            {/* Visibility indicator */}
                                            <div className="absolute top-2 right-2">
                                                {recipe.is_public ? (
                                                    <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                                                        <Eye className="w-3 h-3 mr-1" />
                                                        Public
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="bg-orange-500 hover:bg-orange-600 text-white">
                                                        <EyeOff className="w-3 h-3 mr-1" />
                                                        Private
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        <CardHeader className="pb-2">
                                            <Link
                                                href={`/recipes/${recipe.id}`}
                                                className="text-lg font-semibold hover:text-primary line-clamp-2"
                                            >
                                                {recipe.title}
                                            </Link>
                                            <div className="flex items-center justify-between text-sm text-gray-600">
                                                <span>by {recipe.user.name}</span>
                                                <Link
                                                    href={`/dashboard/recipes/${recipe.id}/edit`}
                                                    className="text-primary hover:underline"
                                                >
                                                    Edit
                                                </Link>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="pt-0">
                                            {recipe.description && (
                                                <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                                                    {recipe.description}
                                                </p>
                                            )}

                                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
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
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Pagination */}
                            {recipes.last_page > 1 && (
                                <div className="flex justify-center items-center gap-2">
                                    {recipes.links.map((link, index) => {
                                        if (!link.url) {
                                            return (
                                                <span
                                                    key={index}
                                                    className="px-3 py-2 text-gray-400"
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            );
                                        }

                                        return (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                className={`px-3 py-2 rounded ${link.active
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-white border hover:bg-gray-50'
                                                    }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
