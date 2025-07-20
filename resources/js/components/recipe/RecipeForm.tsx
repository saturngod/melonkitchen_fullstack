import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InformationStep from '@/components/recipe/InformationStep';
import CategoryTagsIngredientsStep from '@/components/recipe/CategoryTagsIngredientsStep';
import InstructionsStep from '@/pages/recipes/InstructionsStep';
import NutritionStep from '@/pages/recipes/NutritionStep';

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

export interface RecipeFormData {
    title: string;
    description: string;
    servings: number;
    difficulty: 'beginner' | 'easy' | 'medium' | 'hard' | 'expert';
    prep_time_minutes: number;
    cook_time_minutes: number;
    image?: File;
    youtube_url: string;
    category_id: string;
    tag_ids: string[];
    ingredients: Array<{
        ingredient_id: string;
        quantity: string;
        unit_id: string;
        notes: string;
        is_optional: boolean;
    }>;
    instructions: Array<{
        step_number: number;
        instruction: string;
        image?: File | null;
    }>;
    nutrition: {
        calories?: number;
        protein_g?: number;
        carbs_g?: number;
        fat_g?: number;
        fiber_g?: number;
        sugar_g?: number;
        sodium_mg?: number;
    };
    [key: string]: any; // This makes it compatible with Inertia's FormDataType
}

interface RecipeFormProps {
    initialData: RecipeFormData;
    categories: Category[];
    tags: Tag[];
    ingredients: Ingredient[];
    units: Unit[];
    errors?: any;
    processing?: boolean;
    onSubmit: (data: RecipeFormData) => void;
    submitLabel?: string;
}

const STEPS = [
    { id: 1, title: 'Information', description: 'Basic recipe details' },
    { id: 2, title: 'Category/Tags/Ingredients', description: 'Categorize and add ingredients' },
    { id: 3, title: 'Instructions', description: 'Step-by-step cooking instructions' },
    { id: 4, title: 'Nutrition', description: 'Optional nutritional information' },
];

const RecipeForm: React.FC<RecipeFormProps> = ({
    initialData,
    categories,
    tags,
    ingredients,
    units,
    errors = {},
    processing = false,
    onSubmit,
    submitLabel = 'Save Recipe',
}) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [data, setData] = useState<RecipeFormData>(initialData);

    const stepValidations = [
        () => data.title && data.description && data.servings > 0 && data.difficulty && data.prep_time_minutes >= 0 && data.cook_time_minutes >= 0,
        () => data.category_id && data.ingredients.length > 0,
        () => data.instructions.length > 0 && data.instructions.every(i => i.instruction),
        () => true,
    ];
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
        const allValid = stepValidations.every(validate => validate());
        if (!allValid) {
            alert('Please complete all required fields before submitting.');
            if (firstErrorStep >= 0) setCurrentStep(firstErrorStep + 1);
            return;
        }
        onSubmit(data);
    };
    return (
        <div className="max-w-4xl mx-auto px-2 sm:px-4">
            {/* Minimal Stepper Navigation */}
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
                            setData={(updates) => setData(prev => ({ ...prev, ...updates }))}
                            errors={errors}
                        />
                    )}
                    {currentStep === 2 && (
                        <CategoryTagsIngredientsStep
                            data={data}
                            setData={(key, value) => setData(prev => ({ ...prev, [key]: value }))}
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
                            setInstructions={(instructions: any) => setData(prev => ({ ...prev, instructions }))}
                        />
                    )}
                    {currentStep === 4 && (
                        <NutritionStep
                            nutrition={data.nutrition}
                            setNutrition={(nutrition: any) => setData(prev => ({ ...prev, nutrition }))}
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
                            onClick={handleSubmit}
                            disabled={processing}
                            aria-label={submitLabel}
                        >
                            {processing ? 'Saving...' : submitLabel}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecipeForm;
