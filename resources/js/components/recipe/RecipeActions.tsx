import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { DetailedRecipe, Auth } from '@/types';
import { Edit, Trash2, ArrowLeft, Copy } from 'lucide-react';

interface RecipeActionsProps {
    recipe: DetailedRecipe;
}

export default function RecipeActions({ recipe }: RecipeActionsProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const { auth } = usePage<{ auth: Auth }>().props;
    const currentUser = auth.user;

    const canModify = currentUser && (currentUser.id === recipe.user.id);

    const handleEdit = () => {
        router.get(route('recipes.edit', { recipe: recipe.id }));
    };

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(route('recipes.destroy', { recipe: recipe.id }), {
            onSuccess: () => {
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

    const handleCopyLink = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            console.log('Recipe URL copied to clipboard');
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
                <Button
                    variant="outline"
                    onClick={handleBackToRecipes}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Recipes
                </Button>

                {recipe.is_public && (
                    <Button
                        variant="outline"
                        onClick={handleCopyLink}
                        className="flex items-center gap-2"
                    >
                        <Copy className="h-4 w-4" />
                        Copy Link
                    </Button>
                )}
            </div>

            {canModify && (
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
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
            )}

            <div className="pt-4 border-t space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-muted-foreground">Created by:</span>
                        <div className="font-medium">{recipe.user.name}</div>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Visibility:</span>
                        <div className="font-medium">
                            {recipe.is_public ? 'Public' : 'Private'}
                        </div>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Created:</span>
                        <div className="font-medium">
                            {new Date(recipe.created_at).toLocaleDateString()}
                        </div>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Updated:</span>
                        <div className="font-medium">
                            {new Date(recipe.updated_at).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                title="Delete Recipe"
                description={`Are you sure you want to delete "${recipe.title}"? This action cannot be undone and will permanently remove the recipe and all its data.`}
                onConfirm={handleDelete}
                destructive
            />
        </div>
    );
}
