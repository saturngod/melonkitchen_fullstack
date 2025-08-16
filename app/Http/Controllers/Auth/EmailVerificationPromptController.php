<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Auth\Concerns\HasRoleBasedRedirect;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationPromptController extends Controller
{
    use HasRoleBasedRedirect;
    /**
     * Show the email verification prompt page.
     */
    public function __invoke(Request $request): Response|RedirectResponse
    {
        return $request->user()->hasVerifiedEmail()
                    ? $this->roleBasedRedirect($request->user())
                    : Inertia::render('auth/verify-email', ['status' => $request->session()->get('status')]);
    }
}
