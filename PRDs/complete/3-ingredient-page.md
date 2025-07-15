# Ingredient Page

Create the ingredient page , `/ingredient`. It will update on `web.php` and Create the resource controller `IngredientController`. View will be `resources/js/ingredient/index.tsx`.

It will show the list of Ingredient list. It will use `<Table>` from shadcn ui component.

`Name | Description | Units  | Action`

Name will be name , Example Tomato.
Description will be description of product. Example Fresh red tomato.
Units, it will be multiple value from ingredient_units. Will show with Badge Component from Shadcn ui.

Action will be drop down menu. Please reference `resources/js/pages/tag/index`.

Action are , Edit and Delete.

We will use Control at the page.

Page need to support pagination.

```tsx
<Control searchValue={search} onSearchChange={handleSearchChange} actionText="Create" actionEvent={() => setShowCreate(true)} />
```

## Add Form

When Click on create, it will show Add Form Dialog. Dialog is ShadcnUI component. Dialog will show

- Name
- Description
- Unit (will use the comma for multiple unit. We need to show the description about that "use comma for multiple unit")

Cancel and Save.

When click on save, it will Call to `IngredientController`. Use the `route(ingredient.create)` in reactjs.

At the backend, will do validation and save the data. Unit will be separate with comma and become the array.

Create new `Ingredient`. After that, save in `IngredientUnit`.

## Edit Form

Same like Add form. It will show with Dialog.

- Name
- Description
- Unit (will use the comma for multiple unit. We need to show the description about that "use comma for multiple unit")

Cancel and Update.

When click on Update, it will Call to `IngredientController`. Use the `route(ingredient.update)` in reactjs.

It will update the ingredient.

Unit will separate with comma. Remove all the current `IngredientUnit` of Ingredient. And Add new `IngredientUnit`.

## Search

Search will only search on name and description.
