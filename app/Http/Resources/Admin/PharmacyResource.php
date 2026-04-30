<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PharmacyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'address' => $this->address,
            'phone' => $this->phone,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'rating' => $this->rating,
            'total_reviews' => $this->total_reviews,
            'legality' => $this->whenLoaded('legality'),
            'verification_status' => $this->verification_status,
            'is_active' => $this->is_active,
            'is_force_closed' => $this->is_force_closed,
            'created_at' => $this->created_at->format('d M Y'),
            'orders_count' => $this->orders_count,
            'medicines_count' => $this->medicines_count,
            'primary_image' => $this->images->first()?->image_url,
            'staffs' => $this->staffs->map(fn($staff) => [
                'id' => $staff->id,
                'role' => $staff->role,
                'username' => $staff->user->username,
                'avatar_url' => $staff->user->avatar_url,
            ]),
            'operating_hours' => $this->hours->map(fn($hour) => [
                'day' => $hour->day_of_week,
                'open' => $hour->open_time,
                'close' => $hour->close_time,
                'is_closed' => $hour->is_closed,
                'is_24_hours' => $hour->is_24_hours,
            ]),
        ];
    }
}
