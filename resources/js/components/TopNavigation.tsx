import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { 
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Search, LogIn } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { Category } from '@/types';

interface TopNavigationProps {
    categories: Category[];
}

export default function TopNavigation({ categories }: TopNavigationProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // For now, just console log - we'll implement search later
            console.log('Searching for:', searchQuery);
        }
    };

    const handleLogin = () => {
        router.get('/login');
    };

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left side - Logo and Navigation */}
                    <div className="flex items-center space-x-8">
                        {/* Logo */}
                        <Link href="/" className="flex items-center">
                            <AppLogo />
                        </Link>

                        {/* Navigation Menu */}
                        <div className="hidden md:block">
                            <NavigationMenu>
                                <NavigationMenuList>
                                    {/* Categories Dropdown */}
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger className="bg-transparent hover:bg-gray-100 data-[state=open]:bg-gray-100">
                                            Categories
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <div className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                                <div className="row-span-3">
                                                    <div className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                                                        <div className="mb-2 mt-4 text-lg font-medium">
                                                            Recipe Categories
                                                        </div>
                                                        <p className="text-sm leading-tight text-muted-foreground">
                                                            Browse recipes by category to find exactly what you're looking for.
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    {categories.slice(0, 6).map((category) => (
                                                        <div key={category.id}>
                                                            <Link
                                                                href={`/?category=${category.id}`}
                                                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                            >
                                                                <div className="text-sm font-medium leading-none">
                                                                    {category.name}
                                                                </div>
                                                            </Link>
                                                        </div>
                                                    ))}
                                                    {categories.length > 6 && (
                                                        <div className="text-center pt-2">
                                                            <Link
                                                                href="/categories"
                                                                className="text-sm text-primary hover:underline"
                                                            >
                                                                View all categories
                                                            </Link>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>

                                    {/* Calendar */}
                                    <NavigationMenuItem>
                                        <Link
                                            href="/calendar"
                                            className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                                        >
                                            <Calendar className="w-4 h-4 mr-2" />
                                            Calendar
                                        </Link>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>
                    </div>

                    {/* Right side - Search and Login */}
                    <div className="flex items-center space-x-4">
                        {/* Search */}
                        <form onSubmit={handleSearch} className="relative hidden sm:block">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    type="search"
                                    placeholder="Search recipes..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 w-64"
                                />
                            </div>
                        </form>

                        {/* Mobile Search Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="sm:hidden"
                            onClick={() => console.log('Mobile search modal')}
                        >
                            <Search className="w-4 h-4" />
                        </Button>

                        {/* Login Button */}
                        <Button
                            variant="outline"
                            onClick={handleLogin}
                            className="flex items-center space-x-2"
                        >
                            <LogIn className="w-4 h-4" />
                            <span className="hidden sm:inline">Login</span>
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
