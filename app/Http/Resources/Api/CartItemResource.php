<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Pharmacy\MedicineResource;

class CartItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this['id'] ?? $this->id,
            'medicine_id' => $this['medicine_id'] ?? $this->medicine_id,
            'quantity' => $this['quantity'] ?? $this->quantity,
            'subtotal' => $this['subtotal'] ?? ($this['quantity'] * (($this['medicine']['price'] ?? 0))),
            'medicine' => new MedicineResource($this['medicine'] ?? $this->medicine),
        ];
    }
}
