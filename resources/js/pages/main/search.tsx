import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Search as SearchIcon, Filter, Clock, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import TopNavigation from '@/components/TopNavigation';
import { Category, Recipe, User, Tag } from '@/types';

interface SearchPageProps {
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
        query: string;
        category: string | null;
        per_page: number;
    };
    totalResults: number;
}

interface RecipeWithRelations extends Recipe {
    user: User;
    categories: Category[];
    tags: Tag[];
}

export default function Search({ recipes, categories, filters, totalResults }: SearchPageProps) {
    const [searchQuery, setSearchQuery] = React.useState(filters.query);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.get('/search', { q: searchQuery.trim(), category: filters.category });
        }
    };

    const handleCategoryFilter = (categorySlug: string | null) => {
        const params: Record<string, any> = {};
        if (filters.query) params.q = filters.query;
        if (categorySlug) params.category = categorySlug;

        router.get('/search', params);
    };

    const recipesWithRelations = recipes.data as RecipeWithRelations[];

    return (
        <>
            <Head title={`Search${filters.query ? ` - ${filters.query}` : ''}`} />

            <div className="min-h-screen bg-gray-50">
                <TopNavigation categories={categories} />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Search Header */}
                    <div className="mb-8">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {filters.query ? `Search Results for "${filters.query}"` : 'Search Recipes'}
                            </h1>
                            {totalResults > 0 && (
                                <p className="text-gray-600">
                                    Found {totalResults} recipe{totalResults !== 1 ? 's' : ''}
                                </p>
                            )}
                        </div>

                        {/* Search Form */}
                        <form onSubmit={handleSearch} className="mb-6">
                            <div className="flex gap-4">
                                <div className="flex-1 relative">
                                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                    <Input
                                        type="search"
                                        placeholder="Search recipes, ingredients, categories..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Button type="submit">
                                    <SearchIcon className="w-4 h-4 mr-2" />
                                    Search
                                </Button>
                            </div>
                        </form>

                        {/* Category Filters */}
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant={filters.category ? "outline" : "default"}
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

                    {/* Results */}
                    {recipesWithRelations.length === 0 ? (
                        <div className="text-center py-12">
                            <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-gray-900 mb-2">
                                {filters.query ? 'No recipes found' : 'Start searching'}
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {filters.query
                                    ? 'Try adjusting your search terms or browse by category'
                                    : 'Search for recipes by name, ingredients, or categories'
                                }
                            </p>
                            {filters.query && (
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchQuery('');
                                        router.get('/search');
                                    }}
                                >
                                    Clear Search
                                </Button>
                            )}
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
                                        </div>

                                        <CardHeader className="pb-2">
                                            <Link
                                                href={`/recipes/${recipe.id}`}
                                                className="text-lg font-semibold hover:text-primary line-clamp-2"
                                            >
                                                {recipe.title}
                                            </Link>
                                            <p className="text-sm text-gray-600">
                                                by {recipe.user.name}
                                            </p>
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
