<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Pharmacy\MedicineResource;

class OrderItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'medicine_id' => $this->medicine_id,
            'medicine_name' => $this->medicine_name,
            'quantity' => $this->quantity,
            'price' => (float) $this->price,
            'subtotal' => (float) ($this->quantity * $this->price),
            'medicine' => new MedicineResource($this->whenLoaded('medicine')),
        ];
    }
}
