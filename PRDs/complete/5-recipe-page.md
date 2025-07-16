# Recipe

Receipe page is `/dashboard/recipes`. It will show the list of the recipes. We will use the RecipeController.

At the Recipe page, it will show the recipe list. Will show with grid view. At the page, we will use `<Control>` component for Search and Add New Recipe.

Recipe will show as grid view.

Recipe Card View like following.

- Image
- Title
- description (2 line only)
- category | subscategory
- is_public (on/off switch from Shadcn UI , https://ui.shadcn.com/docs/components/switch)
- tags (use ShadcnUI component Badge)
- Edit and Delete with Dropdown Menu. There is three dot on the right top of the card view.

We will use Shadcn UI component CardView.

Page need to support the pagination.

Search will allow to search the Title only.

Now, Create Event doesn't do anything now. only for console log first.
