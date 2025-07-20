import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RecipeHeader from '@/components/recipe/RecipeHeader';
import { DetailedRecipe } from '@/types';

const mockRecipe: DetailedRecipe = {
    id: '1',
    title: 'Delicious Chocolate Cake',
    description: 'A rich and moist chocolate cake perfect for any occasion',
    image_url: 'https://example.com/chocolate-cake.jpg',
    is_public: true,
    prep_time_minutes: 20,
    cook_time_minutes: 45,
    servings: 8,
    difficulty: 'medium',
    youtube_url: 'https://youtube.com/watch?v=test',
    categories: [],
    tags: [],
    user: {
        id: 1,
        name: 'Baker',
        email: 'baker@example.com',
        email_verified_at: null,
        created_at: '2023-01-01',
        updated_at: '2023-01-01',
    },
    instructions: [],
    nutritionInfo: undefined,
    recipeIngredients: [],
    created_at: '2023-01-01',
    updated_at: '2023-01-01',
};

describe('RecipeHeader', () => {
    test('renders recipe title correctly', () => {
        render(<RecipeHeader recipe={mockRecipe} />);

        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Delicious Chocolate Cake');
    });

    test('displays recipe description', () => {
        render(<RecipeHeader recipe={mockRecipe} />);

        expect(screen.getByText('A rich and moist chocolate cake perfect for any occasion')).toBeInTheDocument();
    });

    test('displays recipe image with correct alt text', () => {
        render(<RecipeHeader recipe={mockRecipe} />);

        const image = screen.getByAltText('Delicious Chocolate Cake recipe image');
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', 'https://example.com/chocolate-cake.jpg');
    });

    test('displays recipe timing information', () => {
        render(<RecipeHeader recipe={mockRecipe} />);

        expect(screen.getByText('Prep Time')).toBeInTheDocument();
        expect(screen.getByText('20 min')).toBeInTheDocument();
        expect(screen.getByText('Cook Time')).toBeInTheDocument();
        expect(screen.getByText('45 min')).toBeInTheDocument();
    });

    test('displays servings and difficulty', () => {
        render(<RecipeHeader recipe={mockRecipe} />);

        expect(screen.getByText('Servings')).toBeInTheDocument();
        expect(screen.getByText('8')).toBeInTheDocument();
        expect(screen.getByText('Difficulty')).toBeInTheDocument();
        expect(screen.getByText('Medium')).toBeInTheDocument();
    });

    test('calculates and displays total time', () => {
        render(<RecipeHeader recipe={mockRecipe} />);

        expect(screen.getByText('Total Time')).toBeInTheDocument();
        expect(screen.getByText('65 minutes')).toBeInTheDocument();
    });

    test('displays YouTube link when available', () => {
        render(<RecipeHeader recipe={mockRecipe} />);

        const youtubeLink = screen.getByText('Watch on YouTube');
        expect(youtubeLink).toBeInTheDocument();
        expect(youtubeLink.closest('a')).toHaveAttribute('href', 'https://youtube.com/watch?v=test');
        expect(youtubeLink.closest('a')).toHaveAttribute('target', '_blank');
    });

    test('handles missing image with placeholder', () => {
        const recipeWithoutImage = {
            ...mockRecipe,
            image_url: undefined,
        };

        render(<RecipeHeader recipe={recipeWithoutImage} />);

        expect(screen.getByText('No image available')).toBeInTheDocument();
        expect(screen.queryByAltText('Delicious Chocolate Cake recipe image')).not.toBeInTheDocument();
    });

    test('handles image loading error', async () => {
        render(<RecipeHeader recipe={mockRecipe} />);

        const image = screen.getByAltText('Delicious Chocolate Cake recipe image');

        // Simulate image error
        fireEvent.error(image);

        await waitFor(() => {
            expect(screen.getByText('No image available')).toBeInTheDocument();
        });
    });

    test('handles missing description', () => {
        const recipeWithoutDescription = {
            ...mockRecipe,
            description: '',
        };

        render(<RecipeHeader recipe={recipeWithoutDescription} />);

        expect(screen.queryByText('Description')).not.toBeInTheDocument();
    });

    test('handles missing timing information', () => {
        const recipeWithoutTiming = {
            ...mockRecipe,
            prep_time_minutes: undefined,
            cook_time_minutes: undefined,
            servings: undefined,
            difficulty: undefined,
        };

        render(<RecipeHeader recipe={recipeWithoutTiming} />);

        expect(screen.queryByText('Prep Time')).not.toBeInTheDocument();
        expect(screen.queryByText('Cook Time')).not.toBeInTheDocument();
        expect(screen.queryByText('Servings')).not.toBeInTheDocument();
        expect(screen.queryByText('Difficulty')).not.toBeInTheDocument();
        expect(screen.queryByText('Total Time')).not.toBeInTheDocument();
    });

    test('handles missing YouTube URL', () => {
        const recipeWithoutYoutube = {
            ...mockRecipe,
            youtube_url: undefined,
        };

        render(<RecipeHeader recipe={recipeWithoutYoutube} />);

        expect(screen.queryByText('Watch on YouTube')).not.toBeInTheDocument();
    });

    test('displays only prep time when cook time is missing', () => {
        const recipeWithOnlyPrepTime = {
            ...mockRecipe,
            cook_time_minutes: undefined,
        };

        render(<RecipeHeader recipe={recipeWithOnlyPrepTime} />);

        expect(screen.getByText('Prep Time')).toBeInTheDocument();
        expect(screen.getByText('20 min')).toBeInTheDocument();
        expect(screen.queryByText('Cook Time')).not.toBeInTheDocument();
        expect(screen.getByText('Total Time')).toBeInTheDocument();
        expect(screen.getByText('20 minutes')).toBeInTheDocument();
    });

    test('displays only cook time when prep time is missing', () => {
        const recipeWithOnlyCookTime = {
            ...mockRecipe,
            prep_time_minutes: undefined,
        };

        render(<RecipeHeader recipe={recipeWithOnlyCookTime} />);

        expect(screen.queryByText('Prep Time')).not.toBeInTheDocument();
        expect(screen.getByText('Cook Time')).toBeInTheDocument();
        expect(screen.getByText('45 min')).toBeInTheDocument();
        expect(screen.getByText('Total Time')).toBeInTheDocument();
        expect(screen.getByText('45 minutes')).toBeInTheDocument();
    });
});