---
applyTo: '*.php'
---

# Laravel 12.x Development Instructions for GitHub Copilot

## Overview
These instructions guide GitHub Copilot to generate Laravel 12.x code following senior developer best practices, emphasizing SOLID principles, clean architecture, and modern PHP patterns.

## Core Principles

### SOLID Principles
- **Single Responsibility**: Each class should have one reason to change
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Derived classes must be substitutable for base classes
- **Interface Segregation**: Clients shouldn't depend on interfaces they don't use
- **Dependency Inversion**: Depend on abstractions, not concretions

### Clean Code Standards
- Use meaningful variable and method names
- Keep methods small and focused (max 20 lines)
- Avoid deep nesting (max 3 levels)
- Use early returns to reduce complexity
- Follow PSR-12 coding standards

## Laravel 12.x Specific Guidelines

### Service Container & Dependency Injection
```php
// ✅ Good - Constructor injection with interface
class UserController extends Controller
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
        private readonly NotificationService $notificationService
    ) {}
}

// ❌ Bad - Direct instantiation
class UserController extends Controller
{
    public function store(Request $request)
    {
        $user = new User(); // Avoid direct instantiation
    }
}
```

### Repository Pattern Implementation

```php
// Interface
interface UserRepositoryInterface
{
    public function findById(int $id): ?User;
    public function create(array $data): User;
    public function update(int $id, array $data): bool;
}

// Implementation
class EloquentUserRepository implements UserRepositoryInterface
{
    public function __construct(private readonly User $model) {}
    
    public function findById(int $id): ?User
    {
        return $this->model->find($id);
    }
}
```

### Service Layer Pattern

```php
class UserService
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
        private readonly HashManager $hasher,
        private readonly EventDispatcher $eventDispatcher
    ) {}
    
    public function createUser(CreateUserRequest $request): User
    {
        $user = $this->userRepository->create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $this->hasher->make($request->password),
        ]);
        
        $this->eventDispatcher->dispatch(new UserCreated($user));
        
        return $user;
    }
}
```

## Architecture Patterns
### Command Pattern for Complex Operations

```php
class CreateUserCommand
{
    public function __construct(
        public readonly string $name,
        public readonly string $email,
        public readonly string $password
    ) {}
}

class CreateUserHandler
{
    public function handle(CreateUserCommand $command): User
    {
        // Business logic here
    }
}
```

### Query Pattern for Data Retrieval

```php
class GetUserQuery
{
    public function __construct(public readonly int $userId) {}
}

class GetUserHandler
{
    public function handle(GetUserQuery $query): ?User
    {
        return $this->userRepository->findById($query->userId);
    }
}
```


### Factory Pattern for Complex Object Creation

```php
class UserFactory
{
    public function createFromRequest(CreateUserRequest $request): User
    {
        return new User([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'email_verified_at' => now(),
        ]);
    }
}
```


### Form Request Validation

```php
class CreateUserRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ];
    }
    
    public function messages(): array
    {
        return [
            'email.unique' => 'This email address is already registered.',
        ];
    }
}
```

### Resource Classes for API Responses

```php
class UserResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
```

## Event-Driven Architecture
```php
// Event
class UserCreated
{
    public function __construct(public readonly User $user) {}
}

// Listener
class SendWelcomeEmail
{
    public function handle(UserCreated $event): void
    {
        Mail::to($event->user->email)->send(new WelcomeEmail($event->user));
    }
}
Database Best Practices
Eloquent Models
phpclass User extends Authenticatable
{
    protected $fillable = ['name', 'email', 'password'];
    
    protected $hidden = ['password', 'remember_token'];
    
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];
    
    // Relationships
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }
}
```

### Query Optimization

```php
// ✅ Good - Eager loading
$users = User::with('posts.comments')->get();

// ✅ Good - Chunking for large datasets
User::chunk(100, function ($users) {
    foreach ($users as $user) {
        // Process user
    }
});

// ✅ Good - Specific columns
$users = User::select('id', 'name', 'email')->get();
```
### Error Handling

