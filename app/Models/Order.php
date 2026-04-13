<?php

namespace App\Models;

use App\Enums\OrderStatus;

class Order extends BaseModel
{
    protected $casts = [
        'order_status' => OrderStatus::class,
        'paid_at'      => 'datetime',
        'expired_at'   => 'datetime',
    ];

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
        return $this->belongsTo(UserAddress::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function review()
    {
        return $this->hasOne(Review::class);
    }
}
