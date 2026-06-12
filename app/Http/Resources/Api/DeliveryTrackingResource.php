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
            'biteship_order_id' => $this->biteship_order_id,
            'biteship_tracking_id' => $this->biteship_tracking_id,
            'courier' => $this->courier,
            'origin' => $this->origin,
            'destination' => $this->destination,
            'tracking_number' => $this->tracking_number,
            'tracking_link' => $this->tracking_link,
            'delivery_fee' => (float) $this->delivery_fee,
            'status' => match (strtolower($this->status)) {
                'pickingup' => 'picking_up',
                'droppingoff' => 'dropping_off',
                'intransit' => 'dropping_off',
                'in_transit' => 'dropping_off',
                default => strtolower($this->status),
            },
            'history' => $this->history,
        ];
    }
}
