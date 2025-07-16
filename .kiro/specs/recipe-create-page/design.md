# Design Document

## Overview

The recipe creation feature implements a multi-step form interface that guides users through creating comprehensive recipes. The design follows a tabbed approach with four distinct steps: Information, Category/Tags/Ingredients, Instructions, and Nutrition. The interface maintains state across tabs, provides validation feedback, and supports both forward/backward navigation and direct tab jumping.

## Architecture

### Frontend Architecture

The recipe creation page follows the existing React/Inertia.js pattern used throughout the application:

- **Page Component**: `resources/js/pages/recipes/create.tsx` - Main container component
- **Step Components**: Individual components for each tab/step
- **Form State Management**: Inertia.js form helper for state management and validation
- **Navigation**: Tab-based navigation with progress indication
- **Validation**: Client-side validation with server-side validation feedback

### Backend Architecture

The backend extends the existing `RecipeController` with a `create` method and `store` method:

- **Route**: `GET /dashboard/recipes/create` and `POST /dashboard/recipes`
- **Controller**: Enhanced `RecipeController` with form data handling
- **Validation**: Laravel Form Request classes for each step's validation
- **File Upload**: Image handling for recipe and instruction images
- **Database**: Transaction-based creation of recipe with related models

## Components and Interfaces

### Main Create Page Component

```typescript
interface CreateRecipeProps {
    categories: Category[];
    tags: Tag[];
    ingredients: Ingredient[];
    units: Unit[];
}

interface RecipeFormData {
    // Step 1: Information
    title: string;
    description: string;
    servings: number;
    difficulty: 'beginner' | 'easy' | 'medium' | 'hard' | 'expert';
    prep_time_minutes: number;
    cook_time_minutes: number;
    image?: File;
    youtube_url?: string;

    // Step 2: Category/Tags/Ingredients
    category_id: string;
    tag_ids: string[];
    ingredients: RecipeIngredientInput[];

    // Step 3: Instructions
    instructions: InstructionInput[];

    // Step 4: Nutrition
    nutrition?: NutritionInput;
}

interface RecipeIngredientInput {
    ingredient_id: string;
    quantity: number;
    unit_id: string;
    notes?: string;
    is_optional: boolean;
}

interface InstructionInput {
    step_number: number;
    instruction: string;
    image?: File;
}

interface NutritionInput {
    calories?: number;
    protein_g?: number;
    carbs_g?: number;
    fat_g?: number;
    fiber_g?: number;
    sugar_g?: number;
    sodium_mg?: number;
}
```

### Step Components

#### Step 1: Information Component

- Form fields for basic recipe information
- Image upload with preview
- YouTube URL validation
- Required field validation

#### Step 2: Category/Tags/Ingredients Component

- Category selection using existing Combobox component
- Multi-select tags interface
- Dynamic ingredient list with add/remove functionality
- Ingredient search with quantity and unit selection

#### Step 3: Instructions Component

- Dynamic instruction list
- Drag-and-drop reordering using `@dnd-kit/sortable`
- Image upload per instruction step
- Auto-numbering of steps

#### Step 4: Nutrition Component

- Optional nutrition information form
- Numeric input validation
- Clear labeling of optional nature

### Navigation Component

```typescript
interface StepNavigationProps {
    currentStep: number;
    totalSteps: number;
    onStepChange: (step: number) => void;
    onNext: () => void;
    onPrevious: () => void;
    onSubmit: () => void;
    canProceed: boolean;
    isSubmitting: boolean;
}
```

## Data Models

### Enhanced Recipe Model

The existing Recipe model already supports the required fields. Additional considerations:

- Image storage using Laravel's file storage system
- YouTube URL validation
- Difficulty enum validation

### Related Models Integration

- **Categories**: Single selection from hierarchical categories
- **Tags**: Multiple selection with role-based filtering (public/private)
- **Ingredients**: Dynamic list with quantities and units
- **Instructions**: Ordered list with optional images
- **Nutrition**: Optional one-to-one relationship

