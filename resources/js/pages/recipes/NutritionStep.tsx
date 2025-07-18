import React from 'react';

interface NutritionInput {
    calories?: number;
    protein_g?: number;
    carbs_g?: number;
    fat_g?: number;
    fiber_g?: number;
    sugar_g?: number;
    sodium_mg?: number;
}

interface NutritionStepProps {
    nutrition: NutritionInput;
    setNutrition: (nutrition: NutritionInput) => void;
    errors?: Partial<Record<keyof NutritionInput, string>>;
}

const NutritionStep: React.FC<NutritionStepProps> = ({ nutrition, setNutrition, errors }) => {
    const handleChange = (field: keyof NutritionInput, value: string) => {
        const num = value === '' ? undefined : Number(value);
        setNutrition({ ...nutrition, [field]: isNaN(num!) ? undefined : num });
    };

    return (
        <div>
            <h2>Nutrition Information (Optional)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    { label: 'Calories', key: 'calories' },
                    { label: 'Protein (g)', key: 'protein_g' },
                    { label: 'Carbs (g)', key: 'carbs_g' },
                    { label: 'Fat (g)', key: 'fat_g' },
                    { label: 'Fiber (g)', key: 'fiber_g' },
                    { label: 'Sugar (g)', key: 'sugar_g' },
                    { label: 'Sodium (mg)', key: 'sodium_mg' },
                ].map(({ label, key }) => (
                    <div key={key} className="flex flex-col">
                        <label htmlFor={key} className="font-medium mb-1">{label}</label>
                        <input
                            id={key}
                            type="number"
                            min="0"
                            value={nutrition[key as keyof NutritionInput] ?? ''}
                            onChange={e => handleChange(key as keyof NutritionInput, e.target.value)}
                            className="border rounded px-2 py-1"
                            placeholder={`Enter ${label.toLowerCase()} (optional)`}
                        />
                        {errors && errors[key as keyof NutritionInput] && (
                            <span className="text-red-500 text-xs mt-1">{errors[key as keyof NutritionInput]}</span>
                        )}
                    </div>
                ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">All fields are optional. Enter numeric values only.</p>
        </div>
    );
};

export default NutritionStep;
