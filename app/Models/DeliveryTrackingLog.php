<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class DeliveryTrackingLog extends Model
{
    use HasFactory, HasUuids;
    
    public $timestamps = false;

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->created_at = $model->created_at ?? now();
        });
    }

    protected $fillable = [
        'delivery_tracking_id',
        'status',
        'description',
        'latitude',
        'longitude'
    ];

    public function deliveryTracking()
    {
        return $this->belongsTo(DeliveryTracking::class);
    }
}
