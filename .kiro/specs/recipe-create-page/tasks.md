# Implementation Plan

- [ ]   1. Set up backend route and controller foundation

    - Add create route to web.php for GET /dashboard/recipes/create
    - Implement RecipeController@create method to render create page with required data
    - Add store route for POST /dashboard/recipes
    - Create basic RecipeController@store method structure
    - _Requirements: 1.1, 1.2_

- [ ]   2. Create form request validation classes

    - Create StoreRecipeRequest form request class with comprehensive validation rules
    - Implement validation for all four steps: information, categories/tags/ingredients, instructions, nutrition
    - Add custom validation messages for better user experience
    - Include file upload validation for images
    - _Requirements: 2.10, 5.2, 5.3, 6.1, 6.5_

- [ ]   3. Implement basic create page component structure

    - Create resources/js/pages/recipes/create.tsx as main page component
    - Set up Inertia form state management with RecipeFormData interface
    - Implement basic page layout with AppLayout and breadcrumbs
    - Create step navigation component with tab interface
    - _Requirements: 1.3, 1.4, 7.1_

- [ ]   4. Build Step 1: Information component

    - Create InformationStep component with all required form fields
    - Implement title, description, servings, difficulty, prep_time, cook_time fields
    - Add image upload functionality with preview
    - Implement YouTube URL field with basic validation
    - Add client-side validation for required fields
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10_

- [ ]   5. Build Step 2: Category/Tags/Ingredients component

    - Create CategoryTagsIngredientsStep component
    - Implement category selection using existing Combobox component
    - Build multi-select tags interface with role-based filtering
    - Create dynamic ingredients list with add/remove functionality
    - Implement ingredient search with quantity and unit selection
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [ ]   6. Build Step 3: Instructions component

    - Create InstructionsStep component with dynamic instruction list
    - Implement drag-and-drop reordering using @dnd-kit/sortable
    - Add functionality to add/remove instruction steps
    - Implement automatic step numbering and renumbering
    - Add image upload capability for individual instruction steps
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8_

- [ ]   7. Build Step 4: Nutrition component

    - Create NutritionStep component with optional nutrition fields
    - Implement numeric input fields for calories, protein, carbs, fat, fiber, sugar, sodium
    - Add proper validation for numeric values
    - Ensure all fields are clearly marked as optional
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ]   8. Implement step navigation and form state management

    - Create step navigation logic with next/previous/direct tab jumping
    - Implement form state persistence across all steps
    - Add validation state management for each step
    - Create step completion indicators and error highlighting
    - Handle unsaved changes warning when navigating away
    - _Requirements: 1.5, 1.6, 1.7, 7.1, 7.2, 7.3, 7.4_

- [ ]   9. Complete backend recipe creation logic

    - Implement complete RecipeController@store method with transaction handling
    - Add file upload processing for recipe and instruction images
    - Create related model records (instructions, nutrition, recipe_ingredients, etc.)
    - Implement proper error handling and rollback on failure
    - Add success response with redirect to recipe detail or index
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ]   10. Add form validation and error handling

    - Implement comprehensive client-side validation for all steps
    - Add server-side validation integration with error display
    - Create error highlighting in step navigation tabs
    - Implement automatic navigation to first step with validation errors
    - Add inline error messages for all form fields
    - _Requirements: 6.5, 7.4_

- [ ]   11. Integrate with existing recipes index page

    - Update recipes/index.tsx handleAddRecipe function to navigate to create page
    - Ensure proper routing integration with existing application structure
    - Add appropriate breadcrumb navigation
    - Test navigation flow from index to create and back
    - _Requirements: 1.1_

- [ ]   12. Add drag-and-drop dependencies and setup

    - Install @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities packages
    - Configure drag-and-drop context in instructions component
    - Implement touch-friendly drag handles for mobile devices
    - Add visual feedback during drag operations
    - _Requirements: 4.4, 4.5_

- [ ]   13. Implement file upload handling and validation

    - Create file upload utilities for image processing
    - Add image preview functionality for recipe and instruction images
    - Implement file size and type validation on client side
    - Create progress indicators for file uploads
    - Add error handling for failed uploads
    - _Requirements: 2.8, 4.6_

- [ ]   14. Create comprehensive form validation tests

    - Write unit tests for form validation logic
    - Create integration tests for step navigation
    - Add tests for drag-and-drop functionality
    - Implement tests for file upload handling
    - Test error handling scenarios across all steps
    - _Requirements: 2.10, 6.5_

- [ ]   15. Add responsive design and accessibility features
    - Ensure mobile-responsive design for all form steps
    - Implement proper ARIA labels and keyboard navigation
    - Add focus management during step transitions
    - Test screen reader compatibility
    - Optimize touch interactions for mobile devices
    - _Requirements: 1.4, 4.4_
