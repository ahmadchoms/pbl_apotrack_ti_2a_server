<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $role = $this->role;
        if ($this->role === 'USER' && $this->pharmacyStaff) {
            $role = $this->pharmacyStaff->role;
        }

        return [
            'id' => $this->id,
            'username' => $this->username,
            'email' => $this->email,
            'phone' => $this->phone,
            'role' => $role,
            'is_active' => $this->is_active,
            'avatar_url' => $this->avatar_url,
            'pharmacy_name' => $this->pharmacyStaff?->pharmacy?->name,
            'pharmacy_id' => $this->pharmacyStaff?->pharmacy_id,
            'created_at' => $this->created_at?->format('d M Y'),
        ];
    }
}
