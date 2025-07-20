import { useState } from 'react';
import { RecipeInstruction } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RecipeInstructionsProps {
    instructions: RecipeInstruction[];
}

export default function RecipeInstructions({ instructions }: RecipeInstructionsProps) {
    const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
    const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

    if (!instructions || instructions.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">No instructions provided</p>
            </div>
        );
    }

    const toggleStepCompletion = (stepId: string) => {
        const newCompleted = new Set(completedSteps);
        if (newCompleted.has(stepId)) {
            newCompleted.delete(stepId);
        } else {
            newCompleted.add(stepId);
        }
        setCompletedSteps(newCompleted);
    };

    const handleImageError = (stepId: string) => {
        setImageErrors(prev => new Set([...prev, stepId]));
    };

    // Sort instructions by step number to ensure proper order
    const sortedInstructions = [...instructions].sort((a, b) => a.step_number - b.step_number);

    return (
        <div className="space-y-6">
            {/* Instructions header with progress */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-muted-foreground">
                        {completedSteps.size} of {instructions.length} steps completed
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-32 bg-muted rounded-full h-2">
                        <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{
                                width: `${(completedSteps.size / instructions.length) * 100}%`
                            }}
                        />
                    </div>
                    <span className="text-sm text-muted-foreground">
                        {Math.round((completedSteps.size / instructions.length) * 100)}%
                    </span>
                </div>
            </div>

            {/* Instructions list */}
            <div className="space-y-4">
                {sortedInstructions.map((instruction) => {
                    const isCompleted = completedSteps.has(instruction.id);
                    const hasImageError = imageErrors.has(instruction.id);

                    return (
                        <Card
                            key={instruction.id}
                            className={`transition-all duration-200 ${isCompleted
                                    ? 'bg-muted/50 border-primary/30'
                                    : 'hover:shadow-md'
                                }`}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start gap-3">
                                    {/* Step completion checkbox */}
                                    <button
                                        onClick={() => toggleStepCompletion(instruction.id)}
                                        className={`flex-shrink-0 mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isCompleted
                                                ? 'bg-primary border-primary text-primary-foreground'
                                                : 'border-muted-foreground hover:border-primary'
                                            }`}
                                        aria-label={`Mark step ${instruction.step_number} as ${isCompleted ? 'incomplete' : 'complete'}`}
                                    >
                                        {isCompleted ? (
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <span className="text-sm font-semibold">
                                                {instruction.step_number}
                                            </span>
                                        )}
                                    </button>

                                    {/* Step title */}
                                    <CardTitle className={`text-base flex-1 ${isCompleted ? 'text-muted-foreground line-through' : ''
                                        }`}>
                                        Step {instruction.step_number}
                                    </CardTitle>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {/* Step instruction text */}
                                <div className={`text-sm leading-relaxed ${isCompleted ? 'text-muted-foreground' : 'text-foreground'
                                    }`}>
                                    {instruction.instruction}
                                </div>

                                {/* Step image if available */}
                                {instruction.image_url && !hasImageError && (
                                    <div className="mt-4">
                                        <img
                                            src={instruction.image_url}
                                            alt={`Step ${instruction.step_number} illustration`}
                                            className={`w-full max-w-md rounded-lg object-cover transition-opacity ${isCompleted ? 'opacity-60' : ''
                                                }`}
                                            style={{ maxHeight: '300px' }}
                                            onError={() => handleImageError(instruction.id)}
                                            loading="lazy"
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Completion message */}
            {completedSteps.size === instructions.length && (
                <div className="text-center py-6">
                    <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 px-4 py-2 rounded-full">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">Recipe completed! Great job!</span>
                    </div>
                </div>
            )}

            {/* Cooking tips */}
            <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <div>
                        <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                            Cooking Tip
                        </p>
                        <p className="text-sm text-amber-700 dark:text-amber-200 mt-1">
                            Check off each step as you complete it to keep track of your progress and avoid missing any steps.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}