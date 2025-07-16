# Implementation Plan

- [x]   1. Set up RecipeController with resource routing

    - Create RecipeController with index method that handles search and pagination
    - Add resource route for recipes in web.php following existing pattern
    - Implement search scope in Recipe model for title filtering
    - Add proper relationship loading for categories and tags
    - _Requirements: 1.1, 2.1, 6.1, 7.1, 7.2, 7.3_

- [x]   2. Create Recipe page component structure

    - Create resources/js/pages/recipes/index.tsx following CategoryIndex pattern
    - Set up TypeScript interfaces for Recipe, Category, and Tag types
    - Implement basic page layout with AppLayout and Head components
    - Add breadcrumb navigation for recipes page
    - _Requirements: 1.1, 7.4_

- [x]   3. Implement search functionality with Control component

    - Integrate existing Control component for search and "Add New Recipe" button
    - Implement debounced search functionality using useEffect and setTimeout
    - Add search state management with useState hook
    - Handle search parameter persistence in URL using Inertia router
    - Add console.log for "Add New Recipe" button click as placeholder
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3_

- [x]   4. Create RecipeCard component for grid display

    - Create RecipeCard component with proper TypeScript interface
    - Implement card layout using Shadcn UI Card component
    - Add image display with fallback for missing images
    - Display title and description with 2-line truncation using CSS
    - Show category and subcategory information with proper formatting
    - _Requirements: 4.1, 4.4_

- [x]   5. Add public status toggle and tags display to RecipeCard

    - Implement is_public toggle using Shadcn UI Switch component
    - Add tags display using Shadcn UI Badge components
    - Handle toggle state changes with proper callback functions
    - Style badges and switch components consistently with design
    - _Requirements: 4.2, 4.3_

- [x]   6. Implement dropdown menu for recipe actions

    - Add three-dot menu using Shadcn UI DropdownMenu component
    - Position dropdown menu in top-right corner of recipe cards
    - Add Edit and Delete menu items with proper styling
    - Implement console.log placeholders for Edit and Delete actions
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x]   7. Create responsive grid layout for recipe cards

    - Implement CSS Grid layout for recipe cards with responsive breakpoints
    - Set up grid to show 1 column on mobile, 2 on tablet, 3-4 on desktop
    - Add proper spacing and gap between cards
    - Ensure cards maintain consistent height and alignment
    - _Requirements: 1.1, 1.2_

- [x]   8. Add pagination support

    - Integrate existing Pagination component from ui/pagination
    - Handle pagination state and navigation using Inertia router
    - Maintain search parameters across page navigation
    - Implement proper pagination controls with disabled states
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x]   9. Implement loading and empty states

    - Add loading indicators for initial page load and search operations
    - Create empty state message for when no recipes exist
    - Add "No recipes found" message for empty search results
    - Implement skeleton loading states for recipe cards during loading
    - _Requirements: 1.3, 1.4, 2.2_

- [x]   10. Add comprehensive error handling and validation

    - Implement client-side error handling for network failures
    - Add proper error boundaries for component failures
    - Handle image loading errors with fallback images
    - Add form validation for search input
    - _Requirements: 1.4, 2.4_

- [x]   11. Write unit tests for Recipe model and controller

    - Create unit tests for Recipe model search scope functionality
    - Write feature tests for RecipeController index method
    - Test search functionality with various input scenarios
    - Test pagination behavior and relationship loading
    - _Requirements: 2.1, 6.1, 7.1_

- [x]   12. Write component tests for React components
    - Create tests for RecipeCard component rendering and interactions
    - Write tests for recipe index page component functionality
    - Test search input behavior and debouncing
    - Test pagination component integration
    - _Requirements: 1.1, 2.1, 4.1, 6.1_
