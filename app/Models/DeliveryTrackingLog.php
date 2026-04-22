<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class DeliveryTrackingLog extends Model
{
    use HasUuids;

    protected $guarded = [];

    public $timestamps = false;

    public function tracking()
    {
        return $this->belongsTo(DeliveryTracking::class, "delivery_tracking_id");
    }
}