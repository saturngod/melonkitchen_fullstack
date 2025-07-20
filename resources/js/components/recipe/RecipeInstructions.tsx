import { useState } from 'react';
import { RecipeInstruction } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RecipeInstructionsProps {
    instructions: RecipeInstruction[];
}

export default function RecipeInstructions({ instructions }: RecipeInstructionsProps) {
    const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

    if (!instructions || instructions.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="bg-muted rounded-lg p-8 border">
                    <svg className="mx-auto h-16 w-16 text-muted-foreground mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <p className="text-xl font-semibold mb-2">No Instructions Available</p>
                    <p className="text-muted-foreground">This recipe doesn't have any cooking instructions yet.</p>
                </div>
            </div>
        );
    }

    const sortedInstructions = [...instructions].sort((a, b) => a.step_number - b.step_number);

    const toggleStepCompletion = (instructionId: string) => {
        setCompletedSteps(prev => {
            const newSet = new Set(prev);
            if (newSet.has(instructionId)) {
                newSet.delete(instructionId);
            } else {
                newSet.add(instructionId);
            }
            return newSet;
        });
    };

    return (
        <div className="space-y-8">
            {/* Instructions header with progress */}
            <div className="bg-muted border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-semibold">Cooking Progress</h3>
                        <p className="text-sm text-muted-foreground">
                            {completedSteps.size} of {instructions.length} steps completed
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-32 bg-secondary rounded-full h-3">
                            <div
                                className="bg-primary h-3 rounded-full transition-all duration-500 ease-out"
                                style={{
                                    width: `${(completedSteps.size / instructions.length) * 100}%`
                                }}
                            />
                        </div>
                        <span className="text-lg font-bold">
                            {Math.round((completedSteps.size / instructions.length) * 100)}%
                        </span>
                    </div>
                </div>

                {completedSteps.size === instructions.length && (
                    <div className="bg-muted border rounded-lg p-4 mt-4">
                        <div className="flex items-center space-x-2">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-bold text-lg">Congratulations! Recipe completed!</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Instructions list */}
            <div className="space-y-6">
                {sortedInstructions.map((instruction, index) => {
                    const isCompleted = completedSteps.has(instruction.id);
                    const isNext = !isCompleted && index === 0 || (index > 0 && completedSteps.has(sortedInstructions[index - 1].id) && !isCompleted);

                    return (
                        <div
                            key={instruction.id}
                            className={`relative transition-all duration-300 ${isCompleted
                                    ? 'opacity-75'
                                    : isNext
                                        ? 'ring-2 ring-ring shadow-lg'
                                        : ''
                                }`}
                        >
                            {/* Step connector line */}
                            {index < sortedInstructions.length - 1 && (
                                <div
                                    className={`absolute left-8 top-20 w-0.5 h-8 transition-colors duration-300 ${isCompleted ? 'bg-primary' : 'bg-border'
                                        }`}
                                />
                            )}

                            <Card className={`transition-all duration-300 ${isCompleted
                                    ? 'bg-muted'
                                    : isNext
                                        ? 'border-primary'
                                        : ''
                                }`}>
                                <CardContent className="p-6">
                                    <div className="flex items-start space-x-4">
                                        {/* Step number/checkbox */}
                                        <button
                                            onClick={() => toggleStepCompletion(instruction.id)}
                                            className={`flex-shrink-0 w-16 h-16 rounded-full border-2 flex items-center justify-center font-bold text-lg transition-all duration-300 ${isCompleted
                                                    ? 'bg-primary border-primary text-primary-foreground'
                                                    : isNext
                                                        ? 'bg-muted border-primary hover:bg-accent'
                                                        : 'bg-muted border-border hover:bg-accent'
                                                }`}
                                            aria-label={`Mark step ${instruction.step_number} as ${isCompleted ? 'incomplete' : 'complete'}`}
                                        >
                                            {isCompleted ? (
                                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                <span>{instruction.step_number}</span>
                                            )}
                                        </button>

                                        {/* Step content */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className={`text-xl font-bold mb-4 transition-colors duration-300 ${isCompleted
                                                    ? 'line-through text-muted-foreground'
                                                    : ''
                                                }`}>
                                                Step {instruction.step_number}
                                                {isNext && (
                                                    <span className="ml-2 text-sm bg-primary text-primary-foreground px-2 py-1 rounded-full">
                                                        Next
                                                    </span>
                                                )}
                                            </h4>

                                            {/* Step instruction text */}
                                            <div className={`text-base leading-relaxed mb-4 transition-colors duration-300 ${isCompleted
                                                    ? 'text-muted-foreground'
                                                    : ''
                                                }`}>
                                                {instruction.instruction}
                                            </div>

                                            {/* Step image if available */}
                                            {instruction.image_url && (
                                                <div className="mt-4">
                                                    <img
                                                        src={instruction.image_url}
                                                        alt={`Step ${instruction.step_number} visual guide`}
                                                        className="w-full max-w-md h-64 object-cover rounded-lg border"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    );
                })}
            </div>

            {/* Cooking tips */}
            <div className="bg-muted border rounded-lg p-6">
                <div className="flex items-start space-x-3">
                    <svg className="w-6 h-6 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <div>
                        <p className="text-lg font-semibold mb-2">
                            Cooking Tips
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Click on step numbers to mark them as complete</li>
                            <li>• Follow the highlighted "Next" step for best results</li>
                            <li>• Take your time and don't rush the cooking process</li>
                            <li>• Have all ingredients ready before you start cooking</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}