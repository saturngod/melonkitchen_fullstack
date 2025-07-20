import { Badge } from '@/components/ui/badge';
import { DetailedRecipe } from '@/types';

interface RecipeMetadataProps {
    recipe: DetailedRecipe;
}

export default function RecipeMetadata({ recipe }: RecipeMetadataProps) {
    return (
        <div className="space-y-6">
            {/* Categories Section */}
            <div>
                <h3 className="text-lg font-medium mb-3">Categories</h3>
                {recipe.categories && recipe.categories.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {recipe.categories.map((category) => (
                            <Badge key={category.id} variant="secondary" className="text-sm">
                                {category.parent ? `${category.parent.name} > ${category.name}` : category.name}
                            </Badge>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground">No categories assigned</p>
                )}
            </div>

            {/* Tags Section */}
            <div>
                <h3 className="text-lg font-medium mb-3">Tags</h3>
                {recipe.tags && recipe.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {recipe.tags.map((tag) => (
                            <Badge
                                key={tag.id}
                                variant={tag.is_public ? "default" : "outline"}
                                className="text-sm"
                            >
                                {tag.name}
                                {!tag.is_public && (
                                    <span className="ml-1 text-xs opacity-70">(Private)</span>
                                )}
                            </Badge>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground">No tags assigned</p>
                )}
            </div>

            {/* Recipe Timing Summary */}
            {(recipe.prep_time_minutes || recipe.cook_time_minutes || recipe.servings || recipe.difficulty) && (
                <div>
                    <h3 className="text-lg font-medium mb-3">Recipe Summary</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {recipe.prep_time_minutes && (
                            <div className="text-center p-3 bg-muted/30 rounded-lg">
                                <div className="text-2xl font-bold text-primary">
                                    {recipe.prep_time_minutes}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    min prep
                                </div>
                            </div>
                        )}
                        {recipe.cook_time_minutes && (
                            <div className="text-center p-3 bg-muted/30 rounded-lg">
                                <div className="text-2xl font-bold text-primary">
                                    {recipe.cook_time_minutes}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    min cook
                                </div>
                            </div>
                        )}
                        {recipe.servings && (
                            <div className="text-center p-3 bg-muted/30 rounded-lg">
                                <div className="text-2xl font-bold text-primary">
                                    {recipe.servings}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    servings
                                </div>
                            </div>
                        )}
                        {recipe.difficulty && (
                            <div className="text-center p-3 bg-muted/30 rounded-lg">
                                <div className="text-lg font-bold text-primary capitalize">
                                    {recipe.difficulty}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    difficulty
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Recipe Author */}
            <div>
                <h3 className="text-lg font-medium mb-3">Recipe by</h3>
                <div className="flex items-center gap-3">
                    {recipe.user.avatar ? (
                        <img
                            src={recipe.user.avatar}
                            alt={recipe.user.name}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary font-medium">
                                {recipe.user.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                    <div>
                        <p className="font-medium">{recipe.user.name}</p>
                        <p className="text-sm text-muted-foreground">
                            Created {new Date(recipe.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Recipe Visibility */}
            <div>
                <div className="flex items-center gap-2">
                    <Badge variant={recipe.is_public ? "default" : "secondary"}>
                        {recipe.is_public ? "Public Recipe" : "Private Recipe"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
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