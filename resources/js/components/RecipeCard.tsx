import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Recipe } from '@/types';

interface RecipeCardProps {
    recipe: Recipe;
    onTogglePublic: (id: string, isPublic: boolean) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function RecipeCard({ recipe, onTogglePublic, onEdit, onDelete }: RecipeCardProps) {
    const formatCategories = (categories: Recipe['categories']) => {
        if (!categories || categories.length === 0) return 'No category';

        return categories.map(category => {
            if (category.parent) {
                return `${category.parent.name} | ${category.name}`;
            }
            return category.name;
        }).join(', ');
    };

    return (
        <Card className="h-full flex flex-col relative">
            <CardHeader className="p-0 relative">
                {/* Three-dot dropdown menu */}
                <div className="absolute top-2 right-2 z-10">
                    <DropdownMenu modal={false} >
                        <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-8 w-8 bg-white/80 hover:bg-white">
                                <span className="sr-only">Open menu</span>
                                ⋮
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => {
                                console.log('Edit recipe:', recipe.id);
                                onEdit(recipe.id);
                            }}>
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onSelect={() => {
                                    console.log('Delete recipe:', recipe.id);
                                    onDelete(recipe.id);
                                }}
                                className="text-destructive focus:text-destructive"
                            >
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                    {recipe.image_url ? (
                        <img
                            src={recipe.image_url}
                            alt={recipe.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.parentElement!.innerHTML = `
                                    <div class="w-full h-full flex items-center justify-center bg-muted">
                                        <span class="text-muted-foreground text-sm">No image</span>
                                    </div>
                                `;
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                            <span className="text-muted-foreground text-sm">No image</span>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-4 flex-1 flex flex-col">
                <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">{recipe.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2 leading-relaxed">
                        {recipe.description}
                    </p>
                    <div className="text-sm text-muted-foreground mb-3">
                        {formatCategories(recipe.categories)}
                    </div>
                </div>

                {/* Public status toggle and tags */}
                <div className="mt-auto space-y-3">
                    {/* Public status toggle */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Public</span>
                        <Switch
                            checked={recipe.is_public}
                            onCheckedChange={(checked) => onTogglePublic(recipe.id, checked)}
                        />
                    </div>

                    {/* Tags */}
                    {recipe.tags && recipe.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {recipe.tags.map((tag) => (
                                <Badge
                                    key={tag.id}
                                    variant="secondary"
                                    className="text-xs"
                                >
                                    {tag.name}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}