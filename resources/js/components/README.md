# Navigation Components

## TopNavigation Component

The `TopNavigation` component provides a consistent header across all public pages in the MelonKitchen application.

### Usage

```tsx
import TopNavigation from '@/components/TopNavigation';

// In your page component
<TopNavigation categories={categories} />;
```

### Props

- `categories: Category[]` - Array of categories with children for the navigation menu

### Features

- Logo with link to home page
- Categories dropdown with subcategories
- Calendar link
- Search functionality
- Login button
- Responsive design

### Required Data in Controllers

All controllers that render public pages should include categories data:

```php
// Get all categories with their children for navigation
$categories = Category::with('children')
    ->whereNull('parent_id')
    ->orderBy('name')
    ->get();

return Inertia::render('PageName', [
    'categories' => $categories,
    // ... other props
]);
```

### Example Implementation

#### Page Component (e.g., Home.tsx)

```tsx
import { Head } from '@inertiajs/react';
import TopNavigation from '@/components/TopNavigation';
import { Category } from '@/types';

interface PageProps {
    categories: Category[];
    // ... other props
}

export default function Page({ categories }: PageProps) {
    return (
        <>
            <Head title="Page Title" />

            <div className="bg-background min-h-screen">
                {/* Top Navigation */}
                <TopNavigation categories={categories} />

                {/* Page Content */}
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">{/* Your page content here */}</div>
            </div>
        </>
    );
}
```

#### Controller (e.g., HomeController.php)

```php
<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function index(): Response
    {
        // Get all categories with their children for navigation
        $categories = Category::with('children')
            ->whereNull('parent_id')
            ->orderBy('name')
            ->get();

        return Inertia::render('Main/Page', [
            'categories' => $categories,
            // ... other data
        ]);
    }
}
```

### Current Implementation

The following pages currently use TopNavigation:

- Home page (`/`)
- Public recipe show page (`/recipes/{recipe}`)

### Styling Guidelines

- Use consistent padding: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Maintain proper spacing from navigation: `py-8` or `py-12`
- Keep navigation sticky: `sticky top-0 z-50`

### Adding New Public Pages

When creating new public pages:

1. Import TopNavigation component
2. Add categories prop to your page interface
3. Update your controller to fetch and pass categories
4. Place TopNavigation at the top of your page layout
5. Follow the styling guidelines for content spacing
