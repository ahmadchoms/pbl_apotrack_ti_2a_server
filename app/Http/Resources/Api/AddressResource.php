<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AddressResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'label' => $this->label,
            'complete_address' => $this->complete_address,
            'address_detail' => $this->address_detail,
            'latitude' => (float) $this->latitude,
            'longitude' => (float) $this->longitude,
            'is_primary' => (bool) $this->is_primary,
        ];
    }
}
