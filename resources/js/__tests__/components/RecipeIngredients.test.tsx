import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RecipeIngredients from '@/components/recipe/RecipeIngredients';
import { RecipeIngredient } from '@/types';

const mockIngredients: RecipeIngredient[] = [
    {
        id: '1',
        quantity: '2',
        notes: 'Large, room temperature',
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
    },
    {
        id: '3',
        quantity: undefined,
        notes: 'For garnish',
        is_optional: true,
        ingredient: {
            id: '3',
            name: 'Fresh Mint',
        },
        unit: undefined,
    },
];

describe('RecipeIngredients', () => {
    test('renders all ingredients correctly', () => {
        render(<RecipeIngredients ingredients={mockIngredients} />);

        expect(screen.getByText('Eggs')).toBeInTheDocument();
        expect(screen.getByText('Vanilla Extract')).toBeInTheDocument();
        expect(screen.getByText('Fresh Mint')).toBeInTheDocument();
    });

    test('displays ingredient quantities and units', () => {
        render(<RecipeIngredients ingredients={mockIngredients} />);

        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('pcs')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('tsp')).toBeInTheDocument();
    });

    test('displays ingredient notes when available', () => {
        render(<RecipeIngredients ingredients={mockIngredients} />);

        expect(screen.getByText('Large, room temperature')).toBeInTheDocument();
        expect(screen.getByText('For garnish')).toBeInTheDocument();
    });

    test('marks optional ingredients correctly', () => {
        render(<RecipeIngredients ingredients={mockIngredients} />);

        const optionalBadges = screen.getAllByText('Optional');
        expect(optionalBadges).toHaveLength(2); // Vanilla Extract and Fresh Mint are optional
    });

    test('handles ingredients without quantities', () => {
        render(<RecipeIngredients ingredients={mockIngredients} />);

        // Fresh Mint has no quantity, should still display the ingredient name
        expect(screen.getByText('Fresh Mint')).toBeInTheDocument();
    });

    test('displays ingredients summary', () => {
        render(<RecipeIngredients ingredients={mockIngredients} />);

        expect(screen.getByText('Total ingredients:')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
        expect(screen.getByText('Optional:')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
    });

    test('allows checking off ingredients', () => {
        render(<RecipeIngredients ingredients={mockIngredients} />);

        const checkboxes = screen.getAllByRole('checkbox');
        expect(checkboxes).toHaveLength(3);

        // Click first checkbox
        fireEvent.click(checkboxes[0]);
        expect(checkboxes[0]).toBeChecked();
    });

    test('displays shopping tip', () => {
        render(<RecipeIngredients ingredients={mockIngredients} />);

        expect(screen.getByText('Shopping Tip')).toBeInTheDocument();
        expect(screen.getByText(/Check off ingredients as you gather them/)).toBeInTheDocument();
    });

    test('handles empty ingredients list', () => {
        render(<RecipeIngredients ingredients={[]} />);

        expect(screen.getByText('No ingredients specified')).toBeInTheDocument();
        expect(screen.queryByText('Shopping Tip')).not.toBeInTheDocument();
    });

    test('handles null ingredients list', () => {
        // @ts-ignore - Testing edge case
        render(<RecipeIngredients ingredients={null} />);

        expect(screen.getByText('No ingredients specified')).toBeInTheDocument();
    });

    test('displays correct styling for optional vs required ingredients', () => {
        render(<RecipeIngredients ingredients={mockIngredients} />);

        // Check that optional ingredients have different styling
        const ingredientContainers = screen.getAllByRole('checkbox').map(checkbox =>
            checkbox.closest('div')?.parentElement
        );

        // First ingredient (Eggs) is required - should have solid border
        expect(ingredientContainers[0]).toHaveClass('border-border');

        // Second ingredient (Vanilla Extract) is optional - should have dashed border
        expect(ingredientContainers[1]).toHaveClass('border-dashed');
    });

    test('displays unit abbreviation when available', () => {
        render(<RecipeIngredients ingredients={mockIngredients} />);

        // Should use abbreviation 'pcs' instead of full name 'pieces'
        expect(screen.getByText('pcs')).toBeInTheDocument();
        expect(screen.queryByText('pieces')).not.toBeInTheDocument();

        // Should use abbreviation 'tsp' instead of full name 'teaspoon'
        expect(screen.getByText('tsp')).toBeInTheDocument();
        expect(screen.queryByText('teaspoon')).not.toBeInTheDocument();
    });

    test('falls back to unit name when abbreviation not available', () => {
        const ingredientWithoutAbbreviation: RecipeIngredient[] = [
            {
                id: '1',
                quantity: '1',
                notes: undefined,
                is_optional: false,
                ingredient: {
                    id: '1',
                    name: 'Cup of flour',
                },
                unit: {
                    id: '1',
                    name: 'cup',
                    abbreviation: '', // Empty abbreviation
                },
            },
        ];

        render(<RecipeIngredients ingredients={ingredientWithoutAbbreviation} />);

        expect(screen.getByText('cup')).toBeInTheDocument();
    });
});