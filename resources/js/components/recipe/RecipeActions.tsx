import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { DetailedRecipe, Auth } from '@/types';
import { Edit, Trash2, ArrowLeft } from 'lucide-react';

interface RecipeActionsProps {
    recipe: DetailedRecipe;
}

export default function RecipeActions({ recipe }: RecipeActionsProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const { auth } = usePage<{ auth: Auth }>().props;
    const currentUser = auth.user;

    // Check if current user can edit/delete this recipe
    const canModify = currentUser && (currentUser.id === recipe.user.id);

    const handleEdit = () => {
        // Navigate to edit page (placeholder for now since edit functionality isn't implemented yet)
        console.log('Edit recipe:', recipe.id);
        // router.get(route('recipes.edit', { recipe: recipe.id }));
    };

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(route('recipes.destroy', { recipe: recipe.id }), {
            onSuccess: () => {
                // Redirect to recipes index after successful deletion
                router.get(route('recipes.index'));
            },
            onError: (errors) => {
                console.error('Failed to delete recipe:', errors);
                setIsDeleting(false);
                setShowDeleteDialog(false);
            },
            onFinish: () => {
                setIsDeleting(false);
            }
        });
    };

    const handleBackToRecipes = () => {
        router.get(route('recipes.index'));
    };

    return (
        <div className="space-y-6">
            {/* Navigation Actions */}
            <div>
                <h3 className="text-lg font-medium mb-3">Navigation</h3>
                <Button
                    variant="outline"
                    onClick={handleBackToRecipes}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Recipes
                </Button>
            </div>

            {/* Recipe Management Actions */}
            {canModify && (
                <div>
                    <h3 className="text-lg font-medium mb-3">Recipe Management</h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            onClick={handleEdit}
                            className="flex items-center gap-2"
                        >
                            <Edit className="h-4 w-4" />
                            Edit Recipe
                        </Button>

                        <Button
                            variant="destructive"
                            onClick={() => setShowDeleteDialog(true)}
                            className="flex items-center gap-2"
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete Recipe
                        </Button>
                    </div>
                </div>
            )}

            {/* Recipe Information */}
            <div>
                <h3 className="text-lg font-medium mb-3">Recipe Details</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                        <span>Created by:</span>
                        <span className="font-medium">{recipe.user.name}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Created on:</span>
                        <span>{new Date(recipe.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Last updated:</span>
                        <span>{new Date(recipe.updated_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Visibility:</span>
                        <span className={`font-medium ${recipe.is_public ? 'text-green-600' : 'text-orange-600'}`}>
                            {recipe.is_public ? 'Public' : 'Private'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Share Actions (if public) */}
            {recipe.is_public && (
                <div>
                    <h3 className="text-lg font-medium mb-3">Share Recipe</h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            variant="outline"
                            onClick={() => {
                                const url = window.location.href;
                                navigator.clipboard.writeText(url).then(() => {
                                    // You could add a toast notification here
                                    console.log('Recipe URL copied to clipboard');
                                });
                            }}
                            className="flex items-center gap-2"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy Link
                        </Button>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                title="Delete Recipe"
                description={`Are you sure you want to delete "${recipe.title}"? This action cannot be undone and will permanently remove the recipe and all its data.`}
                onConfirm={handleDelete}
                confirmText={isDeleting ? "Deleting..." : "Delete Recipe"}
                destructive
                disabled={isDeleting}
            />
        </div>
    );
}