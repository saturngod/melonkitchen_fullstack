# Seeder

Read the `PRDs/data/category.md`,`PRDs/data/ingredient.md`,`PRDs/data/recipes-list.csv`.

We need to create the data seeder for that. We will have following seeder

- database/seeders/CategoriesSeeder.php
- database/seeders/IngredientsSeeder.php
- database/seeders/IngredientUnitsSeeder.php
- database/seeders/RecipeSeeder.php
- database/seeders/TagsSeeder.php
- database/seeders/UnitsSeeder.php

Base on the data, we will setup the category, ingredient, unit for ingredient, tags and recipe.

In the data, it may be missing instruction and nutrition information. You can add your own instruction list for data. We will check and fix that later. For now, you can add it.

## Category File

In the category.md , we are using

- အသားဟင်း
    - Stired Fried

`အသားဟင်း` is partent category and `Stired Fried` is child.

## Ingredient

In the ingredient.md, we are using list only. We don't have a unit for ingredient. So, you need to use suitable unit for that.

## Recipes

In the `recipes-list.csv` , it's

- NAME
- Main Category
- Sub Category
- Main Ingredient_1
- Ingredient_2

For our system, select the sub category may enough because we can get the main category when we have sub category. You can add both ingredients if it's missing. Also need to add suitable unit for that ingredient, too.
