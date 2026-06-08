<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DeliveryTrackingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                   => $this->id,
            'biteship_order_id'    => $this->biteship_order_id,
            'biteship_tracking_id' => $this->biteship_tracking_id,
            'tracking_number'      => $this->tracking_number,
            'tracking_link'        => $this->tracking_link,
            'status'               => $this->status,
            'delivery_fee'         => (float) $this->delivery_fee,
            'courier'              => $this->courier,
            'origin'               => $this->origin,
            'destination'          => $this->destination,
            'history'              => $this->history,
        ];
    }
}