```php
class UserService
{
    public function createUser(CreateUserRequest $request): User
    {
        try {
            DB::beginTransaction();
            
            $user = $this->userRepository->create($request->validated());
            
            DB::commit();
            
            return $user;
        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('User creation failed', [
                'error' => $e->getMessage(),
                'data' => $request->validated()
            ]);
            
            throw new UserCreationException('Failed to create user');
        }
    }
}
```

## Testing Guidelines
### Feature Tests

```php
class UserControllerTest extends TestCase
{
    use RefreshDatabase;
    
    public function test_user_can_be_created(): void
    {
        $userData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];
        
        $response = $this->postJson('/api/users', $userData);
        
        $response->assertStatus(201)
                ->assertJsonStructure(['data' => ['id', 'name', 'email']]);
        
        $this->assertDatabaseHas('users', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
        ]);
    }
}
```

## Unit Tests

```php
class UserServiceTest extends TestCase
{
    public function test_creates_user_successfully(): void
    {
        $mockRepository = $this->createMock(UserRepositoryInterface::class);
        $mockRepository->expects($this->once())
                      ->method('create')
                      ->willReturn(new User());
        
        $service = new UserService($mockRepository);
        $request = new CreateUserRequest();
        
        $result = $service->createUser($request);
        
        $this->assertInstanceOf(User::class, $result);
    }
}
```

## Security Best Practices

### Input Sanitization

```php
class UserController extends Controller
{
    public function store(CreateUserRequest $request): JsonResponse
    {
        // Request validation happens automatically
        $validatedData = $request->validated();
        
        // Additional sanitization if needed
        $validatedData['name'] = strip_tags($validatedData['name']);
        
        $user = $this->userService->createUser($validatedData);
        
        return response()->json(new UserResource($user), 201);
    }
}
```
## Rate Limiting

```php
// In routes/api.php
Route::middleware(['throttle:api'])->group(function () {
    Route::post('/users', [UserController::class, 'store']);
});
```

## Performance Optimization

### Caching Strategies

```php
class UserService
{
    public function getUserById(int $id): ?User
    {
        return Cache::remember(
            "user:{$id}",
            now()->addHours(1),
            fn() => $this->userRepository->findById($id)
        );
    }
}
```

## Queue Jobs for Heavy Operations

```php
class ProcessUserDataJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    
    public function __construct(private readonly User $user) {}
    
    public function handle(): void
    {
        // Heavy processing logic
    }
}
```

## Code Generation Rules

- Always use dependency injection instead of static calls or direct instantiation
- Implement interfaces for all repository and service classes
- Use Form Requests for validation instead of validating in controllers
- Create Resource classes for API responses
- Implement proper error handling with try-catch blocks and logging
- Use meaningful variable names that describe their purpose
- Follow PSR-12 coding standards for formatting
- Add type hints for all parameters and return types
- Use readonly properties where applicable (PHP 8.1+)
- Implement proper logging for debugging and monitoring

## File Organization

```
app/
├── Http/
│   ├── Controllers/
│   ├── Requests/
│   ├── Resources/
│   └── Middleware/
├── Services/
├── Repositories/
│   ├── Contracts/
│   └── Eloquent/
├── Models/
├── Events/
├── Listeners/
├── Jobs/
├── Factories/
└── Exceptions/
```

## Additional Guidelines

- Use Laravel's built-in features before creating custom solutions
- Prefer composition over inheritance
- Keep controllers thin - business logic belongs in services
- Use meaningful commit messages following conventional commits
- Document complex business logic with PHPDoc comments
- Use Laravel's validation rules instead of custom validation logic
- Implement proper API versioning for public APIs
- Use Laravel's localization features for multi-language support

Remember: Code should be readable, maintainable, and testable. When in doubt, favor simplicity and clarity over cleverness.
