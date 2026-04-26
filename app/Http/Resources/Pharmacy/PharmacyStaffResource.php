<?php

namespace App\Http\Resources\Pharmacy;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PharmacyStaffResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'role' => $this->role,
            'is_active' => $this->is_active,
            'user' => [
                'id' => $this->user->id,
                'username' => $this->user->username,
                'email' => $this->user->email,
                'phone' => $this->user->phone,
                'avatar_url' => $this->user->avatar_url,
            ],
            'created_at' => $this->created_at?->format('d M Y'),
        ];
    }
}
