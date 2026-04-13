<?php

namespace App\Models;

class UserAddress extends BaseModel
{
    public $timestamps = false;

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'address_id');
    }
}
