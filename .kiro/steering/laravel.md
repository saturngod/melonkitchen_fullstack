This rule only apply on \*.php code.
As a senior Laravel developer, writing clean, maintainable, and scalable code is the standard. This guide covers advanced concepts and best practices, including cursor pagination, SOLID principles, and a sophisticated approach to data retrieval using headers, all within the context of modern Laravel development.

## Header-Based Data Retrieval: A Decoupled Approach

Instead of directly using `/App/Models/MyData::find()` , we will use like `use App/Models/MyData;` at the header and apply the `MyData::find()`.

Example

```php
use App\Models\MyData;

public function index(Request $request)
{
    $data = MyData::find($request->id);
    return response()->json($data);
}
```

## SOLID Principles: A Comprehensive Approach

The SOLID principles are a set of design principles that are widely used in object-oriented programming. They are designed to make software more maintainable, scalable, and flexible.

## Laravel Eloquent: A Comprehensive Approach

Laravel Eloquent is a powerful ORM (Object-Relational Mapping) library for Laravel. It provides a simple and intuitive way to interact with databases, allowing you to perform CRUD operations and more.
