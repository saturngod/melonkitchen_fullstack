<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'username' => $this->username,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'avatar_url' => $this->avatar_url,
            'is_active' => $this->is_active,
            'role' => $this->role,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            
            // Provide avatar field for frontend compatibility
            'avatar' => $this->avatar_url ?? $this->generateDefaultAvatar(),
        ];
    }

    /**
     * Generate a default avatar URL or placeholder.
     */
    private function generateDefaultAvatar(): string
    {
        // You can customize this to use a service like Gravatar, 
        // generate initials-based avatars, or return a default image
        $initials = $this->getInitials();
        return "https://ui-avatars.com/api/?name={$initials}&background=random";
    }

    /**
     * Get user initials for avatar generation.
     */
    private function getInitials(): string
    {
        $firstName = $this->first_name ?? '';
        $lastName = $this->last_name ?? '';
        
        if ($firstName && $lastName) {
            return urlencode($firstName[0] . $lastName[0]);
        }
        
        if ($this->name) {
            $nameParts = explode(' ', $this->name);
            if (count($nameParts) >= 2) {
                return urlencode($nameParts[0][0] . $nameParts[1][0]);
            }
            return urlencode(substr($this->name, 0, 2));
        }
        
        return urlencode(substr($this->email, 0, 2));
    }
}
