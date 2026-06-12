<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class DeliveryTracking extends Model
{
    use HasUuids;

    protected $guarded = [];

    protected $casts = [
        'courier'     => 'array',
        'origin'      => 'array',
        'destination' => 'array',
        'history'     => 'array',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function logs()
    {
        return $this->hasMany(DeliveryTrackingLog::class);
    }
}