import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, Plus } from 'lucide-react';

// Types
interface InstructionInput {
    step_number: number;
    instruction: string;
    image?: File | null;
}

interface InstructionsStepProps {
    instructions: InstructionInput[];
    setInstructions: (instructions: InstructionInput[]) => void;
}

const InstructionsStep: React.FC<InstructionsStepProps> = ({ instructions, setInstructions }) => {
    const [imagePreviews, setImagePreviews] = useState<{ [key: number]: string }>({});

    // Add new instruction step
    const addStep = () => {
        setInstructions([
            ...instructions,
            { step_number: instructions.length + 1, instruction: '', image: null },
        ]);
    };

    // Remove instruction step
    const removeStep = (idx: number) => {
        const newInstructions = instructions.filter((_, i) => i !== idx).map((inst, i) => ({
            ...inst,
            step_number: i + 1,
        }));
        setInstructions(newInstructions);

        // Remove image preview for this step
        const newPreviews = { ...imagePreviews };
        delete newPreviews[idx];
        // Reindex previews
        const reindexedPreviews: { [key: number]: string } = {};
        Object.keys(newPreviews).forEach(key => {
            const keyNum = parseInt(key);
            if (keyNum > idx) {
                reindexedPreviews[keyNum - 1] = newPreviews[keyNum];
            } else {
                reindexedPreviews[keyNum] = newPreviews[keyNum];
            }
        });
        setImagePreviews(reindexedPreviews);
    };

    // Update instruction text
    const updateInstruction = (idx: number, value: string) => {
        const newInstructions = [...instructions];
        newInstructions[idx].instruction = value;
        setInstructions(newInstructions);
    };

    // Handle image upload
    const handleImageChange = (idx: number, file: File | null) => {
        const newInstructions = [...instructions];
        newInstructions[idx].image = file;
        setInstructions(newInstructions);

        if (file) {
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreviews(prev => ({
                    ...prev,
                    [idx]: e.target?.result as string
                }));
            };
            reader.readAsDataURL(file);
        } else {
            // Remove preview
            setImagePreviews(prev => {
                const newPreviews = { ...prev };
                delete newPreviews[idx];
                return newPreviews;
            });
        }
    };

    const removeImage = (idx: number) => {
        handleImageChange(idx, null);
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <Label className="text-lg font-semibold">
                    Cooking Instructions <span className="text-destructive">*</span>
                </Label>
                <p className="text-sm text-muted-foreground">
                    Add step-by-step instructions for your recipe. You can optionally add an image for each step.
                </p>
            </div>

            <div className="space-y-4">
                {instructions.map((inst, idx) => (
                    <Card key={inst.step_number}>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                                        {inst.step_number}
                                    </div>
                                    Step {inst.step_number}
                                </CardTitle>
                                {instructions.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => removeStep(idx)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Instruction text */}
                            <div className="space-y-2">
                                <Label htmlFor={`instruction-${idx}`}>
                                    Instruction <span className="text-destructive">*</span>
                                </Label>
                                <textarea
                                    id={`instruction-${idx}`}
                                    value={inst.instruction}
                                    onChange={(e) => updateInstruction(idx, e.target.value)}
                                    placeholder="Describe what to do in this step..."
                                    rows={3}
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>

                            {/* Image upload */}
                            <div className="space-y-2">
                                <Label>Step Image (Optional)</Label>
                                {imagePreviews[idx] ? (
                                    <div className="relative">
                                        <img
                                            src={imagePreviews[idx]}
                                            alt={`Step ${inst.step_number} preview`}
                                            className="w-full h-48 object-cover rounded-md"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            className="absolute top-2 right-2"
                                            onClick={() => removeImage(idx)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                                        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                                        <p className="text-sm text-muted-foreground mb-2">
                                            Upload an image for this step
                                        </p>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                const input = document.createElement('input');
                                                input.type = 'file';
                                                input.accept = 'image/*';
                                                input.onchange = (e) => {
                                                    const file = (e.target as HTMLInputElement).files?.[0];
                                                    if (file) {
                                                        handleImageChange(idx, file);
                                                    }
                                                };
                                                input.click();
                                            }}
                                        >
                                            Choose Image
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Button
                type="button"
                variant="outline"
                onClick={addStep}
                className="w-full"
            >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Step
            </Button>
        </div>
    );
};

export default InstructionsStep;
