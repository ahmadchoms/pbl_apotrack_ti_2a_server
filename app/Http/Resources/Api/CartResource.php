<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this['id'] ?? null,
            'pharmacy_id' => $this['pharmacy_id'] ?? null,
            'total_price' => $this['total_price'] ?? 0,
            'items' => CartItemResource::collection($this['items'] ?? []),
        ];
    }
}
