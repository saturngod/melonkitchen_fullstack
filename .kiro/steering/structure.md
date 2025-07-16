# Project Structure

## Laravel Backend Structure

### Core Application (`app/`)

- `Models/` - Eloquent models with relationships and business logic
- `Http/Controllers/` - Request handling and business logic coordination
    - `Auth/` - Authentication controllers (Laravel Breeze)
    - `Settings/` - User settings management
- `Http/Requests/` - Form request validation classes
- `Http/Middleware/` - Custom middleware (appearance, Inertia handling)
- `Enums/` - Application enums (UserRole, etc.)
- `Providers/` - Service providers

### Database (`database/`)

- `migrations/` - Database schema definitions
- `seeders/` - Database seeding classes
- `factories/` - Model factories for testing

### Configuration (`config/`)

- Standard Laravel configuration files
- `inertia.php` - Inertia.js configuration

## Frontend Structure (`resources/js/`)

### Pages (`pages/`)

- `auth/` - Authentication pages
- `settings/` - User settings pages
- `categories/` - Category management
- `ingredient/` - Ingredient management
- `tag/` - Tag management
- `dashboard.tsx` - Main dashboard
- `welcome.tsx` - Landing page

### Components (`components/`)

- `ui/` - Reusable UI components (Shadcn/ui based)
- `shared/` - Application-specific shared components
    - `Control.tsx` - Search and action controls
    - `ConfirmDialog.tsx` - Confirmation dialogs
- Individual components for layout and functionality

### Supporting Files

- `hooks/` - Custom React hooks
- `lib/` - Utility functions and configurations
- `types/` - TypeScript type definitions
- `layouts/` - Page layout components

## Key Conventions

### Models

- Use UUIDs as primary keys (`HasUuids` trait)
- Include `HasFactory` trait for testing
- Define relationships clearly with proper return types
- Use `$fillable` for mass assignment protection

### Controllers

- Constructor injection for dependencies
- Resource controllers for CRUD operations
- Proper validation with custom messages
- Return Inertia responses for pages
- Handle business logic validation (circular references, etc.)

### Frontend Components

- TypeScript interfaces for all props
- Consistent naming: PascalCase for components
- Use Inertia forms for state management
- Implement debounced search functionality
- Follow Shadcn/ui component patterns

### Routes

- Group authenticated routes under middleware
- Use resource routes for CRUD operations
- Prefix dashboard routes with `/dashboard`
- Consistent naming conventions

### File Organization

- One component per file
- Co-locate related functionality
- Use index files for clean imports
- Separate concerns (UI, business logic, types)
