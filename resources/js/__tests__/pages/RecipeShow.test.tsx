import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { router } from '@inertiajs/react';
import RecipeShow from '@/pages/recipes/show';
import { DetailedRecipe } from '@/types';

// Mock Inertia router
jest.mock('@inertiajs/react', () => ({
    ...jest.requireActual('@inertiajs/react'),
    router: {
        get: jest.fn(),
        delete: jest.fn(),
    },
    Head: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    usePage: () => ({
        props: {
            auth: {
                user: { id: 1, name: 'Test User', email: 'test@example.com' }
            },
            errors: {}
        }
    }),
}));

// Mock components
jest.mock('@/layouts/app-layout', () => {
    return function AppLayout({ children }: { children: React.ReactNode }) {
        return <div data-testid="app-layout">{children}</div>;
    };
});

jest.mock('@/components/recipe/RecipeHeader', () => {
    return function RecipeHeader({ recipe }: { recipe: DetailedRecipe }) {
        return <div data-testid="recipe-header">{recipe.title}</div>;
    };
});

jest.mock('@/components/recipe/RecipeMetadata', () => {
    return function RecipeMetadata({ recipe }: { recipe: DetailedRecipe }) {
        return <div data-testid="recipe-metadata">Metadata for {recipe.title}</div>;
    };
});

jest.mock('@/components/recipe/RecipeIngredients', () => {
    return function RecipeIngredients({ ingredients }: { ingredients: any[] }) {
        return <div data-testid="recipe-ingredients">{ingredients.length} ingredients</div>;
    };
});

jest.mock('@/components/recipe/RecipeInstructions', () => {
    return function RecipeInstructions({ instructions }: { instructions: any[] }) {
        return <div data-testid="recipe-instructions">{instructions.length} instructions</div>;
    };
});

jest.mock('@/components/recipe/RecipeNutrition', () => {
    return function RecipeNutrition({ nutrition }: { nutrition?: any }) {
        return <div data-testid="recipe-nutrition">{nutrition ? 'Has nutrition' : 'No nutrition'}</div>;
    };
});

jest.mock('@/components/recipe/RecipeActions', () => {
    return function RecipeActions({ recipe }: { recipe: DetailedRecipe }) {
        return <div data-testid="recipe-actions">Actions for {recipe.title}</div>;
    };
});

const mockRecipe: DetailedRecipe = {
    id: '1',
    title: 'Test Recipe',
    description: 'A test recipe description',
    image_url: 'https://example.com/image.jpg',
    is_public: true,
    prep_time_minutes: 15,
    cook_time_minutes: 30,
    servings: 4,
    difficulty: 'medium',
    youtube_url: 'https://youtube.com/watch?v=test',
    categories: [
        {
            id: '1',
            name: 'Desserts',
            parent_id: null,
            created_at: '2023-01-01',
            updated_at: '2023-01-01',
        }
    ],
    tags: [
        {
            id: '1',
            name: 'Sweet',
            is_public: true,
            created_at: '2023-01-01',
            updated_at: '2023-01-01',
        }
    ],
    user: {
        id: 1,
        name: 'Recipe Author',
        email: 'author@example.com',
        email_verified_at: null,
        created_at: '2023-01-01',
        updated_at: '2023-01-01',
    },
    instructions: [
        {
            id: '1',
            step_number: 1,
            instruction: 'First step',
            image_url: undefined,
        },
        {
            id: '2',
            step_number: 2,
            instruction: 'Second step',
            image_url: undefined,
        }
    ],
    nutritionInfo: {
        id: '1',
        calories_per_serving: 250,
        protein_grams: 10,
        carbs_grams: 30,
        fat_grams: 15,
        fiber_grams: 5,
        sugar_grams: 20,
        sodium_mg: 200,
    },
    recipeIngredients: [
        {
            id: '1',
            quantity: '2',
            notes: 'Fresh',
            is_optional: false,
            ingredient: {
                id: '1',
                name: 'Eggs',
            },
            unit: {
                id: '1',
                name: 'pieces',
                abbreviation: 'pcs',
            },
        },
        {
            id: '2',
            quantity: '1',
            notes: undefined,
            is_optional: true,
            ingredient: {
                id: '2',
                name: 'Vanilla Extract',
            },
            unit: {
                id: '2',
                name: 'teaspoon',
                abbreviation: 'tsp',
            },
        }
    ],
    created_at: '2023-01-01',
    updated_at: '2023-01-01',
};

