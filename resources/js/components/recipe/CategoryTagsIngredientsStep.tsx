import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Combobox } from '@/components/ui/combobox';
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
}

interface Unit {
    id: string;
    name: string;
    abbreviation: string;
}

interface RecipeIngredient {
    ingredient_id: string;
    quantity: number;
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
        quantity: 1,
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

    const handleTagToggle = (tagId: string) => {
        const currentTags = data.tag_ids;
        const updatedTags = currentTags.includes(tagId)
            ? currentTags.filter(id => id !== tagId)
            : [...currentTags, tagId];
        setData('tag_ids', updatedTags);
    };

    const addIngredient = () => {
        if (newIngredient.ingredient_id && newIngredient.unit_id && newIngredient.quantity > 0) {
            setData('ingredients', [...data.ingredients, { ...newIngredient }]);
            setNewIngredient({
                ingredient_id: '',
                quantity: 1,
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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {tags.map((tag) => (
                        <div key={tag.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={`tag-${tag.id}`}
                                checked={data.tag_ids.includes(tag.id)}
                                onCheckedChange={() => handleTagToggle(tag.id)}
                            />
                            <Label
                                htmlFor={`tag-${tag.id}`}
                                className="text-sm font-normal cursor-pointer"
                            >
                                {tag.name}
                                {tag.is_public && (
                                    <Badge variant="secondary" className="ml-1 text-xs">
                                        Public
                                    </Badge>
                                )}
                            </Label>
                        </div>
                    ))}
                </div>
                {data.tag_ids.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {data.tag_ids.map((tagId) => {
                            const tag = tags.find(t => t.id === tagId);
                            return tag ? (
                                <Badge key={tagId} variant="outline">
                                    {tag.name}
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="ml-1 h-auto p-0"
                                        onClick={() => handleTagToggle(tagId)}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            ) : null;
                        })}
                    </div>
                )}
            </div>

            {/* Ingredients */}
            <div className="space-y-4">
                <Label>
                    Ingredients <span className="text-destructive">*</span>
                </Label>

                {/* Add New Ingredient */}
                <Card>
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
                                    onValueChange={(value) => setNewIngredient({ ...newIngredient, ingredient_id: value })}
                                    placeholder="Select ingredient..."
                                    allowEmpty={false}
                                />
                            </div>
                            <div>
                                <Label htmlFor="new-quantity">Quantity</Label>
                                <Input
                                    id="new-quantity"
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={newIngredient.quantity}
                                    onChange={(e) => setNewIngredient({ ...newIngredient, quantity: parseFloat(e.target.value) || 0 })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="new-unit">Unit</Label>
                                <Select
                                    value={newIngredient.unit_id}
                                    onValueChange={(value) => setNewIngredient({ ...newIngredient, unit_id: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {unitOptions.map((unit) => (
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
                            disabled={!newIngredient.ingredient_id || !newIngredient.unit_id || newIngredient.quantity <= 0}
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