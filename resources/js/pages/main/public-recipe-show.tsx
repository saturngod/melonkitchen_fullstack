import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import TopNavigation from '@/components/TopNavigation';
import { DetailedRecipe, Category, SharedData } from '@/types';
import {
    Clock,
    Users,
    ChefHat,
    Heart,
    Share2,
    Eye,
    Calendar,
    User,
    CalendarPlus,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

interface PublicRecipeShowProps {
    recipe: DetailedRecipe;
    relatedRecipes: DetailedRecipe[];
    categories: Category[];
}

export default function PublicRecipeShow({ recipe, relatedRecipes, categories }: PublicRecipeShowProps) {
    // Authentication
    const { auth } = usePage<SharedData>().props;

    // Calendar state
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const formatTime = (minutes: number | undefined): string => {
        if (!minutes) return 'N/A';
        if (minutes < 60) return `${minutes} min`;
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    };

    // Calendar helper functions
    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getDaysInMonth = (date: Date): Date[] => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDate = new Date(firstDay);
        startDate.setDate(firstDay.getDate() - firstDay.getDay());

        const days: Date[] = [];
        for (let i = 0; i < 42; i++) {
            const day = new Date(startDate);
            day.setDate(startDate.getDate() + i);
            days.push(day);
        }
        return days;
    };

    const isToday = (date: Date): boolean => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isSameMonth = (date: Date, month: Date): boolean => {
        return date.getMonth() === month.getMonth() && date.getFullYear() === month.getFullYear();
    };

    const isPastDate = (date: Date): boolean => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const handleDateSelect = (date: Date) => {
        if (!isPastDate(date)) {
            setSelectedDate(date);
        }
    };

    const handleAddToCalendar = async () => {
        if (!selectedDate) return;

        // Check authentication
        if (!auth.user) {
            router.get('/login');
            return;
        }

        try {
            // Store recipe in database calendar
            await router.post('/api/recipe-calendar', {
                recipe_id: recipe.id,
                date: selectedDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
            });

            // Close the calendar after adding
            setIsCalendarOpen(false);
            setSelectedDate(null);

            // You can add a success notification here
            console.log('Recipe added to calendar successfully!');
        } catch (error) {
            console.error('Error adding recipe to calendar:', error);
            // You might want to show a toast notification here
        }
    };

    // Authentication check handlers
    const handleSaveRecipe = () => {
        if (!auth.user) {
            router.get('/login');
            return;
        }
        // TODO: Implement save functionality for authenticated users
        console.log('Save recipe for user:', auth.user.name);
    };

    const handleCalendarClick = () => {
        if (!auth.user) {
            router.get('/login');
            return;
        }
        setIsCalendarOpen(true);
    };

    const totalTime = (recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0);

    return (
        <>
            <Head title={recipe.title} />

            <div className="min-h-screen bg-gray-50">
                {/* Top Navigation */}
                <TopNavigation categories={categories} />

                {/* Hero Section */}
                <div className="bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* Action Buttons Row */}
                        <div className="flex justify-end items-center mb-6">
                            <div className="flex items-center space-x-4">
                                <Button variant="ghost" size="sm" onClick={handleSaveRecipe}>
                                    <Heart className="w-4 h-4 mr-2" />
                                    Save
                                </Button>

                                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                                    <PopoverTrigger asChild>
                                        <Button variant="ghost" size="sm" onClick={handleCalendarClick}>
                                            <CalendarPlus className="w-4 h-4 mr-2" />
                                            Add To Calendar
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="end">
                                        <div className="p-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        const newMonth = new Date(currentMonth);
                                                        newMonth.setMonth(currentMonth.getMonth() - 1);
                                                        setCurrentMonth(newMonth);
                                                    }}
                                                >
                                                    <ChevronLeft className="w-4 h-4" />
                                                </Button>
                                                <h3 className="text-sm font-medium">
                                                    {currentMonth.toLocaleDateString('en-US', {
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </h3>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        const newMonth = new Date(currentMonth);
                                                        newMonth.setMonth(currentMonth.getMonth() + 1);
                                                        setCurrentMonth(newMonth);
                                                    }}
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </Button>
                                            </div>

                                            <div className="grid grid-cols-7 gap-1 mb-2">
                                                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                                                    <div key={day} className="text-center text-xs font-medium text-gray-500 p-2">
                                                        {day}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="grid grid-cols-7 gap-1">
                                                {getDaysInMonth(currentMonth).map((date, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleDateSelect(date)}
                                                        disabled={isPastDate(date)}
                                                        className={`
                                                            p-2 text-xs rounded-md transition-colors
                                                            ${!isSameMonth(date, currentMonth)
                                                                ? 'text-gray-300'
                                                                : isPastDate(date)
                                                                    ? 'text-gray-300 cursor-not-allowed'
                                                                    : 'text-gray-900 hover:bg-gray-100'
                                                            }
                                                            ${isToday(date) ? 'bg-blue-100 text-blue-900' : ''}
                                                            ${selectedDate && date.toDateString() === selectedDate.toDateString()
                                                                ? 'bg-primary text-primary-foreground'
                                                                : ''
                                                            }
                                                        `}
                                                    >
                                                        {date.getDate()}
                                                    </button>
                                                ))}
                                            </div>

                                            {selectedDate && (
                                                <div className="mt-4 pt-4 border-t">
                                                    <p className="text-sm text-gray-600 mb-3">
                                                        Selected: {formatDate(selectedDate)}
                                                    </p>
                                                    <Button
                                                        onClick={handleAddToCalendar}
                                                        size="sm"
                                                        className="w-full"
                                                    >
                                                        Add
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            {/* Recipe Image */}
                            <div className="aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden">
                                {recipe.image_url ? (
                                    <img
                                        src={recipe.image_url}
                                        alt={recipe.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                        <ChefHat className="w-16 h-16 text-gray-400" />
                                    </div>
                                )}
                            </div>

                            {/* Recipe Info */}
                            <div>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                                    <User className="w-4 h-4" />
                                    <span>By {recipe.user.name}</span>
                                    <Calendar className="w-4 h-4 ml-4" />
                                    <span>{new Date(recipe.created_at).toLocaleDateString()}</span>
                                </div>

                                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                    {recipe.title}
                                </h1>

                                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                    {recipe.description}
                                </p>

                                {/* Categories and Tags */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {recipe.categories.map((category) => (
                                        <Badge key={category.id} variant="secondary">
                                            {category.name}
                                        </Badge>
                                    ))}
                                    {recipe.tags.map((tag) => (
                                        <Badge key={tag.id} variant="outline">
                                            {tag.name}
                                        </Badge>
                                    ))}
                                </div>

                                {/* Recipe Stats */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <Clock className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                                        <div className="text-sm font-medium">Prep</div>
                                        <div className="text-xs text-gray-600">
                                            {formatTime(recipe.prep_time_minutes)}
                                        </div>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <Clock className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                                        <div className="text-sm font-medium">Cook</div>
                                        <div className="text-xs text-gray-600">
                                            {formatTime(recipe.cook_time_minutes)}
                                        </div>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <Clock className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                                        <div className="text-sm font-medium">Total</div>
                                        <div className="text-xs text-gray-600">
                                            {formatTime(totalTime)}
                                        </div>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <Users className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                                        <div className="text-sm font-medium">Serves</div>
                                        <div className="text-xs text-gray-600">
                                            {recipe.servings || 'N/A'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Ingredients */}
                        <div className="lg:col-span-1">
                            <Card>
                                <CardContent className="p-6">
                                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                                        <ChefHat className="w-5 h-5 mr-2" />
                                        Ingredients
                                    </h2>
                                    <ul className="space-y-3">
                                        {recipe.recipe_ingredients?.map((ingredient, index) => (
                                            <li key={index} className="flex items-start">
                                                <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                                                <div className="flex-1">
                                                    <span className="font-medium">
                                                        {ingredient.quantity && `${ingredient.quantity} `}
                                                        {ingredient.unit?.name && `${ingredient.unit.name} `}
                                                        {ingredient.ingredient.name}
                                                    </span>
                                                    {ingredient.notes && (
                                                        <div className="text-sm text-gray-600">
                                                            {ingredient.notes}
                                                        </div>
                                                    )}
                                                    {ingredient.is_optional && (
                                                        <Badge variant="outline" className="text-xs ml-2">
                                                            Optional
                                                        </Badge>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* Nutrition Info */}
                            {recipe.nutritionInfo && (
                                <Card className="mt-6">
                                    <CardContent className="p-6">
                                        <h2 className="text-xl font-semibold mb-4">Nutrition Facts</h2>
                                        <div className="space-y-2 text-sm">
                                            {recipe.nutritionInfo.calories_per_serving && (
                                                <div className="flex justify-between">
                                                    <span>Calories</span>
                                                    <span className="font-medium">{recipe.nutritionInfo.calories_per_serving}</span>
                                                </div>
                                            )}
                                            {recipe.nutritionInfo.protein_grams && (
                                                <div className="flex justify-between">
                                                    <span>Protein</span>
                                                    <span className="font-medium">{recipe.nutritionInfo.protein_grams}g</span>
                                                </div>
                                            )}
                                            {recipe.nutritionInfo.carbs_grams && (
                                                <div className="flex justify-between">
                                                    <span>Carbohydrates</span>
                                                    <span className="font-medium">{recipe.nutritionInfo.carbs_grams}g</span>
                                                </div>
                                            )}
                                            {recipe.nutritionInfo.fat_grams && (
                                                <div className="flex justify-between">
                                                    <span>Fat</span>
                                                    <span className="font-medium">{recipe.nutritionInfo.fat_grams}g</span>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Instructions */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardContent className="p-6">
                                    <h2 className="text-xl font-semibold mb-6">Instructions</h2>
                                    <div className="space-y-6">
                                        {recipe.instructions?.map((instruction, index) => (
                                            <div key={instruction.id} className="flex items-start">
                                                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium mr-4">
                                                    {instruction.step_number}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-gray-900 leading-relaxed">
                                                        {instruction.instruction}
                                                    </p>
                                                    {instruction.image_url && (
                                                        <img
                                                            src={instruction.image_url}
                                                            alt={`Step ${instruction.step_number}`}
                                                            className="mt-3 rounded-lg max-w-sm"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Related Recipes */}
                {relatedRecipes.length > 0 && (
                    <div className="bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                            <h2 className="text-2xl font-bold mb-8">Related Recipes</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {relatedRecipes.map((relatedRecipe) => (
                                    <Link
                                        key={relatedRecipe.id}
                                        href={`/recipes/${relatedRecipe.id}`}
                                        className="group"
                                    >
                                        <Card className="overflow-hidden transition-transform group-hover:scale-105">
                                            <div className="aspect-[4/3] bg-gray-200">
                                                {relatedRecipe.image_url ? (
                                                    <img
                                                        src={relatedRecipe.image_url}
                                                        alt={relatedRecipe.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                        <ChefHat className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <CardContent className="p-4">
                                                <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                                                    {relatedRecipe.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    By {relatedRecipe.user.name}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <footer className="bg-gray-900 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="text-center">
                            <Link href="/" className="text-2xl font-bold">
                                Melon Kitchen
                            </Link>
                            <p className="mt-2 text-gray-400">
                                Discover and share amazing recipes
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
