<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Order extends Model
{
    use HasUuids;

    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function pharmacy()
    {
        return $this->belongsTo(Pharmacy::class);
    }

    public function address()
    {
        return $this->belongsTo(UserAddress::class, "address_id");
    }

    public function prescription()
    {
        return $this->belongsTo(Prescription::class, "prescription_id");
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function tracking()
    {
        return $this->hasOne(DeliveryTracking::class);
    }

    public function paymentProof()
    {
        return $this->hasOne(PaymentProof::class);
    }

    public function review()
    {
        return $this->hasOne(Review::class);
    }

    // Local Scopes
    public function scopeForPharmacy($query, $pharmacyId)
    {
        return $query->where('pharmacy_id', $pharmacyId);
    }

    public function scopeFilterStatus($query, $status)
    {
        return $query->when($status && $status !== 'ALL', function ($q) use ($status) {
            $q->where('order_status', strtoupper($status));
        });
    }
}