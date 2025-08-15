<?php

namespace App\Http\Requests;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
    $userParam = $this->route('user');
    $userId = is_object($userParam) ? $userParam->id : $userParam;

        return [
            'name' => 'required|string|max:255',
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => [
                'required','string','email','max:255',
                Rule::unique('users','email')->ignore($userId)
            ],
            'username' => [
                'nullable','string','max:255',
                Rule::unique('users','username')->ignore($userId)
            ],
            'password' => 'nullable|string|min:8|confirmed',
            'role' => ['required', Rule::enum(UserRole::class)],
            'is_active' => 'sometimes|boolean',
        ];
    }
}
