import { useState, ChangeEvent, useEffect } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Control from '@/components/shared/Control';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import RecipeCard from '@/components/RecipeCard';
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
    const [showDelete, setShowDelete] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const { delete: destroy } = useForm();

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
        router.get(route('recipes.create'));
    }

    function handleTogglePublic(id: string, isPublic: boolean) {
        router.patch(route('recipes.toggle-public', { recipe: id }),
            { is_public: isPublic },
            {
                preserveState: true,
                onError: (errors) => {
                    console.error('Failed to toggle recipe visibility:', errors);
                }
            }
        );
    }

    function handleEdit(id: string) {
        console.log('Edit recipe:', id);
        // Placeholder for future implementation
    }

    function confirmDelete(id: string): void {
        setDeleteId(id);
        setShowDelete(true);
    }

    function handleDelete(): void {
        if (deleteId) {
            destroy(route('recipes.destroy', { recipe: deleteId }), {
                onSuccess: () => setShowDelete(false),
            });
        }
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
                                onDelete={confirmDelete}
                            />
                        ))}
                    </div>

                    <Pagination meta={recipes} />
                </>
            )}

            <ConfirmDialog
                open={showDelete}
                onOpenChange={setShowDelete}
                title="Delete Recipe"
                description="Are you sure you want to delete this recipe? This action cannot be undone."
                onConfirm={handleDelete}
                destructive
            />
        </AppLayout>
    );
}