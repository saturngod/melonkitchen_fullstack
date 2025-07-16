import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RecipeCard from '@/components/RecipeCard';
import { Recipe } from '@/types';

const mockRecipe: Recipe = {
    id: '1',
    title: 'Test Recipe',
    description: 'This is a test recipe description that should be truncated to two lines when displayed in the card component.',
    image_url: 'https://example.com/image.jpg',
    is_public: true,
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
        name: 'Test User',
        email: 'test@example.com',
        email_verified_at: null,
        created_at: '2023-01-01',
        updated_at: '2023-01-01',
    },
    created_at: '2023-01-01',
    updated_at: '2023-01-01',
};

const mockProps = {
    recipe: mockRecipe,
    onTogglePublic: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
};

describe('RecipeCard', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders recipe card with all data', () => {
        render(<RecipeCard {...mockProps} />);

        expect(screen.getByText('Test Recipe')).toBeInTheDocument();
        expect(screen.getByText(/This is a test recipe description/)).toBeInTheDocument();
        expect(screen.getByText('Desserts')).toBeInTheDocument();
        expect(screen.getByText('Sweet')).toBeInTheDocument();
    });

    test('handles missing image gracefully', () => {
        const recipeWithoutImage = { ...mockRecipe, image_url: undefined };
        render(<RecipeCard {...mockProps} recipe={recipeWithoutImage} />);

        expect(screen.getByText('No image')).toBeInTheDocument();
    });

    test('displays tags and categories correctly', () => {
        render(<RecipeCard {...mockProps} />);

        expect(screen.getByText('Sweet')).toBeInTheDocument();
        expect(screen.getByText('Desserts')).toBeInTheDocument();
    });

    test('handles public toggle correctly', () => {
        render(<RecipeCard {...mockProps} />);

        const toggle = screen.getByRole('switch');
        expect(toggle).toBeChecked();

        fireEvent.click(toggle);
        expect(mockProps.onTogglePublic).toHaveBeenCalledWith('1', false);
    });

    test('handles edit action correctly', () => {
        render(<RecipeCard {...mockProps} />);

        const menuButton = screen.getByRole('button', { name: /open menu/i });
        fireEvent.click(menuButton);

        const editButton = screen.getByText('Edit');
        fireEvent.click(editButton);

        expect(mockProps.onEdit).toHaveBeenCalledWith('1');
    });

    test('handles delete action correctly', () => {
        render(<RecipeCard {...mockProps} />);

        const menuButton = screen.getByRole('button', { name: /open menu/i });
        fireEvent.click(menuButton);

        const deleteButton = screen.getByText('Delete');
        fireEvent.click(deleteButton);

        expect(mockProps.onDelete).toHaveBeenCalledWith('1');
    });
});