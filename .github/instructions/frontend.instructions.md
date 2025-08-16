---
applyTo: '**/*.ts,**/*.tsx'
---

# Frontend Development Instructions

## Overview

This document outlines the development standards and best practices for our React frontend application using shadcn/ui and Tailwind CSS.

## Technology Stack

- **React** - UI Library
- **shadcn/ui** - Component Library
- **Tailwind CSS** - Utility-first CSS Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool

## Documentation References

- [React Documentation](https://react.dev/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## Project Structure

src/
├── components/
│ ├── ui/ # shadcn/ui components
│ ├── common/ # Reusable components
│ ├── forms/ # Form components
│ └── layout/ # Layout components
├── hooks/ # Custom hooks
├── lib/ # Utilities and configurations
├── pages/ # Page components
├── services/ # API services
├── stores/ # State management
├── types/ # TypeScript type definitions
└── utils/ # Helper functions

## Pages File name

Pages file name are snake case.

`public-recipe-show.tsx` is correct.

`PublicRecipeShow.tsx` is incorrect.

Folder names are snake case.

`main_recipe` is correct.

`MainRecipe` is incorrect.

## Component Development Guidelines

### 1. Component Architecture

- **Single Responsibility**: Each component should have one clear purpose
- **Composition over Inheritance**: Use component composition for flexibility
- **Props Interface**: Always define TypeScript interfaces for props
- **Default Props**: Use default parameters instead of defaultProps

Example component interface:

interface ButtonProps {
variant?: 'primary' | 'secondary' | 'outline';
size?: 'sm' | 'md' | 'lg';
disabled?: boolean;
loading?: boolean;
onClick?: () => void;
children: React.ReactNode;
}

### 2. File Naming Conventions

- **Components**: PascalCase (e.g., UserProfile.tsx)
- **Hooks**: camelCase with "use" prefix (e.g., useUserData.ts)
- **Utilities**: camelCase (e.g., formatDate.ts)
- **Types**: PascalCase (e.g., UserTypes.ts)

### 3. Component Structure Template

// Imports
import React from 'react';
import { cn } from '@/lib/utils';

// Types
interface ComponentProps {
// Props definition
}

// Component
const Component: React.FC<ComponentProps> = ({
// Props destructuring
}) => {
// Hooks
// State
// Effects
// Handlers
// Render helpers

     return (
       // JSX
     );

};

// Export
export default Component;

## shadcn/ui Integration

### 1. Installation and Setup

- Initialize shadcn/ui in your project
- Configure components.json for your project structure
- Install components as needed using the CLI

### 2. Component Usage

- Import shadcn/ui components from @/components/ui
- Customize using className prop with Tailwind classes
- Use the cn() utility for conditional classes

Example:

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const CustomButton = ({ variant, className, ...props }) => {
return (
<Button
className={cn(
'hover:scale-105 transition-transform',
className
)}
variant={variant}
{...props}
/>
);
};

### 3. Customization Guidelines

- Extend shadcn/ui components instead of modifying them directly
- Use Tailwind classes for styling modifications
- Create wrapper components for project-specific variations

## Tailwind CSS Best Practices

### 1. Utility-First Approach

- Use utility classes for styling
- Avoid custom CSS unless absolutely necessary
- Leverage Tailwind's responsive and state variants

### 2. Component Patterns

- Use @apply directive sparingly, prefer utilities
- Create reusable component classes in globals.css when needed
- Maintain consistent spacing and sizing scales

### 3. Responsive Design

- Mobile-first approach using responsive prefixes
- Use consistent breakpoints: sm, md, lg, xl, 2xl
- Test across different screen sizes

Example responsive classes:

   <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
     <p className="text-sm md:text-base lg:text-lg">
       Responsive text
     </p>
   </div>

## State Management

### 1. Local State

- Use useState for component-level state
- Use useReducer for complex state logic
- Keep state as close to where it's used as possible

### 2. Global State

- Use Context API for theme, auth, and global UI state
- Consider Zustand or Redux Toolkit for complex application state
- Avoid prop drilling by using appropriate state management

### 3. Server State

- Use React Query or SWR for API data management
- Implement proper loading and error states
- Cache API responses appropriately

## Custom Hooks

### 1. Hook Guidelines

- Extract reusable logic into custom hooks
- Follow the "use" naming convention
- Return objects for multiple values, arrays for ordered pairs

### 2. Common Hook Patterns

- useLocalStorage - for persistent local state
- useDebounce - for debounced values
- useApi - for API calls with loading states
- useForm - for form state management

Example custom hook:

const useLocalStorage = (key: string, initialValue: any) => {
const [storedValue, setStoredValue] = useState(() => {
try {
const item = window.localStorage.getItem(key);
return item ? JSON.parse(item) : initialValue;
} catch (error) {
return initialValue;
}
});

     const setValue = (value: any) => {
       try {
         setStoredValue(value);
         window.localStorage.setItem(key, JSON.stringify(value));
       } catch (error) {
         console.error('Error saving to localStorage:', error);
       }
     };

     return [storedValue, setValue];

};

## Form Handling

### 1. Form Libraries

- Use React Hook Form for complex forms
- Integrate with Zod for validation
- Leverage shadcn/ui form components

### 2. Form Structure

- Create reusable form field components
- Implement proper validation and error handling
- Use controlled components for form inputs

### 3. Form Best Practices

- Validate on blur and submit
- Provide clear error messages
- Show loading states during submission
- Handle form accessibility properly

## Performance Optimization

### 1. Component Optimization

- Use React.memo for expensive components
- Implement useMemo and useCallback judiciously
- Avoid unnecessary re-renders

### 2. Bundle Optimization

- Use dynamic imports for code splitting
- Lazy load components and routes
- Optimize images and assets

### 3. Rendering Performance

- Virtualize long lists
- Debounce expensive operations
- Use appropriate keys for list items

## Error Handling

### 1. Error Boundaries

- Implement error boundaries for component trees
- Provide fallback UI for errors
- Log errors appropriately

### 2. API Error Handling

- Create consistent error handling patterns
- Show user-friendly error messages
- Implement retry mechanisms where appropriate

### 3. Form Validation

- Use client-side validation for UX
- Always validate on the server
- Provide clear field-level errors

## Testing Guidelines

### 1. Testing Structure

- Use React Testing Library for component tests
- Write tests for user interactions
- Test accessibility features

### 2. Testing Patterns

- Test behavior, not implementation
- Use data-testid for reliable element selection
- Mock external dependencies

### 3. Coverage Goals

- Aim for high test coverage on critical paths
- Test error scenarios and edge cases
- Include integration tests for key workflows

## Accessibility (a11y)

### 1. Semantic HTML

- Use proper HTML elements
- Implement ARIA attributes correctly
- Ensure keyboard navigation works

### 2. Design Considerations

- Maintain sufficient color contrast
- Provide alternative text for images
- Use focus indicators

### 3. Testing

- Use accessibility testing tools
- Test with screen readers
- Validate with keyboard-only navigation

## Code Quality

### 1. Linting and Formatting

- Use ESLint with React and TypeScript rules
- Configure Prettier for consistent formatting
- Set up pre-commit hooks

### 2. Code Review

- Review for component design and reusability
- Check for performance implications
- Ensure accessibility standards are met

### 3. Documentation

- Document complex components and hooks
- Write clear README files
- Maintain up-to-date type definitions

## Deployment and Build

### 1. Build Optimization

- Configure Vite for production builds
- Optimize assets and bundle size
- Use environment variables properly

### 2. Performance Monitoring

- Implement error tracking
- Monitor bundle size and performance
- Set up continuous deployment

## Security Considerations

### 1. Input Validation

- Sanitize user inputs
- Validate data on both client and server
- Use proper authentication patterns

### 2. Dependencies

- Keep dependencies updated
- Audit packages for vulnerabilities
- Use only trusted packages

## Best Practices Summary

1. **Component Design**: Keep components small, focused, and reusable
2. **Type Safety**: Use TypeScript interfaces and proper typing
3. **Performance**: Optimize rendering and bundle size
4. **Accessibility**: Ensure all users can use your application
5. **Testing**: Write comprehensive tests for critical functionality
6. **Documentation**: Maintain clear and up-to-date documentation
7. **Code Quality**: Follow consistent patterns and standards
8. **Security**: Implement proper security measures

## Resources and Tools

- **VS Code Extensions**: ES7+ React/Redux/React-Native snippets, Tailwind CSS IntelliSense
- **Development Tools**: React Developer Tools, Tailwind CSS debugging
- **Testing**: Jest, React Testing Library, Cypress
- **Build Tools**: Vite, PostCSS, Autoprefixer
- **Code Quality**: ESLint, Prettier, Husky
