import React, { useState, ChangeEvent, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Control from '@/components/shared/Control';
import RecipeCard from '@/components/RecipeCard';
import RecipeCardSkeleton from '@/components/RecipeCardSkeleton';
import Pagination, { type PaginationMeta } from '@/components/ui/pagination';
import { Recipe } from '@/types';

interface RecipeIndexProps {
    recipes: {
        data: Recipe[];
    } & PaginationMeta;
    filters: {
        search: string;
    };
}

export default function RecipeIndex({ recipes, filters }: RecipeIndexProps) {
    const [search, setSearch] = useState(filters.search || '');

    // Debounced search functionality
    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            router.get(route('recipes.index'), { search }, {
                preserveState: true,
                replace: true,
            });
        }, 300);

        return () => clearTimeout(delayedSearch);
    }, [search]);

    function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
        setSearch(e.target.value);
    }

    function handleAddRecipe() {
        console.log('Add New Recipe clicked');
        // Placeholder for future navigation to recipe creation form
    }

    function handleTogglePublic(id: string, isPublic: boolean) {
        console.log('Toggle public status for recipe:', id, 'to:', isPublic);
        // Placeholder for future implementation
    }

    function handleEdit(id: string) {
        console.log('Edit recipe:', id);
        // Placeholder for future implementation
    }

    function handleDelete(id: string) {
        console.log('Delete recipe:', id);
        // Placeholder for future implementation
    }

    const breadcrumbs = [
        { title: 'Recipes', href: '/dashboard/recipes' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Recipes" />
            <Control
                searchValue={search}
                onSearchChange={handleSearchChange}
                actionText="Add New Recipe"
                actionEvent={handleAddRecipe}
            />

            {/* Recipe grid */}
            {recipes.data.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">
                        {search ? 'No recipes found matching your search.' : 'No recipes found.'}
                    </p>
                    {search && (
                        <p className="text-sm text-muted-foreground mt-2">
                            Try adjusting your search terms or browse all recipes.
                        </p>
                    )}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                        {recipes.data.map((recipe) => (
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                                onTogglePublic={handleTogglePublic}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>

                    <Pagination meta={recipes} />
                </>
            )}
        </AppLayout>
    );
}