## Error Handling

### Client-Side Validation

- Real-time validation for required fields
- Format validation for URLs and numeric inputs
- File type and size validation for images
- Cross-step validation (e.g., at least one ingredient required)

### Server-Side Validation

```php
// Form Request Classes
class StoreRecipeRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'servings' => 'required|integer|min:1',
            'difficulty' => 'required|in:beginner,easy,medium,hard,expert',
            'prep_time_minutes' => 'required|integer|min:0',
            'cook_time_minutes' => 'required|integer|min:0',
            'image' => 'nullable|image|max:2048',
            'youtube_url' => 'nullable|url',
            'category_id' => 'required|exists:categories,id',
            'tag_ids' => 'array',
            'tag_ids.*' => 'exists:tags,id',
            'ingredients' => 'required|array|min:1',
            'ingredients.*.ingredient_id' => 'required|exists:ingredients,id',
            'ingredients.*.quantity' => 'required|numeric|min:0',
            'ingredients.*.unit_id' => 'required|exists:units,id',
            'instructions' => 'required|array|min:1',
            'instructions.*.instruction' => 'required|string',
            'instructions.*.image' => 'nullable|image|max:2048',
        ];
    }
}
```

### Error Display Strategy

- Step-specific error highlighting in tab navigation
- Inline error messages within form fields
- Summary error display when attempting to submit
- Automatic navigation to first step with errors

## User Experience Considerations

### Progressive Enhancement

- Basic form functionality without JavaScript
- Enhanced experience with React components
- Graceful degradation for older browsers

### Accessibility

- Proper ARIA labels for form sections
- Keyboard navigation support
- Screen reader compatibility
- Focus management during step transitions

### Performance

- Lazy loading of step components
- Debounced search for ingredients/categories
- Optimized image uploads with progress indicators
- Form state optimization to prevent unnecessary re-renders

### Mobile Responsiveness

- Touch-friendly drag-and-drop for instructions
- Responsive tab navigation
- Mobile-optimized file upload interface
- Appropriate input types for mobile keyboards

## File Upload Strategy

### Image Storage

- Store recipe images in `storage/app/public/recipes/`
- Store instruction images in `storage/app/public/instructions/`
- Generate unique filenames to prevent conflicts
- Create thumbnails for performance optimization

### Upload Validation

- File type restrictions (JPEG, PNG, WebP)
- File size limits (2MB per image)
- Image dimension validation
- Virus scanning for uploaded files

## State Management

### Form State Structure

The form state is managed using Inertia.js form helper with the following structure:

```typescript
const { data, setData, post, processing, errors, reset } = useForm<RecipeFormData>({
    // Initial state with default values
    title: '',
    description: '',
    servings: 1,
    difficulty: 'easy',
    prep_time_minutes: 0,
    cook_time_minutes: 0,
    category_id: '',
    tag_ids: [],
    ingredients: [],
    instructions: [{ step_number: 1, instruction: '' }],
    nutrition: {},
});
```

### Step Validation

Each step maintains its own validation state while contributing to the overall form validation:

```typescript
interface StepValidation {
    isValid: boolean;
    errors: string[];
    canProceed: boolean;
}
```

## Integration Points

### Existing Components

- Reuse `Combobox` component for category selection
- Extend `Control` component pattern for search functionality
- Utilize existing UI components (Button, Input, Card, etc.)
- Follow established form validation patterns

### API Endpoints

- `GET /dashboard/recipes/create` - Render create form with required data
- `POST /dashboard/recipes` - Store new recipe
- `GET /api/ingredients/search` - Search ingredients (if needed)
- `GET /api/categories/search` - Search categories (if needed)

### Navigation Integration

- Update recipes index `handleAddRecipe` to navigate to create page
- Add breadcrumb navigation: Home > Recipes > Create Recipe
- Implement proper back navigation handling
