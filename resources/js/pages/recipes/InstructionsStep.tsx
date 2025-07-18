import React from 'react';
import FileUpload from '@/components/common/FileUpload';

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
    // No drag-and-drop logic

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
    };

    return (
        <div>
            <h2>Instructions</h2>
            {instructions.map((inst, idx) => (
                <div key={inst.step_number} style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                    <span style={{ marginRight: 8 }}>Step {inst.step_number}</span>
                    <input
                        type="text"
                        value={inst.instruction}
                        onChange={e => updateInstruction(idx, e.target.value)}
                        placeholder="Instruction"
                        style={{ flex: 1, marginRight: 8 }}
                    />
                    <FileUpload
                        label="Step Image"
                        value={inst.image || null}
                        onFileChange={file => handleImageChange(idx, file)}
                        maxSizeMB={2}
                        accept="image/*"
                    />
                    <button type="button" onClick={() => removeStep(idx)} disabled={instructions.length === 1}>
                        Delete
                    </button>
                </div>
            ))}
            <button type="button" onClick={addStep} style={{ marginTop: 16 }}>
                Add Step
            </button>
        </div>
    );
};

export default InstructionsStep;