describe('RecipeShow', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders recipe detail page correctly', () => {
        render(<RecipeShow recipe={mockRecipe} />);

        expect(screen.getByTestId('app-layout')).toBeInTheDocument();
        expect(screen.getByTestId('recipe-header')).toBeInTheDocument();
        expect(screen.getByTestId('recipe-metadata')).toBeInTheDocument();
        expect(screen.getByTestId('recipe-ingredients')).toBeInTheDocument();
        expect(screen.getByTestId('recipe-instructions')).toBeInTheDocument();
        expect(screen.getByTestId('recipe-nutrition')).toBeInTheDocument();
        expect(screen.getByTestId('recipe-actions')).toBeInTheDocument();
    });

    test('displays recipe title in header', () => {
        render(<RecipeShow recipe={mockRecipe} />);

        expect(screen.getByText('Test Recipe')).toBeInTheDocument();
    });

    test('displays correct number of ingredients and instructions', () => {
        render(<RecipeShow recipe={mockRecipe} />);

        expect(screen.getByText('2 ingredients')).toBeInTheDocument();
        expect(screen.getByText('2 instructions')).toBeInTheDocument();
    });

    test('displays nutrition information when available', () => {
        render(<RecipeShow recipe={mockRecipe} />);

        expect(screen.getByText('Has nutrition')).toBeInTheDocument();
    });

    test('handles recipe without nutrition information', () => {
        const recipeWithoutNutrition = {
            ...mockRecipe,
            nutritionInfo: undefined,
        };

        render(<RecipeShow recipe={recipeWithoutNutrition} />);

        expect(screen.getByText('No nutrition')).toBeInTheDocument();
    });

    test('displays error state when recipe is not provided', () => {
        // @ts-ignore - Testing error case
        render(<RecipeShow recipe={null} />);

        expect(screen.getByText('Recipe Not Found')).toBeInTheDocument();
        expect(screen.getByText('Back to Recipes')).toBeInTheDocument();
        expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    test('handles back to recipes navigation', () => {
        // @ts-ignore - Testing error case
        render(<RecipeShow recipe={null} />);

        const backButton = screen.getByText('Back to Recipes');
        fireEvent.click(backButton);

        expect(router.get).toHaveBeenCalledWith(expect.stringContaining('recipes.index'));
    });

    test('handles retry action', () => {
        const reloadSpy = jest.spyOn(window.location, 'reload').mockImplementation(() => { });

        // @ts-ignore - Testing error case
        render(<RecipeShow recipe={null} />);

        const retryButton = screen.getByText('Try Again');
        fireEvent.click(retryButton);

        expect(reloadSpy).toHaveBeenCalled();

        reloadSpy.mockRestore();
    });

    test('displays all recipe sections with proper headings', () => {
        render(<RecipeShow recipe={mockRecipe} />);

        expect(screen.getByText('Recipe Information')).toBeInTheDocument();
        expect(screen.getByText('Ingredients')).toBeInTheDocument();
        expect(screen.getByText('Instructions')).toBeInTheDocument();
        expect(screen.getByText('Nutrition Information')).toBeInTheDocument();
        expect(screen.getByText('Actions')).toBeInTheDocument();
    });

    test('renders with empty ingredients and instructions', () => {
        const emptyRecipe = {
            ...mockRecipe,
            instructions: [],
            recipeIngredients: [],
        };

        render(<RecipeShow recipe={emptyRecipe} />);

        expect(screen.getByText('0 ingredients')).toBeInTheDocument();
        expect(screen.getByText('0 instructions')).toBeInTheDocument();
    });
});