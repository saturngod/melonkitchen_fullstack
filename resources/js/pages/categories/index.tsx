import React, { useState, ChangeEvent, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Control from '@/components/shared/Control';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Combobox } from '@/components/ui/combobox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

interface Category {
    id: string;
    name: string;
    parent_id?: string;
    created_at: string;
    children?: Category[];
}

interface CategoryIndexProps {
    categories: {
        data: Category[];
    } & PaginationMeta;
    allCategories: Array<{ id: string; name: string }>;
    filters: {
        search: string;
    };
}

export default function CategoryIndex({ categories, allCategories, filters }: CategoryIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const { data, setData, post, reset, delete: destroy, put, processing } = useForm({
        name: '',
        parent_id: ''
    });

    // Debounced search functionality
    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            router.get(route('categories.index'), { search }, {
                preserveState: true,
                replace: true,
            });
        }, 300);

        return () => clearTimeout(delayedSearch);
    }, [search]);

    function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
        setSearch(e.target.value);
    }

    // Client-side validation
    function validateForm(): boolean {
        const newErrors: { [key: string]: string } = {};

        if (!data.name.trim()) {
            newErrors.name = 'Category name is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function handleCreate() {
        if (!validateForm()) return;

        post(route('categories.store'), {
            onSuccess: () => {
                setShowCreate(false);
                reset();
                setErrors({});
            },
            onError: (errors) => {
                setErrors(errors);
            },
        });
    }

    function startEdit(category: Category) {
        setEditingCategory(category);
        setData({
            name: category.name,
            parent_id: category.parent_id || ''
        });
        setShowEdit(true);
        setErrors({});
    }

    function handleEdit() {
        if (!validateForm()) return;

        if (editingCategory) {
            put(route('categories.update', { category: editingCategory.id }), {
                onSuccess: () => {
                    setShowEdit(false);
                    setEditingCategory(null);
                    reset();
                    setErrors({});
                },
                onError: (errors) => {
                    setErrors(errors);
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
            destroy(route('categories.destroy', { category: deleteId }), {
                onSuccess: () => {
                    setShowDelete(false);
                    setDeleteId(null);
                },
                onError: (errors) => {
                    setShowDelete(false);
                    setDeleteId(null);
                    // Show error message - you might want to add a toast notification here
                    console.error('Delete error:', errors);
                },
            });
        }
    }

    function resetCreateForm() {
        setShowCreate(false);
        reset();
        setErrors({});
    }

    function resetEditForm() {
        setShowEdit(false);
        setEditingCategory(null);
        reset();
        setErrors({});
    }

    // Convert allCategories to combobox options
    const parentCategoryOptions = allCategories.map(category => ({
        value: category.id,
        label: category.name
    }));

    // Render category row with children
    function renderCategoryRow(category: Category, isChild = false) {
        return (
            <React.Fragment key={category.id}>
                <TableRow>
                    <TableCell className={`font-medium ${isChild ? 'pl-8' : ''}`}>
                        {isChild && '└ '}
                        {category.name}
                    </TableCell>
                    <TableCell className="text-right">
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost" className="h-8 w-8">
                                    <span className="sr-only">Open menu</span>
                                    ⋮
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onSelect={() => startEdit(category)}>
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onSelect={() => confirmDelete(category.id)}
                                    className="text-destructive focus:text-destructive"
                                >
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
                {/* Render children if they exist */}
                {category.children?.map(child => renderCategoryRow(child, true))}
            </React.Fragment>
        );
    }

    const breadcrumbs = [
        { title: 'Categories', href: '/dashboard/categories' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />
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
                            <TableHead className="w-[400px]">Name</TableHead>
                            <TableHead className="text-right w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={2} className="h-24 text-center text-muted-foreground">
                                    {search ? 'No categories found matching your search.' : 'No categories found.'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            categories.data.map((category) => renderCategoryRow(category))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Pagination meta={categories} />

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={showDelete}
                onOpenChange={setShowDelete}
                title="Delete Category"
                description="Are you sure you want to delete this category? This action cannot be undone."
                onConfirm={handleDelete}
                destructive
            />

            {/* Create Category Dialog */}
            <Dialog open={showCreate} onOpenChange={setShowCreate}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Category</DialogTitle>
                        <DialogDescription>Enter details for the new category.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="category-name">Category Name *</Label>
                            <Input
                                id="category-name"
                                placeholder="Category Name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="parent-category">Parent Category</Label>
                            <Combobox
                                options={parentCategoryOptions}
                                value={data.parent_id}
                                onValueChange={(value) => setData('parent_id', value)}
                                placeholder="Select parent category (optional)"
                            />
                            {errors.parent_id && (
                                <p className="text-sm text-red-600">{errors.parent_id}</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={resetCreateForm}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreate} disabled={processing}>
                            {processing ? 'Creating...' : 'Create'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Category Dialog */}
            <Dialog open={showEdit} onOpenChange={setShowEdit}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                        <DialogDescription>Update category details.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-category-name">Category Name *</Label>
                            <Input
                                id="edit-category-name"
                                placeholder="Category Name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-parent-category">Parent Category</Label>
                            <Combobox
                                options={parentCategoryOptions.filter(option => option.value !== editingCategory?.id)}
                                value={data.parent_id}
                                onValueChange={(value) => setData('parent_id', value)}
                                placeholder="Select parent category (optional)"
                            />
                            {errors.parent_id && (
                                <p className="text-sm text-red-600">{errors.parent_id}</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={resetEditForm}>
                            Cancel
                        </Button>
                        <Button onClick={handleEdit} disabled={processing}>
                            {processing ? 'Updating...' : 'Update'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
