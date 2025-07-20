import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InformationStep from '@/components/recipe/InformationStep';
import CategoryTagsIngredientsStep from '@/components/recipe/CategoryTagsIngredientsStep';
import InstructionsStep from './InstructionsStep';
import NutritionStep from './NutritionStep';

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

interface RecipeFormData {
    // Step 1: Information
    title: string;
    description: string;
    servings: number;
    difficulty: 'beginner' | 'easy' | 'medium' | 'hard' | 'expert';
    prep_time_minutes: number;
    cook_time_minutes: number;
    image?: File;
    youtube_url: string;

    // Step 2: Category/Tags/Ingredients
    category_id: string;
    tag_ids: string[];
    ingredients: Array<{
        ingredient_id: string;
        quantity: string; // Changed to string to allow "1/2", "half", etc.
        unit_id: string;
        notes: string;
        is_optional: boolean;
    }>;

    // Step 3: Instructions
    instructions: Array<{
        step_number: number;
        instruction: string;
        image?: File | null;
    }>;

    // Step 4: Nutrition
    nutrition: {
        calories?: number;
        protein_g?: number;
        carbs_g?: number;
        fat_g?: number;
        fiber_g?: number;
        sugar_g?: number;
        sodium_mg?: number;
    };
}

const STEPS = [
    { id: 1, title: 'Information', description: 'Basic recipe details' },
    { id: 2, title: 'Category/Tags/Ingredients', description: 'Categorize and add ingredients' },
    { id: 3, title: 'Instructions', description: 'Step-by-step cooking instructions' },
    { id: 4, title: 'Nutrition', description: 'Optional nutritional information' },
];

export default function CreateRecipe({ categories, tags, ingredients, units }: CreateRecipeProps) {
    // Step validation logic
    const stepValidations = [
        () => data.title && data.description && data.servings > 0 && data.difficulty && data.prep_time_minutes >= 0 && data.cook_time_minutes >= 0,
        () => data.category_id && data.ingredients.length > 0,
        () => data.instructions.length > 0 && data.instructions.every(i => i.instruction),
        () => true, // Nutrition is optional
    ];
    const [currentStep, setCurrentStep] = useState(1);
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        servings: 1,
        difficulty: 'easy' as const,
        prep_time_minutes: 0,
        cook_time_minutes: 0,
        youtube_url: '',
        category_id: '',
        tag_ids: [],
        ingredients: [],
        instructions: [{ step_number: 1, instruction: '', image: null }],
        nutrition: {},
    });
    const firstErrorStep = stepValidations.findIndex(validate => !validate());
    const stepHasError = (stepIdx: number) => {
        if (errors) {
            if (stepIdx === 0 && (errors.title || errors.description || errors.servings || errors.difficulty || errors.prep_time_minutes || errors.cook_time_minutes)) return true;
            if (stepIdx === 1 && (errors.category_id || errors.ingredients)) return true;
            if (stepIdx === 2 && errors.instructions) return true;
            if (stepIdx === 3 && errors.nutrition) return true;
        }
        return false;
    };
    const handleNext = () => {
        if (currentStep < STEPS.length) {
            if (!stepValidations[currentStep - 1]()) {
                alert('Please complete all required fields before proceeding.');
                return;
            }
            setCurrentStep(currentStep + 1);
        }
    };
    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };
    const handleStepClick = (step: number) => {
        if (step > currentStep && !stepValidations[currentStep - 1]()) {
            alert('Please complete all required fields before proceeding.');
            return;
        }
        setCurrentStep(step);
    };
    const handleSubmit = () => {
        console.log('Submit clicked, data:', data);
        console.log('Validation errors:', errors);

        // Check if all steps are valid
        const allValid = stepValidations.every(validate => validate());
        console.log('All steps valid:', allValid);

        if (!allValid) {
            console.log('Validation failed for some steps');
            alert('Please complete all required fields before submitting.');
            if (firstErrorStep >= 0) setCurrentStep(firstErrorStep + 1);
            return;
        }

        console.log('Submitting form...');
        post(route('recipes.store'), {
            onSuccess: () => {
                console.log('Recipe created successfully');
            },
            onError: (errors) => {
                console.log('Form submission errors:', errors);
                if (firstErrorStep >= 0) setCurrentStep(firstErrorStep + 1);
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
            <div className="max-w-4xl mx-auto px-2 sm:px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Create Recipe</h1>
                    <p className="text-muted-foreground mt-2">
                        Create a new recipe by following the steps below.
                    </p>
                </div>
                {/* Minimal Stepper Navigation - Horizontal Row, Small Step Numbers Only */}
                <div className="mb-8">
                    <nav aria-label="Progress">
                        <ol className="flex justify-center items-center gap-6">
                            {STEPS.map((step, stepIdx) => (
                                <li key={step.id}>
                                    <button
                                        onClick={() => handleStepClick(step.id)}
                                        className={`h-8 w-8 flex items-center justify-center rounded-full border-2 text-base font-semibold transition-all duration-150
                                            ${currentStep === step.id ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-400 bg-white text-neutral-900'}
                                            ${stepHasError(stepIdx) ? 'border-red-500 ring-2 ring-red-500' : ''}`}
                                        aria-current={currentStep === step.id ? 'step' : undefined}
                                        aria-label={`Step ${step.id}`}
                                        tabIndex={0}
                                    >
                                        {step.id}
                                    </button>
                                </li>
                            ))}
                        </ol>
                    </nav>
                </div>
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {currentStep === 1 && (
                            <InformationStep
                                data={data}
                                setData={setData}
                                errors={errors}
                            />
                        )}
                        {currentStep === 2 && (
                            <CategoryTagsIngredientsStep
                                data={data}
                                setData={setData}
                                errors={errors}
                                categories={categories}
                                tags={tags}
                                ingredients={ingredients}
                                units={units}
                            />
                        )}
                        {currentStep === 3 && (
                            <InstructionsStep
                                instructions={data.instructions}
                                setInstructions={(instructions: any) => setData('instructions', instructions)}
                            />
                        )}
                        {currentStep === 4 && (
                            <NutritionStep
                                nutrition={data.nutrition}
                                setNutrition={(nutrition: any) => setData('nutrition', nutrition)}
                                errors={errors.nutrition as any}
                            />
                        )}
                    </CardContent>
                </Card>
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-5">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentStep === 1}
                        aria-label="Previous Step"
                    >
                        Previous
                    </Button>
                    <div className="flex gap-2">
                        {currentStep < STEPS.length ? (
                            <Button
                                type="button"
                                onClick={handleNext}
                                aria-label="Next Step"
                            >
                                Next
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                onClick={() => {
                                    console.log('Create Recipe button clicked!');
                                    handleSubmit();
                                }}
                                disabled={processing}
                                aria-label="Create Recipe"
                            >
                                {processing ? 'Creating...' : 'Create Recipe'}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}