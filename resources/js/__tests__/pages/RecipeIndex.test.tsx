import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { router } from '@inertiajs/react';
import RecipeIndex from '@/pages/recipes/index';
import { Recipe } from '@/types';

// Mock Inertia router
jest.mock('@inertiajs/react', () => ({
    ...jest.requireActual('@inertiajs/react'),
    router: {
        get: jest.fn(),
    },
    Head: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock components
jest.mock('@/layouts/app-layout', () => {
    return function AppLayout({ children }: { children: React.ReactNode }) {
        return <div data-testid="app-layout">{children}</div>;
    };
});

jest.mock('@/components/shared/Control', () => {
    return function Control({ searchValue, onSearchChange, actionText, actionEvent }: any) {
        return (
            <div data-testid="control">
                <input
                    data-testid="search-input"
                    value={searchValue}
                    onChange={onSearchChange}
                    placeholder="Search"
                />
                <button onClick={actionEvent}>{actionText}</button>
            </div>
        );
    };
});

jest.mock('@/components/RecipeCard', () => {
    return function RecipeCard({ recipe }: { recipe: Recipe }) {
        return <div data-testid={`recipe-card-${recipe.id}`}>{recipe.title}</div>;
    };
});

const mockRecipes = [
    {
        id: '1',
        title: 'Chocolate Cake',
        description: 'Delicious chocolate cake',
        is_public: true,
        categories: [],
        tags: [],
        user: { id: 1, name: 'User', email: 'user@example.com' },
        created_at: '2023-01-01',
        updated_at: '2023-01-01',
    },
    {
        id: '2',
        title: 'Vanilla Ice Cream',
        description: 'Creamy vanilla ice cream',
        is_public: false,
        categories: [],
        tags: [],
        user: { id: 1, name: 'User', email: 'user@example.com' },
        created_at: '2023-01-01',
        updated_at: '2023-01-01',
    },
] as Recipe[];

const mockProps = {
    recipes: {
        data: mockRecipes,
        current_page: 1,
        last_page: 1,
        per_page: 12,
        total: 2,
        from: 1,
        to: 2,
    },
    filters: {
        search: '',
    },
};

describe('RecipeIndex', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders recipe index page correctly', () => {
        render(<RecipeIndex {...mockProps} />);

        expect(screen.getByTestId('app-layout')).toBeInTheDocument();
        expect(screen.getByTestId('control')).toBeInTheDocument();
        expect(screen.getByTestId('recipe-card-1')).toBeInTheDocument();
        expect(screen.getByTestId('recipe-card-2')).toBeInTheDocument();
    });

    test('search filters recipes correctly', async () => {
        render(<RecipeIndex {...mockProps} />);

        const searchInput = screen.getByTestId('search-input');
        fireEvent.change(searchInput, { target: { value: 'chocolate' } });

        await waitFor(() => {
            expect(router.get).toHaveBeenCalledWith(
                expect.any(String),
                { search: 'chocolate' },
                expect.any(Object)
            );
        }, { timeout: 500 });
    });

    test('displays empty state when no recipes', () => {
        const emptyProps = {
            ...mockProps,
            recipes: {
                ...mockProps.recipes,
                data: [],
                total: 0,
            },
        };

        render(<RecipeIndex {...emptyProps} />);

        expect(screen.getByText('No recipes found.')).toBeInTheDocument();
    });

    test('displays search empty state', () => {
        const searchEmptyProps = {
            ...mockProps,
            recipes: {
                ...mockProps.recipes,
                data: [],
                total: 0,
            },
            filters: {
                search: 'nonexistent',
            },
        };

        render(<RecipeIndex {...searchEmptyProps} />);

        expect(screen.getByText('No recipes found matching your search.')).toBeInTheDocument();
    });

    test('handles add recipe button click', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

        render(<RecipeIndex {...mockProps} />);

        const addButton = screen.getByText('Add New Recipe');
        fireEvent.click(addButton);

        expect(consoleSpy).toHaveBeenCalledWith('Add New Recipe clicked');

        consoleSpy.mockRestore();
    });
});