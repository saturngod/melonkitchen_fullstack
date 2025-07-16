# Design Document

## Overview

The recipe page feature implements a comprehensive recipe management interface at `/dashboard/recipes` using a grid-based layout. The design follows established patterns in the application, utilizing Laravel's Inertia.js integration with React components, and leverages existing UI components from Shadcn UI library.

The page will display recipes as visually appealing cards in a responsive grid, with integrated search functionality, pagination, and administrative controls. The design emphasizes user experience through intuitive navigation, consistent styling, and efficient data loading patterns.

## Architecture

### Backend Architecture

**Controller Layer:**

- `RecipeController` will handle all recipe-related HTTP requests
- Follows the existing pattern established by `CategoryController` and `IngredientController`
- Implements resource controller methods with focus on `index` method for listing recipes
- Utilizes Eloquent relationships for efficient data loading
- Implements search functionality with query scoping
- Handles pagination using Laravel's built-in pagination

**Model Layer:**

- Leverages existing `Recipe` model with established relationships
- Utilizes relationships: `categories()`, `tags()`, `user()`
- Implements search scopes for title-based filtering
- Maintains existing UUID primary key structure

**Route Layer:**

- Follows RESTful resource routing pattern using Laravel resource controller
- Route definition: `Route::resource('recipes', RecipeController::class)->only(['index', 'store', 'update', 'destroy']);`
- Integrates with existing authenticated route group in `/dashboard` prefix
- Maintains consistency with other dashboard routes (categories, ingredients, tags)

### Frontend Architecture

**Page Component:**

- `resources/js/pages/recipes/index.tsx` - Main recipe listing page
- Follows established patterns from `categories/index.tsx`
- Implements React hooks for state management
- Utilizes Inertia.js for server-state synchronization

**Component Structure:**

- Reuses existing `Control` component for search and actions
- Implements custom `RecipeCard` component for grid display
- Leverages Shadcn UI components for consistent styling
- Integrates with existing layout system (`AppLayout`)

## Components and Interfaces

### Backend Components

#### RecipeController

```php
class RecipeController extends Controller
{
    public function index(Request $request): Response
    {
        // Search and pagination logic
        // Load recipes with relationships
        // Return Inertia response
    }
}
```

**Key Methods:**

- `index()`: Lists recipes with search, pagination, and relationship loading
- Implements debounced search functionality
- Loads categories, tags relationships efficiently
- Handles empty states and error conditions

#### Recipe Model Enhancements

**Search Scope:**

```php
public function scopeSearch($query, $search)
{
    return $query->where('title', 'like', "%{$search}%");
}
```

### Frontend Components

#### RecipeIndex Page Component

**Props Interface:**

```typescript
interface RecipeIndexProps {
    recipes: {
        data: Recipe[];
    } & PaginationMeta;
    filters: {
        search: string;
    };
}

interface Recipe {
    id: string;
    title: string;
    description: string;
    image_url?: string;
    is_public: boolean;
    categories: Category[];
    tags: Tag[];
    created_at: string;
    updated_at: string;
}
```

#### RecipeCard Component

**Design Specifications:**

- Card-based layout using Shadcn UI Card component
- Image display with fallback for missing images
- Title and description with text truncation
- Category/subcategory display with hierarchical formatting
- Public status toggle using Shadcn UI Switch component
- Tag display using Shadcn UI Badge components
- Three-dot dropdown menu for actions (Edit/Delete)

**Component Structure:**

```typescript
interface RecipeCardProps {
    recipe: Recipe;
    onTogglePublic: (id: string, isPublic: boolean) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}
```

#### Grid Layout System

**Responsive Design:**

- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3-4 columns
- Large screens: 4-5 columns

**CSS Grid Implementation:**

```css
.recipe-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
}
```

## Data Models

### Recipe Data Structure

The recipe data structure leverages existing model relationships:

```typescript
interface Recipe {
    id: string;
    title: string;
    description: string;
    image_url?: string;
    is_public: boolean;
    prep_time_minutes?: number;
    cook_time_minutes?: number;
    servings?: number;
    difficulty?: string;
    categories: Category[];
    tags: Tag[];
    user: User;
    created_at: string;
    updated_at: string;
}

interface Category {
    id: string;
    name: string;
    parent_id?: string;
    parent?: Category;
}

interface Tag {
    id: string;
    name: string;
    is_public: boolean;
}
```

### API Response Structure

**Recipe Index Response:**

```json
{
    "recipes": {
        "data": [Recipe[]],
        "current_page": number,
        "last_page": number,
        "per_page": number,
        "total": number,
        "from": number,
        "to": number
    },
    "filters": {
        "search": string
    }
}
```

## Error Handling

### Backend Error Handling

**Search Errors:**

- Handle empty search results gracefully
- Validate search input length and characters
- Implement query timeout protection

**Database Errors:**

- Handle relationship loading failures
- Implement fallback for missing image URLs
- Graceful degradation for missing category/tag data

**Pagination Errors:**

- Validate page parameters
- Handle out-of-range page requests
- Maintain search state across pagination

### Frontend Error Handling

**Loading States:**

- Skeleton loading for recipe cards
- Search loading indicators
- Pagination loading states

**Error States:**

- Empty search results messaging
- Network error handling
- Image loading fallbacks

**User Feedback:**

- Toast notifications for actions
- Loading spinners for async operations
- Clear error messages for failed operations

## Testing Strategy

### Backend Testing

**Unit Tests:**

- Recipe model relationship tests
- Search scope functionality
- Controller method validation

**Feature Tests:**

- Recipe index endpoint testing
- Search functionality integration
- Pagination behavior validation
- Authentication and authorization

**Test Cases:**

```php
// Test search functionality
test('can search recipes by title')
test('returns empty results for non-matching search')
test('maintains pagination with search')

// Test recipe loading
test('loads recipes with relationships')
test('handles missing image URLs')
test('respects user permissions')
```

### Frontend Testing

**Component Tests:**

- RecipeCard component rendering
- Search input functionality
- Pagination component behavior
- Grid layout responsiveness

**Integration Tests:**

- Search and pagination interaction
- Recipe card action handling
- Loading state management

**Test Cases:**

```typescript
// Component tests
test('renders recipe card with all data');
test('handles missing image gracefully');
test('displays tags and categories correctly');

// Integration tests
test('search filters recipes correctly');
test('pagination maintains search state');
test('actions trigger correct callbacks');
```

### Performance Testing

**Load Testing:**

- Large recipe dataset handling
- Search performance with many results
- Image loading optimization

**Optimization Strategies:**

- Lazy loading for images
- Debounced search implementation
- Efficient database queries with proper indexing
- Pagination to limit data transfer

## Security Considerations

**Authentication:**

- All routes protected by authentication middleware
- User-specific recipe visibility rules

**Authorization:**

- Public/private recipe access control
- User role-based permissions for actions

**Data Validation:**

- Search input sanitization
- XSS protection for recipe content
- CSRF protection for form submissions

**Image Security:**

- Validate image URLs
- Implement content security policy
- Handle external image loading safely
