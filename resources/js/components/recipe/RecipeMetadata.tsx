import { Badge } from '@/components/ui/badge';
import { DetailedRecipe } from '@/types';

interface RecipeMetadataProps {
    recipe: DetailedRecipe;
}

export default function RecipeMetadata({ recipe }: RecipeMetadataProps) {
    return (
        <div className="space-y-6">
            {/* Recipe Timing Summary - Grid format */}
            {(recipe.prep_time_minutes || recipe.cook_time_minutes || recipe.servings || recipe.difficulty) && (
                <div className="grid grid-cols-2 gap-3">
                    {recipe.prep_time_minutes && (
                        <div className="text-center p-3 bg-muted rounded-lg border">
                            <div className="text-lg font-bold">
                                {recipe.prep_time_minutes}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                min prep
                            </div>
                        </div>
                    )}
                    {recipe.cook_time_minutes && (
                        <div className="text-center p-3 bg-muted rounded-lg border">
                            <div className="text-lg font-bold">
                                {recipe.cook_time_minutes}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                min cook
                            </div>
                        </div>
                    )}
                    {recipe.servings && (
                        <div className="text-center p-3 bg-muted rounded-lg border">
                            <div className="text-lg font-bold">
                                {recipe.servings}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                servings
                            </div>
                        </div>
                    )}
                    {recipe.difficulty && (
                        <div className="text-center p-3 bg-muted rounded-lg border">
                            <div className="text-sm font-bold capitalize">
                                {recipe.difficulty}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                difficulty
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Categories Section */}
            <div className="border-t pt-4">
                <h4 className="text-sm font-semibold mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Categories
                </h4>
                {recipe.categories && recipe.categories.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {recipe.categories.map((category) => (
                            <Badge
                                key={category.id}
                                variant="secondary"
                                className="text-xs"
                            >
                                {category.parent ? `${category.parent.name} > ${category.name}` : category.name}
                            </Badge>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">No categories assigned</p>
                )}
            </div>

            {/* Tags Section */}
            <div className="border-t pt-4">
                <h4 className="text-sm font-semibold mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Tags
                </h4>
                {recipe.tags && recipe.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {recipe.tags.map((tag) => (
                            <Badge
                                key={tag.id}
                                variant={tag.is_public ? "default" : "outline"}
                                className="text-xs"
                            >
                                {tag.name}
                                {!tag.is_public && (
                                    <span className="ml-1 text-xs opacity-70">(Private)</span>
                                )}
                            </Badge>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">No tags assigned</p>
                )}
            </div>

            {/* Recipe Author */}
            <div className="border-t pt-4">
                <h4 className="text-sm font-semibold mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Created by
                </h4>
                <div className="flex items-center space-x-3">
                    {recipe.user.avatar ? (
                        <img
                            src={recipe.user.avatar}
                            alt={recipe.user.name}
                            className="w-10 h-10 rounded-full object-cover border-2"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-muted border-2 flex items-center justify-center">
                            <span className="font-medium text-sm">
                                {recipe.user.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                    <div>
                        <p className="font-medium text-sm">{recipe.user.name}</p>
                        <p className="text-xs text-muted-foreground">
                            {new Date(recipe.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Recipe Visibility */}
            <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                    <Badge
                        variant={recipe.is_public ? "default" : "secondary"}
                    >
                        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {recipe.is_public ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            )}
                        </svg>
                        {recipe.is_public ? "Public Recipe" : "Private Recipe"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                        {recipe.is_public
                            ? "Visible to all users"
                            : "Only visible to you"
                        }
                    </span>
                </div>
            </div>
        </div>
    );
}