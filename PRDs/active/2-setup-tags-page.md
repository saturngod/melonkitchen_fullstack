# Tag Page

Create the tag management page. 


## Step 1 : Setup Route

Create the the route at `web.php`. Route is `/tag`. Need to create the TagController. It can be resource Controller. Menu is on `app-sidebar.tsx`. I already added the `/tag` menu in there. So, you may not need to add in there.

## Step 2 : Setup View

View will be inertiajs view. Will use `Inertia::render`. File will be save `resources/js/pages/tag/index.tsx`.

## Step 3 : Show Tag List

It will create show the Table view of tags. It will use shadcn ui components, `<Table>` for the list of tag. Table will be Name | Created At | Action. Action will be dropdown Menu. You can add with `npx shadcn@latest add dropdown-menu` and reference from https://ui.shadcn.com/docs/components/dropdown-menu . Action will include Edit and Delete. 

## Step 4: Confrim Dialog

We need to create the Confirm Dialog as Shared Component. It will be under `resources/js/components/shared`. Confirm Dialog will be two variant. Normal and destructive. destructive will be red color confirm button.


## Step 5 : Delete Tag

When click on Delete on Action Dropdown Menu. It will delete the tag. Before delete , it will show the confirm dialog. So, we need to create the Confirm Dialog before delete. After click on Confirm , it will delete the tag. Call the backend with `route('tag.destory')`.


## Step 6 : Control Panel

We will crate the contrl component. That will allow search bar and Action Button. We must use the shadcn ui input and button for the search and action button.

Search Input will be on the left side and Action Button will be on the right side. There will be space between them. Like `<Search Input><full space> <Action>`.

It will create and save on the `resources/js/components/shared`. Action button text and event will be decouple design and component will allow to use as properties.

## Step 7 : Control Panel on Tag

We will use Control on the Tag list. It will be like 

```
<Control actionText="Create" actionEvent={handleCreateTag} />
<TagTableView/>
```

## Step 8 : Create New Tag

When click on create , it will show the dialog for create tag. There will be like following design.

```
<Input placeholder="Search">
<Button>Cancel</Button> <Button>Create</Button>
```

After click on Create, it will submit to backend and create the new tag. 

Tag Table need to refactor.

It will be `name,created_user_id,is_public`.

When create the new tag, we need to save the user_id and is_public is always false except user role is ADMIN. If created user is UserRole::ADMIN , it will be is_public true.

So, we need to create the user role in user table. We should create the UserRole Enum. UserRole will be ADMIN , USER, CREATOR. Default created user will be USER role. 



