<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{

    public function index(Request $request): Response
    {
        $perPage = (int) $request->input('per_page', 10);
        $search = trim((string) $request->input('search', ''));

        $query = User::select('id', 'name', 'email', 'username', 'first_name', 'last_name', 'is_active', 'role', 'created_at');

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('username', 'like', "%{$search}%");
            });
        }

        $users = $query
            ->orderByDesc('created_at')
            ->paginate($perPage)
            ->withQueryString()
            ->through(function (User $user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'username' => $user->username,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'is_active' => (bool) $user->is_active,
                    'role' => $user->role,
                    'created_at' => optional($user->created_at)->toISOString(),
                ];
            });

        return Inertia::render('users/index', [
            'users' => $users,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }
}
