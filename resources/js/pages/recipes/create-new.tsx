import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import RecipeForm, { RecipeFormData } from '@/components/recipe/RecipeForm';

interface Category {
    id: string;
    name: string;
    parent?: Category;
}

interface Tag {
    id: string;
    name: string;
    is_public: boolean;
}

interface Ingredient {
    id: string;
    name: string;
}

interface Unit {
    id: string;
    name: string;
    abbreviation: string;
}

interface CreateRecipeProps {
    categories: Category[];
    tags: Tag[];
    ingredients: Ingredient[];
    units: Unit[];
}

export default function CreateRecipe({ categories, tags, ingredients, units }: CreateRecipeProps) {
    const [currentIngredients, setCurrentIngredients] = useState(ingredients);

    const initialData: RecipeFormData = {
        title: '',
        description: '',
        servings: 1,
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

    const { data, setData, post, processing, errors } = useForm(initialData);

    const handleIngredientsUpdate = () => {
        // Refresh ingredients by making a request to get updated ingredients list
        router.reload({
            only: ['ingredients'],
            onSuccess: (page: any) => {
                setCurrentIngredients(page.props.ingredients);
            }
        });
    };

    const handleSubmit = (formData: RecipeFormData) => {
        setData(formData);
        post(route('recipes.store'), {
            onSuccess: () => {
                router.get(route('recipes.index'));
            },
            onError: (errors) => {
                console.log('Form submission errors:', errors);
            }
        });
    };

    const breadcrumbs = [
        { title: 'Recipes', href: '/dashboard/recipes' },
        { title: 'Create Recipe', href: '/dashboard/recipes/create' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Recipe" />
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Create Recipe</h1>
                <p className="text-muted-foreground mt-2">
                    Create a new recipe by following the steps below.
                </p>
            </div>

            <RecipeForm
                initialData={initialData}
                categories={categories}
                tags={tags}
                ingredients={currentIngredients}
                units={units}
                errors={errors}
                processing={processing}
                onSubmit={handleSubmit}
                submitLabel="Create Recipe"
                onIngredientsUpdate={handleIngredientsUpdate}
            />
        </AppLayout>
    );
}
