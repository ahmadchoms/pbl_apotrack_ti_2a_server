<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DeliveryTrackingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'biteship_id' => $this->biteship_id,
            'courier_name' => $this->courier_name,
            'courier_code' => $this->courier_code,
            'courier_service' => $this->courier_service,
            'tracking_number' => $this->tracking_number,
            'tracking_url' => $this->tracking_url,
            'delivery_fee' => (float) $this->delivery_fee,
            'status' => $this->status,
            'logs' => $this->whenLoaded('logs'),
        ];
    }
}
