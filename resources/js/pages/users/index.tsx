import React, { useState, ChangeEvent, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from '@/components/ui/dialog';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
} from '@/components/ui/table';
import Pagination, { type PaginationMeta } from '@/components/ui/pagination';

interface User {
    id: string;
    name: string;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    role: string;
    avatar: string;
    created_at: string;
}

interface UsersIndexProps {
    users: {
        data: User[];
    } & PaginationMeta;
    filters?: {
        search?: string;
    };
}

export default function UsersIndex({ users, filters }: UsersIndexProps) {
    const [search, setSearch] = useState(filters?.search || '');
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const { data, setData, post, reset, delete: destroy, put, errors } = useForm({
        name: '',
        email: '',
        username: '',
        first_name: '',
        last_name: '',
        role: 'USER',
        is_active: true as boolean | undefined,
        password: '',
        password_confirmation: '',
    });

    // Ensure users is an array from paginated data
    const usersList = Array.isArray((users as any)?.data) ? (users as any).data as User[] : [];

    // Debounced search functionality (if needed later)
    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            if (search !== (filters?.search || '')) {
                router.get(route('users.index'), { search }, {
                    preserveState: true,
                    replace: true,
                });
            }
        }, 300);

        return () => clearTimeout(delayedSearch);
    }, [search]);

    function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
        setSearch(e.target.value);
    }

    function openCreate() {
        reset();
        setData('role', 'USER');
        setData('is_active', true);
        setShowCreate(true);
    }

    function handleCreate() {
        post(route('users.store'), {
            onSuccess: () => {
                setShowCreate(false);
                reset();
            },
        });
    }

    function startEdit(user: User) {
        setEditingUser(user);
        setData({
            name: user.name ?? '',
            email: user.email ?? '',
            username: user.username ?? '',
            first_name: user.first_name ?? '',
            last_name: user.last_name ?? '',
            role: user.role ?? 'USER',
            is_active: user.is_active,
            password: '',
            password_confirmation: '',
        } as any);
        setShowEdit(true);
    }

    function handleEdit() {
        if (!editingUser) return;
        put(route('users.update', { user: editingUser.id }), {
            onSuccess: () => {
                setShowEdit(false);
                setEditingUser(null);
                reset();
            },
        });
    }

    function confirmDelete(id: string): void {
        setDeleteId(id);
        setShowDelete(true);
    }

    function handleDelete(): void {
        if (deleteId) {
            destroy(route('users.destroy', { user: deleteId }), {
                onSuccess: () => setShowDelete(false),
            });
        }
    }

    const breadcrumbs = [
        { title: 'Users', href: '/dashboard/users' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex items-center mb-4">
                <Input
                    placeholder="Search users..."
                    value={search}
                    onChange={handleSearchChange}
                    className="w-1/3"
                />
                <div className="flex-1" />
                <Button onClick={openCreate}>Create</Button>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[250px]">User</TableHead>
                            <TableHead className="w-[200px]">Email</TableHead>
                            <TableHead className="w-[150px]">Username</TableHead>
                            <TableHead className="w-[100px]">Role</TableHead>
                            <TableHead className="w-[100px]">Status</TableHead>
                            <TableHead className="w-[150px]">Joined</TableHead>
                            <TableHead className="text-right w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {usersList.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                    {search ? 'No users found matching your search.' : 'No users found.'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            usersList.map((user: User) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center">

                                            <div className="ml-4">
                                                <div className="text-sm font-medium">
                                                    {user.name}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {user.first_name} {user.last_name}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                    <TableCell className="font-medium">{user.username}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={user.is_active ? "default" : "destructive"}
                                            className={user.is_active ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                                        >
                                            {user.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {new Date(user.created_at).toLocaleDateString()}
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
                                                <DropdownMenuItem>
                                                    View
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onSelect={() => startEdit(user)}>
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onSelect={() => confirmDelete(user.id)}
                                                >
                                                    {user.is_active ? 'Deactivate' : 'Activate'}
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
            <Pagination meta={users as unknown as PaginationMeta} />

            <ConfirmDialog
                open={showDelete}
                onOpenChange={setShowDelete}
                title="Delete User"
                description="Are you sure you want to delete this user? This action cannot be undone."
                onConfirm={handleDelete}
                destructive
            />

            <Dialog open={showCreate} onOpenChange={setShowCreate}>
                <DialogTrigger asChild>
                    <></>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create User</DialogTitle>
                        <DialogDescription>Enter details for the new user.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3">
                        <div>
                            <Input aria-invalid={!!errors.name} placeholder="Name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                            {errors.name && (<p className="mt-1 text-xs text-destructive">{errors.name}</p>)}
                        </div>
                        <div>
                            <Input aria-invalid={!!errors.email} placeholder="Email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                            {errors.email && (<p className="mt-1 text-xs text-destructive">{errors.email}</p>)}
                        </div>
                        <div>
                            <Input aria-invalid={!!errors.username} placeholder="Username" value={data.username} onChange={(e) => setData('username', e.target.value)} />
                            {errors.username && (<p className="mt-1 text-xs text-destructive">{errors.username}</p>)}
                        </div>
                        <div>
                            <Input aria-invalid={!!errors.first_name} placeholder="First name" value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} />
                            {errors.first_name && (<p className="mt-1 text-xs text-destructive">{errors.first_name}</p>)}
                        </div>
                        <div>
                            <Input aria-invalid={!!errors.last_name} placeholder="Last name" value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} />
                            {errors.last_name && (<p className="mt-1 text-xs text-destructive">{errors.last_name}</p>)}
                        </div>
                        <Select value={data.role} onValueChange={(val) => setData('role', val)}>
                            <SelectTrigger aria-invalid={!!errors.role}>
                                <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ADMIN">ADMIN</SelectItem>
                                <SelectItem value="USER">USER</SelectItem>
                                <SelectItem value="CREATOR">CREATOR</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.role && (<p className="mt-1 text-xs text-destructive">{errors.role}</p>)}
                        <div>
                            <Input aria-invalid={!!errors.password} placeholder="Password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} />
                            {errors.password && (<p className="mt-1 text-xs text-destructive">{errors.password}</p>)}
                        </div>
                        <div>
                            <Input aria-invalid={!!errors.password_confirmation} placeholder="Confirm Password" type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} />
                            {errors.password_confirmation && (<p className="mt-1 text-xs text-destructive">{errors.password_confirmation}</p>)}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
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
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>Update user details.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3">
                        <div>
                            <Input aria-invalid={!!errors.name} placeholder="Name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                            {errors.name && (<p className="mt-1 text-xs text-destructive">{errors.name}</p>)}
                        </div>
                        <div>
                            <Input aria-invalid={!!errors.email} placeholder="Email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                            {errors.email && (<p className="mt-1 text-xs text-destructive">{errors.email}</p>)}
                        </div>
                        <div>
                            <Input aria-invalid={!!errors.username} placeholder="Username" value={data.username} onChange={(e) => setData('username', e.target.value)} />
                            {errors.username && (<p className="mt-1 text-xs text-destructive">{errors.username}</p>)}
                        </div>
                        <div>
                            <Input aria-invalid={!!errors.first_name} placeholder="First name" value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} />
                            {errors.first_name && (<p className="mt-1 text-xs text-destructive">{errors.first_name}</p>)}
                        </div>
                        <div>
                            <Input aria-invalid={!!errors.last_name} placeholder="Last name" value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} />
                            {errors.last_name && (<p className="mt-1 text-xs text-destructive">{errors.last_name}</p>)}
                        </div>
                        <Select value={data.role} onValueChange={(val) => setData('role', val)}>
                            <SelectTrigger aria-invalid={!!errors.role}>
                                <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ADMIN">ADMIN</SelectItem>
                                <SelectItem value="USER">USER</SelectItem>
                                <SelectItem value="CREATOR">CREATOR</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.role && (<p className="mt-1 text-xs text-destructive">{errors.role}</p>)}
                        <div>
                            <Input aria-invalid={!!errors.password} placeholder="New Password (optional)" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} />
                            {errors.password && (<p className="mt-1 text-xs text-destructive">{errors.password}</p>)}
                        </div>
                        <div>
                            <Input aria-invalid={!!errors.password_confirmation} placeholder="Confirm Password" type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} />
                            {errors.password_confirmation && (<p className="mt-1 text-xs text-destructive">{errors.password_confirmation}</p>)}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEdit(false)}>Cancel</Button>
                        <Button onClick={handleEdit}>Update</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
