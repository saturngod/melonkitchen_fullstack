import React, { useState, ChangeEvent, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Control from '@/components/shared/Control';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

interface TagIndexProps {
    tags: {
        data: Array<{ id: string; name: string; created_at: string }>;
    } & PaginationMeta;
    filters: {
        search: string;
    };
}
export default function TagIndex({ tags, filters }: TagIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [editingTag, setEditingTag] = useState<{ id: string; name: string } | null>(null);

    const { data, setData, post, reset, delete: destroy, put } = useForm({ name: '' });

    // Debounced search functionality
    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            router.get(route('tags.index'), { search }, {
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
        post(route('tags.store'), {
            onSuccess: () => {
                setShowCreate(false);
                reset();
            },
        });
    }

    function startEdit(tag: { id: string; name: string }) {
        setEditingTag(tag);
        setData({ name: tag.name });
        setShowEdit(true);
    }

    function handleEdit() {
        if (editingTag) {
            put(route('tags.update', { tag: editingTag.id }), {
                onSuccess: () => {
                    setShowEdit(false);
                    setEditingTag(null);
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
            destroy(route('tags.destroy', { tag: deleteId }), {
                onSuccess: () => setShowDelete(false),
            });
        }
    }

    const breadcrumbs = [
        { title: 'Tags', href: '/tags' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tags" />
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
                            <TableHead className="w-[300px]">Name</TableHead>
                            <TableHead className="w-[200px]">Created At</TableHead>
                            <TableHead className="text-right w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tags.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                                    {search ? 'No tags found matching your search.' : 'No tags found.'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            tags.data.map((tag: { id: string; name: string; created_at: string }) => (
                                <TableRow key={tag.id}>
                                    <TableCell className="font-medium">{tag.name}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {new Date(tag.created_at).toLocaleDateString()}
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
                                                <DropdownMenuItem onSelect={() => startEdit(tag)}>
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onSelect={() => confirmDelete(tag.id)}
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

            <Pagination meta={tags} />

            <ConfirmDialog
                open={showDelete}
                onOpenChange={setShowDelete}
                title="Delete Tag"
                description="Are you sure you want to delete this tag? This action cannot be undone."
                onConfirm={handleDelete}
                destructive
            />

            <Dialog open={showCreate} onOpenChange={setShowCreate}>
                <DialogTrigger asChild>
                    <></>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Tag</DialogTitle>
                        <DialogDescription>Enter details for the new tag.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input
                            placeholder="Name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
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
                        <DialogTitle>Edit Tag</DialogTitle>
                        <DialogDescription>Update tag details.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input
                            placeholder="Name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
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
