<?php

namespace App\Http\Controllers\Auth\Concerns;

use Illuminate\Http\RedirectResponse;
use Illuminate\Foundation\Auth\User;
use App\Enums\UserRole;

trait HasRoleBasedRedirect
{
    /**
     * Redirect user based on their role.
     */
    protected function roleBasedRedirect(?User $user = null, string $queryString = ''): RedirectResponse
    {
        $redirectUser = $user ?? auth()->user();
        
        // Default to USER role if no role is set or user is null
        $userRole = $redirectUser?->role ?? UserRole::USER;
        
        if ($userRole === UserRole::USER) {
            $route = route('home', absolute: false);
        } else {
            $route = route('dashboard', absolute: false);
        }
        
        if ($queryString) {
            $route .= $queryString;
        }
        
        return redirect()->intended($route);
    }
}
