import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Combobox } from '@/components/ui/combobox';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X } from 'lucide-react';

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
    units?: Unit[]; // Units available for this ingredient
}

interface Unit {
    id: string;
    name: string;
    abbreviation: string;
}

interface RecipeIngredient {
    ingredient_id: string;
    quantity: string; // Changed to string to allow "1/2", "half", etc.
    unit_id: string;
    notes: string;
    is_optional: boolean;
}

interface CategoryTagsIngredientsStepProps {
    data: {
        category_id: string;
        tag_ids: string[];
        ingredients: RecipeIngredient[];
    };
    setData: (key: string, value: any) => void;
    errors: Record<string, string>;
    categories: Category[];
    tags: Tag[];
    ingredients: Ingredient[];
    units: Unit[];
}

export default function CategoryTagsIngredientsStep({
    data,
    setData,
    errors,
    categories,
    tags,
    ingredients,
    units,
}: CategoryTagsIngredientsStepProps) {
    const [newIngredient, setNewIngredient] = useState<RecipeIngredient>({
        ingredient_id: '',
        quantity: '1',
        unit_id: '',
        notes: '',
        is_optional: false,
    });

    // Transform categories for combobox
    const categoryOptions = categories.map(category => ({
        value: category.id,
        label: category.parent ? `${category.parent.name} > ${category.name}` : category.name,
    }));

    // Transform ingredients for combobox
    const ingredientOptions = ingredients.map(ingredient => ({
        value: ingredient.id,
        label: ingredient.name,
    }));

    // Transform units for select
    const unitOptions = units.map(unit => ({
        value: unit.id,
        label: `${unit.name} (${unit.abbreviation})`,
    }));

    // Transform tags for multi-select
    const tagOptions = tags.map(tag => ({
        value: tag.id,
        label: tag.name,
    }));

    // Get available units for the selected ingredient
    const getAvailableUnits = (ingredientId: string) => {
        const ingredient = ingredients.find(ing => ing.id === ingredientId);
        if (ingredient?.units && ingredient.units.length > 0) {
            return ingredient.units.map(unit => ({
                value: unit.id,
                label: `${unit.name} (${unit.abbreviation})`,
            }));
        }
        // Fallback to all units if ingredient doesn't have specific units
        return unitOptions;
    };

    const addIngredient = () => {
        if (newIngredient.ingredient_id && newIngredient.unit_id && newIngredient.quantity.trim()) {
            setData('ingredients', [...data.ingredients, { ...newIngredient }]);
            setNewIngredient({
                ingredient_id: '',
                quantity: '1',
                unit_id: '',
                notes: '',
                is_optional: false,
            });
        }
    };

    const removeIngredient = (index: number) => {
        const updatedIngredients = data.ingredients.filter((_, i) => i !== index);
        setData('ingredients', updatedIngredients);
    };

    const updateIngredient = (index: number, field: keyof RecipeIngredient, value: any) => {
        const updatedIngredients = [...data.ingredients];
        updatedIngredients[index] = { ...updatedIngredients[index], [field]: value };
        setData('ingredients', updatedIngredients);
    };

    const getIngredientName = (ingredientId: string) => {
        return ingredients.find(ing => ing.id === ingredientId)?.name || '';
    };

    const getUnitName = (unitId: string) => {
        return units.find(unit => unit.id === unitId)?.abbreviation || '';
    };

    return (
        <div className="space-y-8">
            {/* Category Selection */}
            <div className="space-y-2">
                <Label>
                    Category <span className="text-destructive">*</span>
                </Label>
                <Combobox
                    options={categoryOptions}
                    value={data.category_id}
                    onValueChange={(value) => setData('category_id', value)}
                    placeholder="Select a category..."
                    allowEmpty={false}
                />
                {errors.category_id && (
                    <p className="text-sm text-destructive">{errors.category_id}</p>
                )}
            </div>

            {/* Tags Selection */}
            <div className="space-y-4">
                <Label>Tags (Optional)</Label>
                <MultiSelect
                    options={tagOptions}
                    onValueChange={(selectedTagIds) => setData('tag_ids', selectedTagIds)}
                    defaultValue={data.tag_ids}
                    placeholder="Select tags..."
                    maxCount={3}
                    className="w-full"
                />
            </div>

            {/* Ingredients */}
            <div className="space-y-4">
                <Label>
                    Ingredients <span className="text-destructive">*</span>
                </Label>

                {/* Add New Ingredient */}
                <Card className='mt-4'>
                    <CardHeader>
                        <CardTitle className="text-lg">Add Ingredient</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-2">
                                <Label htmlFor="new-ingredient">Ingredient</Label>
                                <Combobox
                                    options={ingredientOptions}
                                    value={newIngredient.ingredient_id}
                                    onValueChange={(value) => setNewIngredient({
                                        ...newIngredient,
                                        ingredient_id: value,
                                        unit_id: '' // Clear unit when ingredient changes
                                    })}
                                    placeholder="Select ingredient..."
                                    allowEmpty={false}
                                />
                            </div>
                            <div>
                                <Label htmlFor="new-quantity">Quantity</Label>
                                <Input
                                    id="new-quantity"
                                    type="text"
                                    value={newIngredient.quantity}
                                    onChange={(e) => setNewIngredient({ ...newIngredient, quantity: e.target.value })}
                                    placeholder="e.g., 1, 1/2, 2 cups, half"
                                />
                            </div>
                            <div>
                                <Label htmlFor="new-unit">Unit</Label>
                                <Select
                                    value={newIngredient.unit_id}
                                    onValueChange={(value) => setNewIngredient({ ...newIngredient, unit_id: value })}
                                    disabled={!newIngredient.ingredient_id}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={newIngredient.ingredient_id ? "Select unit" : "Select ingredient first"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {getAvailableUnits(newIngredient.ingredient_id).map((unit) => (
                                            <SelectItem key={unit.value} value={unit.value}>
                                                {unit.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="new-notes">Notes (Optional)</Label>
                                <Input
                                    id="new-notes"
                                    value={newIngredient.notes}
                                    onChange={(e) => setNewIngredient({ ...newIngredient, notes: e.target.value })}
                                    placeholder="e.g., finely chopped, room temperature"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="new-optional"
                                    checked={newIngredient.is_optional}
                                    onCheckedChange={(checked) => setNewIngredient({ ...newIngredient, is_optional: !!checked })}
                                />
                                <Label htmlFor="new-optional">Optional ingredient</Label>
                            </div>
                        </div>
                        <Button
                            type="button"
                            onClick={addIngredient}
                            disabled={!newIngredient.ingredient_id || !newIngredient.unit_id || !newIngredient.quantity.trim()}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Ingredient
                        </Button>
                    </CardContent>
                </Card>

                {/* Ingredients List */}
                {data.ingredients.length > 0 && (
                    <div className="space-y-2">
                        <Label>Recipe Ingredients</Label>
                        {data.ingredients.map((ingredient, index) => (
                            <Card key={index}>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">
                                                    {ingredient.quantity} {getUnitName(ingredient.unit_id)} {getIngredientName(ingredient.ingredient_id)}
                                                </span>
                                                {ingredient.is_optional && (
                                                    <Badge variant="secondary">Optional</Badge>
                                                )}
                                            </div>
                                            {ingredient.notes && (
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {ingredient.notes}
                                                </p>
                                            )}
                                        </div>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => removeIngredient(index)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {errors.ingredients && (
                    <p className="text-sm text-destructive">{errors.ingredients}</p>
                )}
            </div>
        </div>
    );
}