<?php

namespace App\Models;

class OrderItem extends BaseModel
{
    public $timestamps = false;

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function medicine()
    {
        return $this->belongsTo(Medicine::class);
    }
}
