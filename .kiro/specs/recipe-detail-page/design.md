# Design Document

## Overview

The recipe detail page feature implements a comprehensive read-only view of recipe information at `/dashboard/recipes/{id}`. The design leverages the existing Laravel-Inertia.js-React architecture and follows established patterns from the recipe creation form, but optimized for viewing rather than editing. The page will display all recipe data in an organized, scannable format that allows users to quickly understand and follow recipes.

The design emphasizes visual hierarchy, clear information organization, and responsive layout to ensure optimal user experience across all devices. The page will integrate seamlessly with existing navigation patterns and provide action buttons for recipe management.

## Architecture

### Backend Architecture

**Controller Enhancement:**

The existing `RecipeController` will be enhanced with a `show` method to handle individual recipe display:

```php
public function show(string $id): Response
{
    $recipe = Recipe::with([
        'categories.parent',
        'tags',
        'user',
        'instructions',
        'nutritionInfo',
        'recipeIngredients.ingredient',
        'recipeIngredients.unit'
    ])->findOrFail($id);

    return Inertia::render('recipes/show', [
        'recipe' => $recipe
    ]);
}
```

**Route Addition:**

The existing resource route will be extended to include the `show` method:

```php
Route::resource('recipes', RecipeController::class)
    ->only(['index', 'create', 'store', 'show', 'update', 'destroy']);
```

**Data Loading Strategy:**

- Eager load all relationships in a single query to minimize database calls
- Load recipe instructions ordered by step_number
- Load recipe ingredients with their associated ingredient and unit data
- Load categories with parent relationships for hierarchical display
- Load nutrition information if available

### Frontend Architecture

**Page Component Structure:**

- `resources/js/pages/recipes/show.tsx` - Main recipe detail page
- Follows established patterns from other detail pages in the application
- Utilizes existing UI components for consistency
- Implements responsive design with mobile-first approach

**Component Hierarchy:**

```
RecipeShow
├── AppLayout (with breadcrumbs)
├── RecipeHeader (title, image, basic info)
├── RecipeMetadata (categories, tags, times, servings)
├── RecipeIngredients (ingredients list)
├── RecipeInstructions (step-by-step instructions)
├── RecipeNutrition (nutritional information)
└── RecipeActions (edit, delete buttons)
```

## Components and Interfaces

### Backend Components

#### Enhanced RecipeController

**New Method:**

```php
public function show(string $id): Response
{
    // Load recipe with all relationships
    $recipe = Recipe::with([
        'categories.parent',
        'tags',
        'user',
        'instructions',
        'nutritionInfo',
        'recipeIngredients.ingredient',
        'recipeIngredients.unit'
    ])->findOrFail($id);

    // Check if user can view this recipe
    if (!$recipe->is_public && $recipe->user_id !== auth()->id()) {
        abort(403, 'Unauthorized to view this recipe');
    }

    return Inertia::render('recipes/show', [
        'recipe' => $recipe
    ]);
}
```

### Frontend Components

#### RecipeShow Page Component

**Props Interface:**

```typescript
interface RecipeShowProps {
    recipe: DetailedRecipe;
}

interface DetailedRecipe extends Recipe {
    instructions: RecipeInstruction[];
    nutritionInfo?: NutritionInfo;
    recipeIngredients: RecipeIngredient[];
}

interface RecipeInstruction {
    id: string;
    step_number: number;
    instruction: string;
    image_url?: string;
}

interface NutritionInfo {
    id: string;
    calories_per_serving?: number;
    protein_grams?: number;
    carbs_grams?: number;
    fat_grams?: number;
    fiber_grams?: number;
    sugar_grams?: number;
    sodium_mg?: number;
}

interface RecipeIngredient {
    id: string;
    quantity?: string;
    notes?: string;
    is_optional: boolean;
    ingredient: {
        id: string;
        name: string;
    };
    unit?: {
        id: string;
        name: string;
        abbreviation: string;
    };
}
```

#### Component Sections

**RecipeHeader Component:**

```typescript
interface RecipeHeaderProps {
    recipe: DetailedRecipe;
}
```

