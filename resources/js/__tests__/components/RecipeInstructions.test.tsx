import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

        expect(screen.getByText('Step 1')).toBeInTheDocument();
        expect(screen.getByText('Step 2')).toBeInTheDocument();
        expect(screen.getByText('Step 3')).toBeInTheDocument();

        expect(screen.getByText(/Preheat oven to 350°F/)).toBeInTheDocument();
        expect(screen.getByText(/cream together butter and sugar/)).toBeInTheDocument();
        expect(screen.getByText(/Beat in eggs one at a time/)).toBeInTheDocument();
    });

    test('displays progress tracking', () => {
        render(<RecipeInstructions instructions={mockInstructions} />);

        expect(screen.getByText('0 of 3 steps completed')).toBeInTheDocument();
        expect(screen.getByText('0%')).toBeInTheDocument();
    });

    test('allows marking steps as complete', () => {
        render(<RecipeInstructions instructions={mockInstructions} />);

        const step1Button = screen.getByLabelText('Mark step 1 as complete');
        fireEvent.click(step1Button);

        expect(screen.getByText('1 of 3 steps completed')).toBeInTheDocument();
        expect(screen.getByText('33%')).toBeInTheDocument();
    });

    test('allows unmarking completed steps', () => {
        render(<RecipeInstructions instructions={mockInstructions} />);

        const step1Button = screen.getByLabelText('Mark step 1 as complete');

        // Mark as complete
        fireEvent.click(step1Button);
        expect(screen.getByText('1 of 3 steps completed')).toBeInTheDocument();

        // Unmark
        const step1ButtonIncomplete = screen.getByLabelText('Mark step 1 as incomplete');
        fireEvent.click(step1ButtonIncomplete);
        expect(screen.getByText('0 of 3 steps completed')).toBeInTheDocument();
    });

    test('displays completion message when all steps are done', () => {
        render(<RecipeInstructions instructions={mockInstructions} />);

        // Mark all steps as complete
        const step1Button = screen.getByLabelText('Mark step 1 as complete');
        const step2Button = screen.getByLabelText('Mark step 2 as complete');
        const step3Button = screen.getByLabelText('Mark step 3 as complete');

        fireEvent.click(step1Button);
        fireEvent.click(step2Button);
        fireEvent.click(step3Button);

        expect(screen.getByText('Recipe completed! Great job!')).toBeInTheDocument();
        expect(screen.getByText('100%')).toBeInTheDocument();
    });

    test('displays step images when available', () => {
        render(<RecipeInstructions instructions={mockInstructions} />);

        const stepImage = screen.getByAltText('Step 1 illustration');
        expect(stepImage).toBeInTheDocument();
        expect(stepImage).toHaveAttribute('src', 'https://example.com/step1.jpg');
    });

    test('handles image loading errors', () => {
        render(<RecipeInstructions instructions={mockInstructions} />);

        const stepImage = screen.getByAltText('Step 1 illustration');
        fireEvent.error(stepImage);

        // Image should be removed from DOM after error
        expect(screen.queryByAltText('Step 1 illustration')).not.toBeInTheDocument();
    });

    test('displays cooking tip', () => {
        render(<RecipeInstructions instructions={mockInstructions} />);

        expect(screen.getByText('Cooking Tip')).toBeInTheDocument();
        expect(screen.getByText(/Check off each step as you complete it/)).toBeInTheDocument();
    });

    test('handles empty instructions list', () => {
        render(<RecipeInstructions instructions={[]} />);

        expect(screen.getByText('No instructions provided')).toBeInTheDocument();
        expect(screen.queryByText('Cooking Tip')).not.toBeInTheDocument();
    });

    test('handles null instructions list', () => {
        // @ts-ignore - Testing edge case
        render(<RecipeInstructions instructions={null} />);

        expect(screen.getByText('No instructions provided')).toBeInTheDocument();
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

        const steps = screen.getAllByText(/Step \d/);
        expect(steps[0]).toHaveTextContent('Step 1');
        expect(steps[1]).toHaveTextContent('Step 2');
        expect(steps[2]).toHaveTextContent('Step 3');
    });

    test('applies completed styling to finished steps', () => {
        render(<RecipeInstructions instructions={mockInstructions} />);

        const step1Button = screen.getByLabelText('Mark step 1 as complete');
        fireEvent.click(step1Button);

        // Check that completed step has different styling
        const completedStep = screen.getByText('Step 1');
        expect(completedStep).toHaveClass('line-through');
        expect(completedStep).toHaveClass('text-muted-foreground');
    });

    test('shows step numbers in uncompleted steps', () => {
        render(<RecipeInstructions instructions={mockInstructions} />);

        // Initially, step buttons should show step numbers
        const step1Button = screen.getByLabelText('Mark step 1 as complete');
        expect(step1Button).toHaveTextContent('1');
    });

    test('shows checkmark in completed steps', () => {
        render(<RecipeInstructions instructions={mockInstructions} />);

        const step1Button = screen.getByLabelText('Mark step 1 as complete');
        fireEvent.click(step1Button);

        // After completion, button should show checkmark (svg)
        const completedButton = screen.getByLabelText('Mark step 1 as incomplete');
        const checkmarkSvg = completedButton.querySelector('svg');
        expect(checkmarkSvg).toBeInTheDocument();
    });
});