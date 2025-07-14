import React, { useState, ChangeEvent, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Control from '@/components/shared/Control';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Pagination, { type PaginationMeta } from '@/components/ui/pagination';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
} from '@/components/ui/table';

interface Ingredient {
    id: string;
    name: string;
    description: string;
    units: { id: number; name: string }[];
    created_at: string;
}

interface IngredientIndexProps {
    ingredients: {
        data: Ingredient[];
    } & PaginationMeta;
    filters: {
        search: string;
    };
}

export default function IngredientIndex({ ingredients, filters }: IngredientIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [editingIngredient, setEditingIngredient] = useState<{ id: string; name: string; description: string; units: string } | null>(null);

    const { data, setData, post, reset, delete: destroy, put } = useForm({ name: '', description: '', units: '' });

    // Debounced search functionality
    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            router.get(route('ingredients.index'), { search }, {
                preserveState: true,
                replace: true,
            });
        }, 300);

        return () => clearTimeout(delayedSearch);
    }, [search]);

    function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
        setSearch(e.target.value);
    }

    function handleCreate() {
        post(route('ingredients.store'), {
            onSuccess: () => {
                setShowCreate(false);
                reset();
            },
        });
    }

    function startEdit(ingredient: Ingredient) {
        setEditingIngredient({
            id: ingredient.id,
            name: ingredient.name,
            description: ingredient.description,
            units: ingredient.units.map(u => u.name).join(', ')
        });
        setData({
            name: ingredient.name,
            description: ingredient.description,
            units: ingredient.units.map(u => u.name).join(', ')
        });
        setShowEdit(true);
    }

    function handleEdit() {
        if (editingIngredient) {
            put(route('ingredients.update', { ingredient: editingIngredient.id }), {
                onSuccess: () => {
                    setShowEdit(false);
                    setEditingIngredient(null);
                    reset();
                },
            });
        }
    }

    function confirmDelete(id: string): void {
        setDeleteId(id);
        setShowDelete(true);
    }

    function handleDelete(): void {
        if (deleteId) {
            destroy(route('ingredients.destroy', { ingredient: deleteId }), {
                onSuccess: () => setShowDelete(false),
            });
        }
    }

    const breadcrumbs = [
        { title: 'Ingredients', href: '/ingredients' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ingredients" />
            <Control
                searchValue={search}
                onSearchChange={handleSearchChange}
                actionText="Create"
                actionEvent={() => setShowCreate(true)}
            />
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">Name</TableHead>
                            <TableHead className="w-[300px]">Description</TableHead>
                            <TableHead className="w-[200px]">Units</TableHead>
                            <TableHead className="w-[150px]">Created At</TableHead>
                            <TableHead className="text-right w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ingredients.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    {search ? 'No ingredients found matching your search.' : 'No ingredients found.'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            ingredients.data.map((ingredient: Ingredient) => (
                                <TableRow key={ingredient.id}>
                                    <TableCell className="font-medium">{ingredient.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{ingredient.description}</TableCell>
                                    <TableCell>
                                        {ingredient.units.map((unit: { id: number; name: string }) => (
                                            <Badge key={unit.id} variant="secondary" className="mr-1">{unit.name}</Badge>
                                        ))}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {new Date(ingredient.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="icon" variant="ghost" className="h-8 w-8">
                                                    <span className="sr-only">Open menu</span>
                                                    ⋮
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onSelect={() => startEdit(ingredient)}>
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onSelect={() => confirmDelete(ingredient.id)}
                                                    className="text-destructive focus:text-destructive"
                                                >
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Pagination meta={ingredients} />
            <ConfirmDialog
                open={showDelete}
                onOpenChange={setShowDelete}
                title="Delete Ingredient"
                description="Are you sure you want to delete this ingredient? This action cannot be undone."
                onConfirm={handleDelete}
                destructive
            />

            <Dialog open={showCreate} onOpenChange={setShowCreate}>
                <DialogTrigger asChild>
                    <></>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Ingredient</DialogTitle>
                        <DialogDescription>Enter details for the new ingredient.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input
                            placeholder="Name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <Input
                            placeholder="Description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                        <Input
                            placeholder="Units (comma separated)"
                            value={data.units}
                            onChange={(e) => setData('units', e.target.value)}
                        />
                        <div className="text-xs text-muted-foreground">Use comma to separate multiple units</div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreate(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreate}>Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showEdit} onOpenChange={setShowEdit}>
                <DialogTrigger asChild>
                    <></>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Ingredient</DialogTitle>
                        <DialogDescription>Update ingredient details.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input
                            placeholder="Name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <Input
                            placeholder="Description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                        <Input
                            placeholder="Units (comma separated)"
                            value={data.units}
                            onChange={(e) => setData('units', e.target.value)}
                        />
                        <div className="text-xs text-muted-foreground">Use comma to separate multiple units</div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEdit(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleEdit}>Update</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
