import React, { useState } from 'react'
import { Head, usePage, router } from '@inertiajs/react'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Trash2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import TopNavigation from '@/components/TopNavigation'
import { PageProps } from '@inertiajs/core'
import { Category } from '@/types'
import { toast } from 'sonner'

dayjs.extend(isoWeek)

interface CalendarDay {
    date: string
    day: number
    isCurrentMonth: boolean
    isToday: boolean
    isSelected: boolean
    recipes: Array<{
        id: string
        title: string
        slug: string
        prepTime: number
        cookTime: number
        servings: number
        author: string
        categories: string[]
    }>
}

interface CalendarData {
    calendarDays: CalendarDay[]
    aggregatedIngredients: Array<{
        name: string
        quantity: number
        unit: string
        display: string
        date: string
    }>
    selectedDateRecipes: Array<{
        id: string
        title: string
        slug: string
        prepTime: number
        cookTime: number
        servings: number
        author: string
        categories: string[]
    }>
    currentView: 'day' | 'week' | 'month'
    currentDate: string
    viewTabs: string[]
}

interface CalendarPageProps extends PageProps {
    calendarData: CalendarData
    categories: Category[]
    csrf: string
}

const Calendar = () => {
    const { calendarData, categories, csrf } = usePage<CalendarPageProps>().props
    const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>(calendarData.currentView || 'month')
    const [currentDate, setCurrentDate] = useState(dayjs(calendarData.currentDate))
    const [selectedDate, setSelectedDate] = useState(dayjs(calendarData.currentDate))
    const [deletingRecipe, setDeletingRecipe] = useState<string | null>(null)

    const handleDeleteRecipe = async (recipeId: string, date: string, recipeTitle: string) => {
        setDeletingRecipe(recipeId)

        try {
            // Use CSRF token from Inertia props
            if (!csrf) {
                toast.error('Security token missing', {
                    description: 'Please refresh the page and try again',
                })
                return
            }

            const response = await fetch('/api/recipe-calendar', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    recipe_id: recipeId,
                    date: date,
                }),
            })

            const result = await response.json()

            if (response.ok && result.success) {
                toast.success('Recipe removed from calendar', {
                    description: `"${recipeTitle}" removed from ${dayjs(date).format('MMM D, YYYY')}`,
                })

                // Refresh the calendar data
                router.reload({ only: ['calendarData'] })
            } else {
                toast.error('Failed to remove recipe', {
                    description: result.message || 'Please try again later',
                })
            }
        } catch (error) {
            console.error('Error deleting recipe from calendar:', error)
            toast.error('Failed to remove recipe', {
                description: 'An error occurred while removing the recipe',
            })
        } finally {
            setDeletingRecipe(null)
        }
    }

    const navigateDate = (direction: 'prev' | 'next') => {
        let newDate: dayjs.Dayjs

        switch (currentView) {
            case 'day':
                newDate = direction === 'next' ? selectedDate.add(1, 'day') : selectedDate.subtract(1, 'day')
                setSelectedDate(newDate)
                break
            case 'week':
                newDate = direction === 'next' ? currentDate.add(1, 'week') : currentDate.subtract(1, 'week')
                setCurrentDate(newDate)
                break
            case 'month':
            default:
                newDate = direction === 'next' ? currentDate.add(1, 'month') : currentDate.subtract(1, 'month')
                setCurrentDate(newDate)
                break
        }

        // Here you would typically make a request to get new calendar data
    }

    const renderMonthView = () => {
        const monthStart = currentDate.startOf('month')
        const monthEnd = currentDate.endOf('month')
        const calendarStart = monthStart.startOf('week')
        const calendarEnd = monthEnd.endOf('week')

        const days = []
        let day = calendarStart

        while (day.isBefore(calendarEnd) || day.isSame(calendarEnd, 'day')) {
            const currentDay = day.clone() // Clone the current day to capture it properly
            const dayData = calendarData.calendarDays.find(d => d.date === currentDay.format('YYYY-MM-DD'))
            const isCurrentMonth = currentDay.month() === currentDate.month()
            const isToday = currentDay.isSame(dayjs(), 'day')
            const isSelected = currentDay.isSame(selectedDate, 'day')

            days.push(
                <div
                    key={currentDay.format('YYYY-MM-DD')}
                    className={cn(
                        'min-h-[120px] border border-gray-200 p-2 cursor-pointer hover:bg-gray-50',
                        !isCurrentMonth && 'text-gray-400 bg-gray-50/50',
                        isToday && 'bg-blue-50 border-blue-200',
                        isSelected && 'ring-2 ring-blue-500'
                    )}
                    onClick={() => setSelectedDate(currentDay)}
                >
                    <div className="flex items-center justify-between mb-1">
                        <span className={cn(
                            'text-sm font-medium',
                            isToday && 'text-blue-600'
                        )}>
                            {currentDay.date()}
                        </span>
                    </div>
                    <div className="space-y-1">
                        {dayData?.recipes.slice(0, 3).map((recipe, index) => (
                            <div
                                key={recipe.id}
                                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded truncate flex items-center justify-between group"
                                title={recipe.title}
                            >
                                <span className="truncate flex-1">{recipe.title}</span>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 ml-1 hover:bg-red-100 hover:text-red-600"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleDeleteRecipe(recipe.id, currentDay.format('YYYY-MM-DD'), recipe.title)
                                    }}
                                    disabled={deletingRecipe === recipe.id}
                                >
                                    {deletingRecipe === recipe.id ? (
                                        <div className="animate-spin h-3 w-3 border border-current border-t-transparent rounded-full" />
                                    ) : (
                                        <X className="h-3 w-3" />
                                    )}
                                </Button>
                            </div>
                        ))}
                        {dayData && dayData.recipes.length > 3 && (
                            <div className="text-xs text-gray-500">
                                +{dayData.recipes.length - 3} more
                            </div>
                        )}
                    </div>
                </div>
            )
            day = day.add(1, 'day')
        }

        return (
            <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
                {/* Day headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(dayName => (
                    <div key={dayName} className="bg-gray-100 p-3 text-center text-sm font-medium text-gray-700 border-b border-gray-200">
                        {dayName}
                    </div>
                ))}
                {/* Calendar days */}
                {days}
            </div>
        )
    }

    const renderWeekView = () => {
        const weekStart = currentDate.startOf('isoWeek')
        const days = []

        for (let i = 0; i < 7; i++) {
            const day = weekStart.add(i, 'day')
            const currentDay = day.clone() // Clone the day to capture it properly
            const dayData = calendarData.calendarDays.find(d => d.date === currentDay.format('YYYY-MM-DD'))
            const isToday = currentDay.isSame(dayjs(), 'day')
            const isSelected = currentDay.isSame(selectedDate, 'day')

            days.push(
                <div key={currentDay.format('YYYY-MM-DD')} className="min-h-[300px] border-r border-gray-200 last:border-r-0">
                    <div className={cn(
                        'p-3 border-b border-gray-200 text-center',
                        isToday && 'bg-blue-50',
                        isSelected && 'bg-blue-100'
                    )}>
                        <div className="text-sm text-gray-600">{currentDay.format('ddd')}</div>
                        <div className={cn(
                            'text-lg font-semibold',
                            isToday && 'text-blue-600'
                        )}>
                            {currentDay.date()}
                        </div>
                    </div>
                    <div className="p-2 space-y-1">
                        {dayData?.recipes.map((recipe) => (
                            <div
                                key={recipe.id}
                                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded cursor-pointer hover:bg-blue-200 flex items-center justify-between group"
                                title={recipe.title}
                                onClick={() => setSelectedDate(currentDay)}
                            >
                                <span className="truncate flex-1">{recipe.title}</span>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 ml-1 hover:bg-red-100 hover:text-red-600"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleDeleteRecipe(recipe.id, currentDay.format('YYYY-MM-DD'), recipe.title)
                                    }}
                                    disabled={deletingRecipe === recipe.id}
                                >
                                    {deletingRecipe === recipe.id ? (
                                        <div className="animate-spin h-3 w-3 border border-current border-t-transparent rounded-full" />
                                    ) : (
                                        <X className="h-3 w-3" />
                                    )}
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )
        }

        return (
            <div className="grid grid-cols-7 border border-gray-200 rounded-lg overflow-hidden">
                {days}
            </div>
        )
    }

    const renderDayView = () => {
        const dayData = calendarData.calendarDays.find(d => d.date === selectedDate.format('YYYY-MM-DD'))

        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5" />
                        {selectedDate.format('MMMM D, YYYY')}
                        {selectedDate.isSame(dayjs(), 'day') && (
                            <Badge variant="secondary">Today</Badge>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {dayData?.recipes.length ? (
                        <div className="space-y-3">
                            {dayData.recipes.map((recipe) => (
                                <div key={recipe.id} className="p-3 border rounded-lg hover:bg-gray-50 group">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-medium text-lg">{recipe.title}</h3>
                                            <p className="text-sm text-gray-600">By {recipe.author}</p>
                                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                                <span>Prep: {recipe.prepTime}min</span>
                                                <span>Cook: {recipe.cookTime}min</span>
                                                <span>Serves: {recipe.servings}</span>
                                            </div>
                                            {recipe.categories.length > 0 && (
                                                <div className="flex gap-1 mt-2">
                                                    {recipe.categories.map((category) => (
                                                        <Badge key={category} variant="outline" className="text-xs">
                                                            {category}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => handleDeleteRecipe(recipe.id, selectedDate.format('YYYY-MM-DD'), recipe.title)}
                                            disabled={deletingRecipe === recipe.id}
                                            title="Remove from calendar"
                                        >
                                            {deletingRecipe === recipe.id ? (
                                                <div className="animate-spin h-4 w-4 border border-current border-t-transparent rounded-full" />
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No recipes scheduled for this day</p>
                    )}
                </CardContent>
            </Card>
        )
    }

    return (
        <>
            <Head title="Recipe Calendar - MelonKitchen" />

            {/* Top Navigation */}
            <TopNavigation categories={categories} />

            {/* Main Content */}
            <div className="min-h-screen bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => navigateDate('prev')}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>

                                <h1 className="text-2xl font-bold">
                                    {currentView === 'month' && currentDate.format('MMMM YYYY')}
                                    {currentView === 'week' && `Week of ${currentDate.startOf('isoWeek').format('MMM D, YYYY')}`}
                                    {currentView === 'day' && selectedDate.format('MMMM D, YYYY')}
                                </h1>

                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => navigateDate('next')}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>

                            <Button
                                variant="outline"
                                onClick={() => {
                                    setCurrentDate(dayjs())
                                    setSelectedDate(dayjs())
                                }}
                            >
                                Today
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            {/* Main Calendar */}
                            <div className="lg:col-span-3">
                                <Tabs value={currentView} onValueChange={(value: string) => setCurrentView(value as 'day' | 'week' | 'month')}>
                                    <TabsList className="grid w-full grid-cols-3">
                                        <TabsTrigger value="day">Day</TabsTrigger>
                                        <TabsTrigger value="week">Week</TabsTrigger>
                                        <TabsTrigger value="month">Month</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="month" className="mt-6">
                                        {renderMonthView()}
                                    </TabsContent>

                                    <TabsContent value="week" className="mt-6">
                                        {renderWeekView()}
                                    </TabsContent>

                                    <TabsContent value="day" className="mt-6">
                                        {renderDayView()}
                                    </TabsContent>
                                </Tabs>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Selected Date Recipes */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">
                                            Recipes for {selectedDate.format('MMM D')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {(() => {
                                            const selectedDateStr = selectedDate.format('YYYY-MM-DD')
                                            const dayData = calendarData.calendarDays.find(d => d.date === selectedDateStr)
                                            const recipes = dayData?.recipes || []

                                            return recipes.length > 0 ? (
                                                <div className="space-y-2">
                                                    {recipes.map((recipe) => (
                                                        <div key={recipe.id} className="p-2 border rounded hover:bg-gray-50 cursor-pointer group">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex-1">
                                                                    <h4 className="font-medium text-sm">{recipe.title}</h4>
                                                                    <p className="text-xs text-gray-600">By {recipe.author}</p>
                                                                </div>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 hover:bg-red-50"
                                                                    onClick={() => handleDeleteRecipe(recipe.id, selectedDateStr, recipe.title)}
                                                                    disabled={deletingRecipe === recipe.id}
                                                                    title="Remove from calendar"
                                                                >
                                                                    {deletingRecipe === recipe.id ? (
                                                                        <div className="animate-spin h-3 w-3 border border-current border-t-transparent rounded-full" />
                                                                    ) : (
                                                                        <X className="h-3 w-3" />
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-500">No recipes scheduled</p>
                                            )
                                        })()}
                                    </CardContent>
                                </Card>

                                {/* Aggregated Ingredients */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">
                                            Shopping List
                                        </CardTitle>
                                        <p className="text-sm text-gray-600">
                                            For {selectedDate.format('MMM D')}
                                        </p>
                                    </CardHeader>
                                    <CardContent>
                                        {(() => {
                                            const selectedDateStr = selectedDate.format('YYYY-MM-DD')
                                            const dayData = calendarData.calendarDays.find(d => d.date === selectedDateStr)
                                            const recipes = dayData?.recipes || []

                                            // DEBUG LOGGING
                                            console.log('🧪 Shopping List Debug:')
                                            console.log('Selected Date String:', selectedDateStr)
                                            console.log('Calendar Data:', calendarData)
                                            console.log('Aggregated Ingredients:', calendarData.aggregatedIngredients)
                                            console.log('Day Data:', dayData)
                                            console.log('Recipes for day:', recipes)

                                            // Get aggregated ingredients that match the selected date
                                            const selectedDateIngredients = calendarData.aggregatedIngredients.filter(
                                                ingredient => {
                                                    // Handle both 'YYYY-MM-DD' and 'YYYY-MM-DD HH:mm:ss' formats
                                                    const ingredientDate = ingredient.date.split(' ')[0]; // Get just the date part
                                                    return ingredientDate === selectedDateStr;
                                                }
                                            )

                                            console.log('Filtered ingredients for date:', selectedDateIngredients)

                                            // Aggregate ingredients by name and unit (combine quantities)
                                            const aggregatedMap = new Map<string, { name: string, quantity: number, unit: string }>()

                                            selectedDateIngredients.forEach(ingredient => {
                                                const key = `${ingredient.name}-${ingredient.unit}` // Group by name + unit

                                                if (aggregatedMap.has(key)) {
                                                    const existing = aggregatedMap.get(key)!
                                                    aggregatedMap.set(key, {
                                                        ...existing,
                                                        quantity: existing.quantity + ingredient.quantity
                                                    })
                                                } else {
                                                    aggregatedMap.set(key, {
                                                        name: ingredient.name,
                                                        quantity: ingredient.quantity,
                                                        unit: ingredient.unit
                                                    })
                                                }
                                            })

                                            const aggregatedIngredients = Array.from(aggregatedMap.values())

                                            // DEBUG LOGGING FOR AGGREGATION
                                            console.log('Aggregated Map:', aggregatedMap)
                                            console.log('Final aggregated ingredients:', aggregatedIngredients)

                                            return aggregatedIngredients.length > 0 ? (
                                                <div className="space-y-2">
                                                    {aggregatedIngredients.map((ingredient, index) => (
                                                        <div key={index} className="flex justify-between items-center text-sm py-2 border-b border-gray-100 last:border-b-0">
                                                            <span className="font-medium">{ingredient.name}</span>
                                                            <span className="text-gray-600">
                                                                {ingredient.quantity} {ingredient.unit}
                                                            </span>
                                                        </div>
                                                    ))}
                                                    <div className="pt-2 mt-2 border-t border-gray-200">
                                                        <p className="text-xs text-gray-500">
                                                            Total: {aggregatedIngredients.length} ingredient{aggregatedIngredients.length !== 1 ? 's' : ''}
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-500">
                                                    {recipes.length > 0 ? 'No ingredients data available' : 'No recipes scheduled'}
                                                </p>
                                            )
                                        })()}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Calendar