- Displays recipe title as main heading (h1)
- Shows recipe image with fallback for missing images
- Displays recipe description
- Responsive layout: stacked on mobile, side-by-side on desktop

**RecipeMetadata Component:**

```typescript
interface RecipeMetadataProps {
    recipe: DetailedRecipe;
}
```

- Shows prep time, cook time, servings, difficulty
- Displays categories with parent-child relationships
- Shows tags using Badge components
- Grid layout for organized information display

**RecipeIngredients Component:**

```typescript
interface RecipeIngredientsProps {
    ingredients: RecipeIngredient[];
}
```

- Lists all ingredients with quantities and units
- Handles optional ingredients with visual distinction
- Shows ingredient notes when available
- Organized in a clean, scannable list format

**RecipeInstructions Component:**

```typescript
interface RecipeInstructionsProps {
    instructions: RecipeInstruction[];
}
```

- Displays numbered steps in sequential order
- Shows step images when available
- Clear separation between steps
- Responsive layout for step content

**RecipeNutrition Component:**

```typescript
interface RecipeNutritionProps {
    nutrition?: NutritionInfo;
}
```

- Displays nutritional information in organized grid
- Shows appropriate units for each value
- Handles missing nutrition data gracefully
- Uses consistent formatting for numeric values

**RecipeActions Component:**

```typescript
interface RecipeActionsProps {
    recipe: DetailedRecipe;
    canEdit: boolean;
    onEdit: () => void;
    onDelete: () => void;
}
```

- Shows Edit and Delete buttons for authorized users
- Implements proper permission checking
- Consistent styling with other action components

## Data Models

### Enhanced Recipe Data Structure

The recipe detail page will work with an extended recipe data structure that includes all related information:

```typescript
interface DetailedRecipe {
    // Basic recipe information
    id: string;
    title: string;
    description: string;
    image_url?: string;
    is_public: boolean;
    prep_time_minutes?: number;
    cook_time_minutes?: number;
    servings?: number;
    difficulty?: string;
    youtube_url?: string;

    // Relationships
    categories: Category[];
    tags: Tag[];
    user: User;
    instructions: RecipeInstruction[];
    nutritionInfo?: NutritionInfo;
    recipeIngredients: RecipeIngredient[];

    // Timestamps
    created_at: string;
    updated_at: string;
}
```

### API Response Structure

**Recipe Show Response:**

```json
{
    "recipe": {
        "id": "uuid",
        "title": "Recipe Title",
        "description": "Recipe description",
        "image_url": "url_or_null",
        "is_public": boolean,
        "prep_time_minutes": number_or_null,
        "cook_time_minutes": number_or_null,
        "servings": number_or_null,
        "difficulty": "string_or_null",
        "youtube_url": "url_or_null",
        "categories": [Category[]],
        "tags": [Tag[]],
        "user": User,
        "instructions": [RecipeInstruction[]],
        "nutritionInfo": NutritionInfo_or_null,
        "recipeIngredients": [RecipeIngredient[]],
        "created_at": "timestamp",
        "updated_at": "timestamp"
    }
}
```

## Layout and Visual Design

### Responsive Layout Strategy

**Mobile Layout (< 768px):**

- Single column layout
- Stacked sections in logical order
- Full-width components
- Compact spacing for mobile optimization

**Tablet Layout (768px - 1024px):**

- Two-column layout for header section
- Single column for detailed sections
- Optimized spacing and typography

**Desktop Layout (> 1024px):**

- Two-column layout with image/basic info on left
- Detailed information on right
- Sidebar-style layout for better content organization
- Generous spacing for comfortable reading

### Visual Hierarchy

**Typography Scale:**

- H1: Recipe title (text-3xl font-bold)
- H2: Section headings (text-xl font-semibold)
- H3: Subsection headings (text-lg font-medium)
- Body: Regular content (text-base)
- Small: Metadata and labels (text-sm)

**Color Scheme:**

- Follows existing application color palette
- Uses muted colors for secondary information
- Maintains proper contrast ratios for accessibility

**Spacing System:**

