import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import TopNavigation from '@/components/TopNavigation';
import RecipeForm, { RecipeFormData } from '@/components/recipe/RecipeForm';
import { Category, Tag, Ingredient, Unit } from '@/types';

interface RecipeCreatePageProps {
    categories: Category[];
    tags: Tag[];
    ingredients: Ingredient[];
    units: Unit[];
}

export default function RecipeCreatePage({ categories, tags, ingredients, units }: RecipeCreatePageProps) {
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const initialData: RecipeFormData = {
        title: '',
        description: '',
        servings: 4,
        difficulty: 'easy',
        prep_time_minutes: 0,
        cook_time_minutes: 0,
        youtube_url: '',
        is_public: false,
        category_id: '',
        tag_ids: [],
        ingredients: [],
        instructions: [{ step_number: 1, instruction: '', image: null }],
        nutrition: {},
    };

    const handleSubmit = (formData: RecipeFormData) => {
        setProcessing(true);
        setErrors({});

        router.post(route('recipes.store'), formData, {
            onSuccess: () => {
                router.get(route('my-recipes'));
            },
            onError: (errors: any) => {
                console.log('Form submission errors:', errors);
                setErrors(errors);
                setProcessing(false);
            },
            onFinish: () => {
                setProcessing(false);
            }
        });
    };

    return (
        <>
            <Head title="Create Recipe - MelonKitchen" />

            {/* Top Navigation */}
            <TopNavigation categories={categories} />

            {/* Main Content */}
            <div className="min-h-screen bg-background">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center space-x-4">
                            {/* Breadcrumbs */}
                            <nav className="flex" aria-label="Breadcrumb">
                                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                                    <li className="inline-flex items-center">
                                        <a
                                            href="/"
                                            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-orange-600"
                                        >
                                            Home
                                        </a>
                                    </li>
                                    <li>
                                        <div className="flex items-center">
                                            <svg
                                                className="w-6 h-6 text-gray-400"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                            <a
                                                href="/my-recipes"
                                                className="ml-1 text-sm font-medium text-gray-700 hover:text-orange-600 md:ml-2"
                                            >
                                                My Recipes
                                            </a>
                                        </div>
                                    </li>
                                    <li aria-current="page">
                                        <div className="flex items-center">
                                            <svg
                                                className="w-6 h-6 text-gray-400"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                            <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                                                Create Recipe
                                            </span>
                                        </div>
                                    </li>
                                </ol>
                            </nav>
                        </div>

                        {/* Page Title */}
                        <div className="mt-4">
                            <h1 className="text-3xl font-bold text-gray-900">
                                Create a New Recipe
                            </h1>
                            <p className="mt-2 text-lg text-gray-600">
                                Share your culinary creation with the MelonKitchen community
                            </p>
                        </div>
                    </div>
                </div>

                {/* Recipe Form Section */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <RecipeForm
                            initialData={initialData}
                            categories={categories}
                            tags={tags}
                            ingredients={ingredients}
                            units={units}
                            onSubmit={handleSubmit}
                            processing={processing}
                            errors={errors}
                            submitLabel="Create Recipe"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
