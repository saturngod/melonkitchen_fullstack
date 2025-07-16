# Technology Stack

## Backend

- **Framework**: Laravel 12 (PHP 8.2+)
- **Database**: SQLite (development), supports MySQL/PostgreSQL
- **Authentication**: Laravel Breeze with Inertia.js
- **API**: Inertia.js for SPA-like experience
- **Testing**: Pest PHP for feature and unit tests
- **Code Quality**: Laravel Pint for code formatting

## Frontend

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6 with Laravel Vite Plugin
- **UI Library**: Radix UI components with Tailwind CSS 4
- **Icons**: Lucide React
- **State Management**: Inertia.js forms and page props
- **Styling**: Tailwind CSS with custom component system

## Development Tools

- **Package Manager**: Composer (PHP), npm (Node.js)
- **Code Formatting**: Prettier with Tailwind plugin
- **Linting**: ESLint with React and TypeScript rules
- **Type Checking**: TypeScript strict mode

## Common Commands

### Development

```bash
# Start development server (all services)
composer dev

# Start with SSR support
composer dev:ssr

# Frontend only
npm run dev

# Build for production
npm run build
npm run build:ssr
```

### Testing

```bash
# Run all tests
composer test
# or
php artisan test

# Run specific test
php artisan test --filter=TestName
```

### Code Quality

```bash
# Format PHP code
./vendor/bin/pint

# Format frontend code
npm run format

# Lint frontend code
npm run lint

# Type check
npm run types
```

### Database

```bash
# Run migrations
php artisan migrate

# Seed database
php artisan db:seed

# Fresh migration with seeding
php artisan migrate:fresh --seed
```

## Key Dependencies

- **inertiajs/inertia-laravel**: SPA-like experience
- **tightenco/ziggy**: Laravel routes in JavaScript
- **@headlessui/react**: Accessible UI components
- **class-variance-authority**: Component variant management
- **tailwind-merge**: Tailwind class merging utility
