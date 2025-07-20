import React from 'react';
import { render, screen } from '@testing-library/react';
import RecipeInstructions from '@/components/recipe/RecipeInstructions';
import { RecipeInstruction } from '@/types';

const mockInstructions: RecipeInstruction[] = [
    {
        id: '1',
        step_number: 1,
        instruction: 'Preheat oven to 350°F (175°C). Grease and flour a 9-inch round cake pan.',
        image_url: 'https://example.com/step1.jpg',
    },
    {
        id: '2',
        step_number: 2,
        instruction: 'In a large bowl, cream together butter and sugar until light and fluffy.',
        image_url: undefined,
    },
    {
        id: '3',
        step_number: 3,
        instruction: 'Beat in eggs one at a time, then stir in vanilla extract.',
        image_url: undefined,
    },
];

describe('RecipeInstructions', () => {
    test('renders all instructions in correct order', () => {
        render(<RecipeInstructions instructions={mockInstructions} />);

        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();

        expect(screen.getByText(/Preheat oven to 350°F/)).toBeInTheDocument();
        expect(screen.getByText(/cream together butter and sugar/)).toBeInTheDocument();
        expect(screen.getByText(/Beat in eggs one at a time/)).toBeInTheDocument();
    });

    test('displays step images when available', () => {
        render(<RecipeInstructions instructions={mockInstructions} />);

        const stepImage = screen.getByAltText('Step 1 visual guide');
        expect(stepImage).toBeInTheDocument();
        expect(stepImage).toHaveAttribute('src', 'https://example.com/step1.jpg');
    });

    test('handles empty instructions list', () => {
        render(<RecipeInstructions instructions={[]} />);

        expect(screen.getByText('No Instructions Available')).toBeInTheDocument();
        expect(screen.getByText('This recipe doesn\'t have any cooking instructions yet.')).toBeInTheDocument();
    });

    test('handles null instructions list', () => {
        // @ts-ignore - Testing edge case
        render(<RecipeInstructions instructions={null} />);

        expect(screen.getByText('No Instructions Available')).toBeInTheDocument();
    });

    test('sorts instructions by step number', () => {
        const unorderedInstructions: RecipeInstruction[] = [
            {
                id: '3',
                step_number: 3,
                instruction: 'Third step',
                image_url: undefined,
            },
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
            },
        ];

        render(<RecipeInstructions instructions={unorderedInstructions} />);

        const tableRows = screen.getByRole('table').querySelectorAll('tbody tr');
        expect(tableRows[0]).toHaveTextContent('1');
        expect(tableRows[0]).toHaveTextContent('First step');
        expect(tableRows[1]).toHaveTextContent('2');
        expect(tableRows[1]).toHaveTextContent('Second step');
        expect(tableRows[2]).toHaveTextContent('3');
        expect(tableRows[2]).toHaveTextContent('Third step');
    });

    test('displays step numbers with circular styling', () => {
        render(<RecipeInstructions instructions={mockInstructions} />);

        const stepNumbers = screen.getAllByText(/^[123]$/);
        stepNumbers.forEach((stepNumber) => {
            const parent = stepNumber.closest('div');
            expect(parent).toHaveClass('rounded-full');
            expect(parent).toHaveClass('bg-primary');
            expect(parent).toHaveClass('text-primary-foreground');
        });
    });

    test('renders table structure correctly', () => {
        render(<RecipeInstructions instructions={mockInstructions} />);

        expect(screen.getByRole('table')).toBeInTheDocument();

        const tableRows = screen.getByRole('table').querySelectorAll('tbody tr');
        expect(tableRows).toHaveLength(3);

        // Each row should have 2 cells: step number and instruction content
        tableRows.forEach((row) => {
            const cells = row.querySelectorAll('td');
            expect(cells).toHaveLength(2);
        });
    });

    test('does not display images when image_url is not provided', () => {
        const instructionsWithoutImages: RecipeInstruction[] = [
            {
                id: '1',
                step_number: 1,
                instruction: 'Mix ingredients',
                image_url: undefined,
            },
        ];

        render(<RecipeInstructions instructions={instructionsWithoutImages} />);

        expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    test('image has correct styling when present', () => {
        render(<RecipeInstructions instructions={mockInstructions} />);

        const stepImage = screen.getByAltText('Step 1 visual guide');
        expect(stepImage).toHaveClass('rounded-lg');
        expect(stepImage).toHaveClass('border');
        expect(stepImage).toHaveClass('shadow-sm');
        expect(stepImage).toHaveClass('object-cover');
    });
});