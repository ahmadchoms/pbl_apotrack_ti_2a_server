<?php

namespace App\Http\Resources\Api;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    protected function computeCanReview(): bool
    {
        if (!$this->relationLoaded('items') || !$this->relationLoaded('reviews')) {
            return true;
        }

        $reviewedMedicineIds = $this->reviews
            ->pluck('medicine_id')
            ->filter()
            ->toArray();

        return $this->items->contains(function ($item) use ($reviewedMedicineIds) {
            return !in_array($item->medicine_id, $reviewedMedicineIds);
        });
    }

    public function toArray(Request $request): array
    {
        Carbon::setLocale('id');
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'pharmacy_id' => $this->pharmacy_id,
            'pharmacy' => $this->whenLoaded('pharmacy', fn() => [
                'id' => $this->pharmacy->id,
                'name' => $this->pharmacy->name,
                'address' => $this->pharmacy->address,
                'phone' => $this->pharmacy->phone,
                'logo_url' => $this->pharmacy->logo_url,
            ]),
            'service_type' => $this->service_type,
            'payment_method' => $this->payment_method,
            'order_status' => $this->order_status,
            'payment_status' => $this->payment_status,
            'grand_total' => (float) $this->grand_total,
            'subtotal_amount' => (float) $this->subtotal_amount,
            'shipping_cost' => (float) $this->shipping_cost,
            'notes' => $this->notes,
            'created_at' => $this->created_at?->translatedFormat('d M Y H:i'),
            'buyer' => $this->whenLoaded('user', fn() => [
                'id' => $this->user->id,
                'username' => $this->user->username,
                'email' => $this->user->email,
                'phone' => $this->user->phone,
            ]),
            'verification_code' => $this->verification_code,
            'prescription' => $this->whenLoaded('prescription'),
            'requires_prescription' => $this->relationLoaded('items') ? $this->items->contains('requires_prescription', true) : false,
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
            'tracking' => new DeliveryTrackingResource($this->whenLoaded('tracking')),
            'address' => new AddressResource($this->whenLoaded('address')),
            'status_logs' => $this->whenLoaded('statusLogs'),
            'can_review' => $this->computeCanReview(),
        ];
    }
}
