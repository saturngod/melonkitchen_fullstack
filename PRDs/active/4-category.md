# Category

Before starting design reference from `js/pages/tag/index.tsx`.

# Step 1 : Page

Category page is `/dashboard/categories`. It will show the list of the category .

Category page will show the list of category page with pagination. Will save in `resources/js/pages/categories/index.tsx`. Controller is `CategoryController`

Category list is using `<Table>` from Shadcn UI component, `resources/js/components/ui/table.tsx`.

We will only show the no parent Category first. After parent, will show the child. Example

- Parent Category Name | Action
    - Child Category Name | Action

Table will show , name and action only. Action will be edit and delete. reference `/resources/js/pages/tag/index.tsx`

Will use `<Control>` component. Will show Search Input and Create Button.

# Step 2 : Add New Form

Add new form will show

- Category Name (required)
- Parent Category Name ( Used the combobox for category list, https://ui.shadcn.com/docs/components/combobox , it can be empty value. )
- Cancel | Create

When create , it will call to the create the category in the `CategoryController.store`. Make sure the validation for the category is exist. If category is already exist, it will not saving. show the error.

Before sending, must validate on client first.

# Step 3 : Edit Form

When Click on Edit from Action menu. It will show like Add New Form. user can edit

- Category Name (required)
- Parent Category Name (Used the combobox for category list, https://ui.shadcn.com/docs/components/combobox , allow to empty)
- Cancel | Update

Before update , must vaidate client first.

# Step 4: Delete

From the Action Menu, allow to delete. Before delete ask the confirm dialog first. After confirm, delete it.

# Search

Search will allow to search the catgory name.
