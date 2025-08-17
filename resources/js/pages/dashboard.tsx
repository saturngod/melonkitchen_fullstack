import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ChefHat, Eye, EyeOff } from 'lucide-react';

interface DashboardStats {
    totalRecipes: number;
    publicRecipes: number;
    privateRecipes: number;
}

interface DashboardProps {
    stats: DashboardStats;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ stats }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {/* Total Recipes Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Recipes</CardTitle>
                            <ChefHat className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalRecipes}</div>
                            <p className="text-xs text-muted-foreground">
                                All recipes in the system
                            </p>
                        </CardContent>
                    </Card>

                    {/* Public Recipes Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Public Recipes</CardTitle>
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.publicRecipes}</div>
                            <p className="text-xs text-muted-foreground">
                                Visible to all users
                            </p>
                        </CardContent>
                    </Card>

                    {/* Private Recipes Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Private Recipes</CardTitle>
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.privateRecipes}</div>
                            <p className="text-xs text-muted-foreground">
                                Only visible to authors
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-muted-foreground mb-2">More Features Coming Soon</h3>
                            <p className="text-sm text-muted-foreground">
                                Additional dashboard features will be added here
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
