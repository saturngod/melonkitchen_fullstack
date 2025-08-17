import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';

interface CreateIngredientDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export default function CreateIngredientDialog({
    open,
    onOpenChange,
    onSuccess,
}: CreateIngredientDialogProps) {
    const { data, setData, post, reset, processing, errors } = useForm({
        name: '',
        description: '',
        units: '',
    });

    const handleCreate = () => {
        post(route('ingredients.store'), {
            onSuccess: () => {
                onOpenChange(false);
                reset();
                // Call the success callback to refresh the ingredients list
                if (onSuccess) {
                    onSuccess();
                }
            },
        });
    };

    const handleCancel = () => {
        onOpenChange(false);
        reset();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Ingredient</DialogTitle>
                    <DialogDescription>
                        Add a new ingredient that can be used in recipes.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="ingredient-name">Name *</Label>
                        <Input
                            id="ingredient-name"
                            placeholder="e.g., Chicken breast, Olive oil"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className={errors.name ? 'border-destructive' : ''}
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive mt-1">{errors.name}</p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="ingredient-description">Description</Label>
                        <Input
                            id="ingredient-description"
                            placeholder="Brief description of the ingredient"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className={errors.description ? 'border-destructive' : ''}
                        />
                        {errors.description && (
                            <p className="text-sm text-destructive mt-1">{errors.description}</p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="ingredient-units">Units</Label>
                        <Input
                            id="ingredient-units"
                            placeholder="e.g., piece, gram, cup, tablespoon"
                            value={data.units}
                            onChange={(e) => setData('units', e.target.value)}
                            className={errors.units ? 'border-destructive' : ''}
                        />
                        <div className="text-xs text-muted-foreground mt-1">
                            Use comma to separate multiple units (e.g., "piece, gram, kilogram")
                        </div>
                        {errors.units && (
                            <p className="text-sm text-destructive mt-1">{errors.units}</p>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={handleCancel} disabled={processing}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreate}
                        disabled={processing || !data.name.trim()}
                    >
                        {processing ? 'Creating...' : 'Create Ingredient'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
