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
            'biteship_order_id' => $this->biteship_id,
            'biteship_tracking_id' => $this->biteship_id,
            'courier' => [
                'company' => $this->courier_service ?? $this->courier_code,
                'driver_name' => $this->courier_name,
                'driver_phone' => null,
                'driver_photo_url' => null,
                'driver_plate_number' => null,
            ],
            'origin' => null,
            'destination' => null,
            'tracking_number' => $this->tracking_number,
            'tracking_link' => $this->tracking_url,
            'delivery_fee' => (float) $this->delivery_fee,
            'status' => match (strtolower($this->status)) {
                'pickingup' => 'picking_up',
                'droppingoff' => 'dropping_off',
                'intransit' => 'dropping_off',
                default => strtolower($this->status),
            },
            'history' => $this->whenLoaded('logs'),
        ];
    }
}
