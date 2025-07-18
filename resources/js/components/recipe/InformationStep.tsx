import React, { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X } from 'lucide-react';

interface InformationStepProps {
    data: {
        title: string;
        description: string;
        servings: number;
        difficulty: 'beginner' | 'easy' | 'medium' | 'hard' | 'expert';
        prep_time_minutes: number;
        cook_time_minutes: number;
        image?: File;
        youtube_url: string;
    };
    setData: (key: string, value: any) => void;
    errors: Record<string, string>;
}

const DIFFICULTY_OPTIONS = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
    { value: 'expert', label: 'Expert' },
];

export default function InformationStep({ data, setData, errors }: InformationStepProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setData('image', file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setData('image', undefined);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
                <Label htmlFor="title">
                    Recipe Title <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="title"
                    type="text"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    placeholder="Enter recipe title"
                    className={errors.title ? 'border-destructive' : ''}
                />
                {errors.title && (
                    <p className="text-sm text-destructive">{errors.title}</p>
                )}
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="description">
                    Description <span className="text-destructive">*</span>
                </Label>
                <textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Describe your recipe..."
                    rows={4}
                    className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.description ? 'border-destructive' : ''
                        }`}
                />
                {errors.description && (
                    <p className="text-sm text-destructive">{errors.description}</p>
                )}
            </div>

            {/* Servings and Difficulty */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="servings">
                        Servings <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="servings"
                        type="number"
                        min="1"
                        value={data.servings}
                        onChange={(e) => setData('servings', parseInt(e.target.value) || 1)}
                        className={errors.servings ? 'border-destructive' : ''}
                    />
                    {errors.servings && (
                        <p className="text-sm text-destructive">{errors.servings}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="difficulty">
                        Difficulty <span className="text-destructive">*</span>
                    </Label>
                    <Select
                        value={data.difficulty}
                        onValueChange={(value) => setData('difficulty', value)}
                    >
                        <SelectTrigger className={errors.difficulty ? 'border-destructive' : ''}>
                            <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                            {DIFFICULTY_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.difficulty && (
                        <p className="text-sm text-destructive">{errors.difficulty}</p>
                    )}
                </div>
            </div>

            {/* Prep Time and Cook Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="prep_time">
                        Prep Time (minutes) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="prep_time"
                        type="number"
                        min="0"
                        value={data.prep_time_minutes}
                        onChange={(e) => setData('prep_time_minutes', parseInt(e.target.value) || 0)}
                        className={errors.prep_time_minutes ? 'border-destructive' : ''}
                    />
                    {errors.prep_time_minutes && (
                        <p className="text-sm text-destructive">{errors.prep_time_minutes}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="cook_time">
                        Cook Time (minutes) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="cook_time"
                        type="number"
                        min="0"
                        value={data.cook_time_minutes}
                        onChange={(e) => setData('cook_time_minutes', parseInt(e.target.value) || 0)}
                        className={errors.cook_time_minutes ? 'border-destructive' : ''}
                    />
                    {errors.cook_time_minutes && (
                        <p className="text-sm text-destructive">{errors.cook_time_minutes}</p>
                    )}
                </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
                <Label>Recipe Image (Optional)</Label>
                <div className="space-y-4">
                    {imagePreview ? (
                        <Card>
                            <CardContent className="p-4">
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Recipe preview"
                                        className="w-full h-48 object-cover rounded-md"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-2 right-2"
                                        onClick={removeImage}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div
                            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">
                                Click to upload recipe image
                            </p>
                            <p className="text-xs text-muted-foreground">
                                PNG, JPG, WebP up to 2MB
                            </p>
                        </div>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                    />
                    {errors.image && (
                        <p className="text-sm text-destructive">{errors.image}</p>
                    )}
                </div>
            </div>

            {/* YouTube URL */}
            <div className="space-y-2">
                <Label htmlFor="youtube_url">YouTube URL (Optional)</Label>
                <Input
                    id="youtube_url"
                    type="url"
                    value={data.youtube_url}
                    onChange={(e) => setData('youtube_url', e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className={errors.youtube_url ? 'border-destructive' : ''}
                />
                {errors.youtube_url && (
                    <p className="text-sm text-destructive">{errors.youtube_url}</p>
                )}
            </div>
        </div>
    );
}