- Consistent spacing using Tailwind's spacing scale
- Generous whitespace between sections
- Compact spacing within related elements

### Component Styling

**Cards and Containers:**

- Uses Shadcn UI Card components for section organization
- Consistent padding and border radius
- Subtle shadows for depth

**Lists and Data Display:**

- Clean, scannable list layouts
- Proper alignment and spacing
- Visual separators between items

**Images:**

- Responsive image sizing
- Proper aspect ratios
- Fallback states for missing images

## Error Handling

### Backend Error Handling

**Recipe Not Found:**

- Return 404 error for non-existent recipes
- Proper error page rendering through Inertia

**Authorization Errors:**

- Check recipe visibility (public vs private)
- Verify user permissions for private recipes
- Return 403 error for unauthorized access

**Database Errors:**

- Handle relationship loading failures gracefully
- Provide fallback data for missing relationships
- Log errors for debugging purposes

### Frontend Error Handling

**Loading States:**

- Skeleton loading for recipe content
- Progressive loading of different sections
- Loading indicators for images

**Error States:**

- 404 page for missing recipes
- 403 page for unauthorized access
- Network error handling with retry options

**Missing Data Handling:**

- Graceful handling of missing images
- Default messages for empty sections
- Fallback content for missing relationships

## Navigation and User Experience

### Navigation Integration

**Breadcrumb Navigation:**

```typescript
const breadcrumbs = [
    { title: 'Recipes', href: '/dashboard/recipes' },
    { title: recipe.title, href: `/dashboard/recipes/${recipe.id}` },
];
```

**Back Navigation:**

- Clear path back to recipe listing
- Maintains search state when returning from detail view

### Action Integration

**Recipe Card Navigation:**

- Update RecipeCard component to navigate to detail page on click
- Maintain existing dropdown menu functionality
- Smooth transition between list and detail views

**Edit/Delete Actions:**

- Integrate with existing edit/delete functionality
- Consistent confirmation dialogs
- Proper success/error messaging

### Performance Considerations

**Data Loading:**

- Single query with eager loading for optimal performance
- Minimize database calls through efficient relationship loading
- Proper indexing on recipe ID for fast lookups

**Image Optimization:**

- Lazy loading for recipe and instruction images
- Proper image sizing and compression
- Fallback handling for failed image loads

**Caching Strategy:**

- Leverage browser caching for static assets
- Consider server-side caching for frequently accessed recipes

## Testing Strategy

### Backend Testing

**Unit Tests:**

- Recipe model relationship tests
- Controller show method functionality
- Authorization logic validation

**Feature Tests:**

- Recipe detail page rendering
- Permission checking for private recipes
- 404 handling for non-existent recipes

**Test Cases:**

```php
test('can view public recipe details')
test('can view own private recipe details')
test('cannot view other users private recipes')
test('returns 404 for non-existent recipe')
test('loads all recipe relationships correctly')
```

### Frontend Testing

**Component Tests:**

- Recipe detail page rendering
- Individual section component functionality
- Responsive layout behavior
- Action button functionality

**Integration Tests:**

- Navigation from recipe list to detail
- Edit/delete action integration
- Error state handling

**Test Cases:**

```typescript
test('renders recipe detail page with all sections');
test('displays recipe information correctly');
test('handles missing data gracefully');
test('shows appropriate actions for recipe owner');
test('navigates back to recipe list correctly');
```

### Accessibility Testing

**ARIA Labels:**

- Proper semantic markup for all content
- Screen reader friendly navigation
- Keyboard accessibility for all interactive elements

**Color Contrast:**

- Ensure proper contrast ratios for all text
- Test with color blindness simulators
- Maintain readability in high contrast mode

## Security Considerations

**Authorization:**

- Verify user permissions for private recipes
- Implement proper access control checks
- Prevent unauthorized recipe access

**Data Sanitization:**

- Sanitize recipe content for XSS prevention
- Validate image URLs for security
- Implement proper CSRF protection

**Privacy:**

- Respect recipe privacy settings
- Ensure private recipes are not accessible to unauthorized users
- Implement proper user session validation
