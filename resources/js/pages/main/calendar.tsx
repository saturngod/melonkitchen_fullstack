import React, { useState } from 'react'
import { Head, usePage } from '@inertiajs/react'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import TopNavigation from '@/components/TopNavigation'
import { PageProps } from '@inertiajs/core'
import { Category } from '@/types'

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
}

const Calendar = () => {
    const { calendarData, categories } = usePage<CalendarPageProps>().props
    const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>(calendarData.currentView || 'month')
    const [currentDate, setCurrentDate] = useState(dayjs(calendarData.currentDate))
    const [selectedDate, setSelectedDate] = useState(dayjs(calendarData.currentDate))

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
            const dayData = calendarData.calendarDays.find(d => d.date === day.format('YYYY-MM-DD'))
            const isCurrentMonth = day.month() === currentDate.month()
            const isToday = day.isSame(dayjs(), 'day')
            const isSelected = day.isSame(selectedDate, 'day')

            days.push(
                <div
                    key={day.format('YYYY-MM-DD')}
                    className={cn(
                        'min-h-[120px] border border-gray-200 p-2 cursor-pointer hover:bg-gray-50',
                        !isCurrentMonth && 'text-gray-400 bg-gray-50/50',
                        isToday && 'bg-blue-50 border-blue-200',
                        isSelected && 'ring-2 ring-blue-500'
                    )}
                    onClick={() => setSelectedDate(day)}
                >
                    <div className="flex items-center justify-between mb-1">
                        <span className={cn(
                            'text-sm font-medium',
                            isToday && 'text-blue-600'
                        )}>
                            {day.date()}
                        </span>
                    </div>
                    <div className="space-y-1">
                        {dayData?.recipes.slice(0, 3).map((recipe, index) => (
                            <div
                                key={recipe.id}
                                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded truncate"
                                title={recipe.title}
                            >
                                {recipe.title}
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
            const dayData = calendarData.calendarDays.find(d => d.date === day.format('YYYY-MM-DD'))
            const isToday = day.isSame(dayjs(), 'day')
            const isSelected = day.isSame(selectedDate, 'day')

            days.push(
                <div key={day.format('YYYY-MM-DD')} className="min-h-[300px] border-r border-gray-200 last:border-r-0">
                    <div className={cn(
                        'p-3 border-b border-gray-200 text-center',
                        isToday && 'bg-blue-50',
                        isSelected && 'bg-blue-100'
                    )}>
                        <div className="text-sm text-gray-600">{day.format('ddd')}</div>
                        <div className={cn(
                            'text-lg font-semibold',
                            isToday && 'text-blue-600'
                        )}>
                            {day.date()}
                        </div>
                    </div>
                    <div className="p-2 space-y-1">
                        {dayData?.recipes.map((recipe) => (
                            <div
                                key={recipe.id}
                                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded cursor-pointer hover:bg-blue-200"
                                title={recipe.title}
                                onClick={() => setSelectedDate(day)}
                            >
                                {recipe.title}
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
                                <div key={recipe.id} className="p-3 border rounded-lg hover:bg-gray-50">
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
                                        {calendarData.selectedDateRecipes.length > 0 ? (
                                            <div className="space-y-2">
                                                {calendarData.selectedDateRecipes.map((recipe) => (
                                                    <div key={recipe.id} className="p-2 border rounded hover:bg-gray-50 cursor-pointer">
                                                        <h4 className="font-medium text-sm">{recipe.title}</h4>
                                                        <p className="text-xs text-gray-600">By {recipe.author}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500">No recipes scheduled</p>
                                        )}
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
                                        {calendarData.aggregatedIngredients.length > 0 ? (
                                            <div className="space-y-1">
                                                {calendarData.aggregatedIngredients.map((ingredient, index) => (
                                                    <div key={index} className="text-sm py-1 border-b border-gray-100 last:border-b-0">
                                                        {ingredient.display}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500">No ingredients needed</p>
                                        )}
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
