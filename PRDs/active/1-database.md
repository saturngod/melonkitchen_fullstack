# Database Setup

We are creating the recipe application. We need to following database structure.

All the database ID will use the uuid.

We already have the user table. Now, we will have following database structure. created_at, updated_at will be $table->timestamps()

```
Table users {
  id uuid [primary key, default: `gen_random_uuid()`]
  email varchar(255) [unique, not null]
  username varchar(50) [unique, not null]
  first_name varchar(100)
  last_name varchar(100)
  password_hash varchar(255) [not null]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
  is_active boolean [default: true]
}

Table units {
  id uuid [primary key, default: `gen_random_uuid()`]
  name varchar(50) [unique, not null]
  abbreviation varchar(10) [unique]
  unit_type varchar(20) [not null] // volume, weight, count, etc.
  created_at timestamp [default: `now()`]
}

Table tags {
  id uuid [primary key, default: `gen_random_uuid()`]
  name varchar(100) [unique, not null]
  color varchar(7) // hex color code
  created_at timestamp [default: `now()`]
}

Table categories {
  id uuid [primary key, default: `gen_random_uuid()`]
  parent_id uuid
  name varchar(100) [not null]
  name_en varchar(100) [default: '']
  slug varchar(100) [unique, not null]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table ingredients {
  id uuid [primary key, default: `gen_random_uuid()`]
  name varchar(200) [not null]
  description text
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table ingredient_units {
  id uuid [primary key, default: `gen_random_uuid()`]
  ingredient_id uuid [not null]
  unit_id uuid [not null]
  is_default boolean [default: false]
  
  indexes {
    (ingredient_id, unit_id) [unique]
  }
}

Table recipes {
  id uuid [primary key, default: `gen_random_uuid()`]
  user_id uuid [not null]
  title varchar(255) [not null]
  description text
  prep_time_minutes int [default: 0]
  cook_time_minutes int [default: 0]
  servings int [default: 1]
  difficulty difficulty_level [default: 'easy']
  is_public boolean [default: false]
  image_url text
  youtube_url text
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
  
  indexes {
    (user_id)
    (is_public)
    (difficulty)
    (created_at)
  }
}

Table recipe_instructions {
  id uuid [primary key, default: `gen_random_uuid()`]
  recipe_id uuid [not null]
  step_number int [not null]
  instruction text [not null]
  image_url text
  created_at timestamp [default: `now()`]
  
  indexes {
    (recipe_id, step_number) [unique]
  }
}

Table nutrition_info {
  id uuid [primary key, default: `gen_random_uuid()`]
  recipe_id uuid [not null]
  calories_per_serving decimal(8,2)
  protein_grams decimal(8,2)
  carbs_grams decimal(8,2)
  fat_grams decimal(8,2)
  fiber_grams decimal(8,2)
  sugar_grams decimal(8,2)
  sodium_mg decimal(8,2)
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table recipe_categories {
  id uuid [primary key, default: `gen_random_uuid()`]
  recipe_id uuid [not null]
  category_id uuid [not null]
  
  indexes {
    (recipe_id, category_id) [unique]
  }
}

Table recipe_ingredients {
  id uuid [primary key, default: `gen_random_uuid()`]
  recipe_id uuid [not null]
  ingredient_id uuid [not null]
  quantity decimal(10,3) [not null]
  unit_id uuid [not null]
  notes text
  is_optional boolean [default: false]
  
  indexes {
    (recipe_id)
    (ingredient_id)
  }
}

Table recipe_tags {
  id uuid [primary key, default: `gen_random_uuid()`]
  recipe_id uuid [not null]
  tag_id uuid [not null]
  
  indexes {
    (recipe_id, tag_id) [unique]
  }
}

Table recipe_ratings {
  id uuid [primary key, default: `gen_random_uuid()`]
  recipe_id uuid [not null]
  user_id uuid [not null]
  rating int [not null, note: '1-5 stars']
  review text
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
  
  indexes {
    (recipe_id, user_id) [unique]
    (recipe_id)
    (user_id)
  }
}

// Enums
Enum difficulty_level {
  beginner
  easy
  medium
  hard
  expert
}

// Relationships
Ref: categories.parent_id > categories.id
Ref: ingredient_units.ingredient_id > ingredients.id [delete: cascade]
Ref: ingredient_units.unit_id > units.id [delete: cascade]
Ref: recipes.user_id > users.id [delete: cascade]
Ref: recipe_instructions.recipe_id > recipes.id [delete: cascade]
Ref: nutrition_info.recipe_id > recipes.id [delete: cascade]
Ref: recipe_categories.recipe_id > recipes.id [delete: cascade]
Ref: recipe_categories.category_id > categories.id [delete: cascade]
Ref: recipe_ingredients.recipe_id > recipes.id [delete: cascade]
Ref: recipe_ingredients.ingredient_id > ingredients.id [delete: cascade]
Ref: recipe_ingredients.unit_id > units.id [delete: cascade]
Ref: recipe_tags.recipe_id > recipes.id [delete: cascade]
Ref: recipe_tags.tag_id > tags.id [delete: cascade]
Ref: recipe_ratings.recipe_id > recipes.id [delete: cascade]
Ref: recipe_ratings.user_id > users.id [delete: cascade]
```

