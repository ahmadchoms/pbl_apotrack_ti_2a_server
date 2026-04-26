<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PharmacyDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $pharmacist = $this->staffs->where('role', 'APOTEKER')->first();
        $monthlyOrders = $this->orders()
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        return [
            'id' => $this->id,
            'name' => $this->name,
            'address' => $this->address,
            'phone' => $this->phone,
            'license_number' => $this->license_number,
            'verification_status' => $this->verification_status,
            'rating' => $this->rating,
            'total_reviews' => $this->total_reviews,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at->format('d M Y'),
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'pharmacist' => $pharmacist ? [
                'name' => $pharmacist->user->username,
                'avatar' => $pharmacist->user->avatar_url,
                'phone' => $pharmacist->user->phone,
                'sipa' => '1992/0812/2023', // This could be a field in user/staff table
            ] : null,
            'staffs' => $this->staffs->map(fn($staff) => [
                'id' => $staff->id,
                'username' => $staff->user->username,
                'email' => $staff->user->email,
                'avatar' => $staff->user->avatar_url,
                'role' => $staff->role,
            ]),
            'stats' => [
                'joined_at' => $this->created_at->format('d M Y'),
                'total_orders' => $monthlyOrders,
            ]
        ];
    }
}
