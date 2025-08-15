import React, { useState, ChangeEvent, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Control from '@/components/shared/Control';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
    users: User[];
    filters?: {
        search?: string;
    };
}

export default function UsersIndex({ users, filters }: UsersIndexProps) {
    const [search, setSearch] = useState(filters?.search || '');

    // Ensure users is an array
    const usersList = Array.isArray(users) ? users : [];

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
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img
                                                    className="h-10 w-10 rounded-full"
                                                    src={user.avatar}
                                                    alt={user.name}
                                                />
                                            </div>
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
                                                <DropdownMenuItem>
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
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
        </AppLayout>
    );
}
