import React from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import RecipeForm, { RecipeFormData } from '@/components/recipe/RecipeForm';
import { DetailedRecipe } from '@/types';

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

interface EditRecipeProps {
    recipe: DetailedRecipe;
    categories: Category[];
    tags: Tag[];
    ingredients: Ingredient[];
    units: Unit[];
}

export default function EditRecipe({ recipe, categories, tags, ingredients, units }: EditRecipeProps) {
    const initialData: RecipeFormData = {
        title: recipe.title || '',
        description: recipe.description || '',
        servings: recipe.servings || 1,
        difficulty: (recipe.difficulty as RecipeFormData['difficulty']) || 'easy',
        prep_time_minutes: recipe.prep_time_minutes || 0,
        cook_time_minutes: recipe.cook_time_minutes || 0,
        youtube_url: recipe.youtube_url || '',
        category_id: recipe.categories?.[0]?.id || '',
        tag_ids: recipe.tags?.map(tag => tag.id) || [],
        ingredients: recipe.recipeIngredients?.map(ingredient => ({
            ingredient_id: ingredient.ingredient.id,
            quantity: ingredient.quantity || '',
            unit_id: ingredient.unit?.id || '',
            notes: ingredient.notes || '',
            is_optional: ingredient.is_optional || false,
        })) || [],
        instructions: recipe.instructions?.map(instruction => ({
            step_number: instruction.step_number,
            instruction: instruction.instruction,
            image: null, // Images will be handled separately for existing recipes
        })) || [{ step_number: 1, instruction: '', image: null }],
        nutrition: {
            calories: recipe.nutritionInfo?.calories_per_serving,
            protein_g: recipe.nutritionInfo?.protein_grams,
            carbs_g: recipe.nutritionInfo?.carbs_grams,
            fat_g: recipe.nutritionInfo?.fat_grams,
            fiber_g: recipe.nutritionInfo?.fiber_grams,
            sugar_g: recipe.nutritionInfo?.sugar_grams,
            sodium_mg: recipe.nutritionInfo?.sodium_mg,
        },
    };

    const { data, setData, put, processing, errors } = useForm(initialData);

    const handleSubmit = (formData: RecipeFormData) => {
        setData(formData);
        put(route('recipes.update', { recipe: recipe.id }), {
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
        { title: recipe.title, href: `/dashboard/recipes/${recipe.id}` },
        { title: 'Edit Recipe', href: `/dashboard/recipes/${recipe.id}/edit` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Recipe - ${recipe.title}`} />
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Edit Recipe</h1>
                <p className="text-muted-foreground mt-2">
                    Update your recipe by modifying the fields below.
                </p>
            </div>

            <RecipeForm
                initialData={initialData}
                categories={categories}
                tags={tags}
                ingredients={ingredients}
                units={units}
                errors={errors}
                processing={processing}
                onSubmit={handleSubmit}
                submitLabel="Update Recipe"
            />
        </AppLayout>
    );
}
