<?php

namespace App\Http\Resources\Pharmacy;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'service_type' => $this->service_type,
            'payment_method' => $this->payment_method,
            'order_status' => $this->order_status,
            'payment_status' => $this->payment_status,
            'grand_total' => (float)$this->grand_total,
            'notes' => $this->notes,
            'created_at' => $this->created_at?->format('d M Y H:i'),
            'buyer' => [
                'id' => $this->user->id,
                'username' => $this->user->username,
                'email' => $this->user->email,
                'phone' => $this->user->phone,
            ],
            'prescription' => $this->whenLoaded('prescription'),
            'items' => $this->whenLoaded('items'),
            'tracking' => $this->whenLoaded('tracking'),
        ];
    }
}
