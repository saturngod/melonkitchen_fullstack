# Product Overview

This is a recipe management application built with Laravel and React. The application allows users to manage recipes, ingredients, categories, and tags in a structured way.

## Core Features

- **Recipe Management**: Create, edit, and organize recipes with ingredients, instructions, and nutritional information
- **Ingredient Management**: Maintain a database of ingredients with units and nutritional data
- **Category System**: Hierarchical categorization with parent-child relationships
- **Tag System**: Flexible tagging for recipes with public/private visibility
- **User Management**: Authentication with role-based access (Admin/User)

## User Roles

- **Admin**: Can create public tags and manage all content
- **User**: Can create private tags and manage their own content

## Key Business Rules

- Categories support hierarchical structure (parent-child relationships)
- Tags can be public (Admin only) or private (User created)
- Ingredients are linked to units and nutritional information
- Recipes can have multiple categories, tags, and ingredients
- All entities use UUID primary keys for better scalability
