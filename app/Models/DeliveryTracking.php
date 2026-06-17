<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class DeliveryTracking extends Model
{
    use HasUuids;

    protected $fillable = [
        'order_id',
        'biteship_order_id',
        'biteship_tracking_id',
        'tracking_number',
        'tracking_link',
        'status',
        'delivery_fee',
        'courier',
        'origin',
        'destination',
        'history',
    ];

    protected $casts = [
        'courier'      => 'array',
        'origin'       => 'array',
        'destination'  => 'array',
        'history'      => 'collection',
        'delivery_fee' => 'decimal:2',
    ];

    // protected $casts = [
    //     'courier'     => 'array',
    //     'origin'      => 'array',
    //     'destination' => 'array',
    //     'history'     => 'array',
    // ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function appendHistory(string $status, string $note, string $serviceType = '-'): void
    {
        $history = $this->history ?? collect();
        $this->update([
            'history' => $history->push([
                'status'       => $status,
                'note'         => $note,
                'service_type' => $serviceType,
                'updated_at'   => now()->toIso8601String(),
            ])->toArray()
        ]);
    }

    public function latestHistoryStatus(): ?string
    {
        return $this->history?->last()['status'] ?? null;
    }

    public function isDelivered(): bool
    {
        return $this->history?->where('status', 'delivered')->isNotEmpty() ?? false;
    }
}