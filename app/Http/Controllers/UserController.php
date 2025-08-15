<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function __construct(
        private readonly User $user
    ) {}

    public function index(Request $request): Response
    {
        $users = User::select('id', 'name', 'email', 'username', 'first_name', 'last_name', 'is_active', 'role', 'created_at')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'username' => $user->username,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'is_active' => $user->is_active,
                    'role' => $user->role,
                    'created_at' => $user->created_at,
                    'avatar' => "https://ui-avatars.com/api/?name=" . urlencode($user->name) . "&background=random"
                ];
            });

        return Inertia::render('users/index', [
            'users' => $users
        ]);
    }
}
