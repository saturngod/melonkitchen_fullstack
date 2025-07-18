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
        quantity: number;
        unit_id: string;
        notes: string;
        is_optional: boolean;
    }>;

    // Step 3: Instructions
    instructions: Array<{
        step_number: number;
        instruction: string;
        image?: File;
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
        difficulty: 'easy' as 'easy',
        prep_time_minutes: 0,
        cook_time_minutes: 0,
        youtube_url: '',
        category_id: '',
        tag_ids: [],
        ingredients: [],
        instructions: [{ step_number: 1, instruction: '' }],
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
        post(route('recipes.store'), {
            onError: () => {
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
                <div className="mb-8">
                    <nav aria-label="Progress">
                        <ol className="flex flex-wrap items-center">
                            {STEPS.map((step, stepIdx) => (
                                <li key={step.id} className={`relative ${stepIdx !== STEPS.length - 1 ? 'pr-4 sm:pr-20' : ''}`}>
                                    <div className="flex items-center">
                                        <button
                                            onClick={() => handleStepClick(step.id)}
                                            className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-150 ${step.id === currentStep
                                                ? 'border-primary bg-primary text-primary-foreground'
                                                : step.id < currentStep
                                                    ? 'border-primary bg-primary text-primary-foreground'
                                                    : 'border-muted-foreground bg-background text-muted-foreground'
                                                } ${stepHasError(stepIdx) ? 'border-red-500 ring-2 ring-red-500' : ''}`}
                                            aria-current={step.id === currentStep ? 'step' : undefined}
                                            aria-label={`Step ${step.id}: ${step.title}`}
                                            tabIndex={0}
                                        >
                                            <span className="text-sm font-medium">{step.id}</span>
                                        </button>
                                        <span className="ml-2 min-w-0 flex flex-col">
                                            <span className={`text-sm font-medium ${step.id === currentStep ? 'text-primary' : 'text-muted-foreground'
                                                }`}>
                                                {step.title}
                                            </span>
                                            <span className="text-xs sm:text-sm text-muted-foreground">{step.description}</span>
                                            {stepHasError(stepIdx) && (
                                                <span className="text-xs text-red-500">Please fix errors</span>
                                            )}
                                        </span>
                                    </div>
                                    {stepIdx !== STEPS.length - 1 && (
                                        <div className="absolute top-5 left-5 -ml-px mt-0.5 h-full w-0.5 bg-muted-foreground" aria-hidden="true" />
                                    )}
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
                <div className="flex flex-col sm:flex-row justify-between gap-4">
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
                                onClick={handleSubmit}
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