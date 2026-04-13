<?php

namespace App\Models;

class Pharmacy extends BaseModel
{
    const UPDATED_AT = null;

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    public function medicines()
    {
        return $this->hasMany(Medicine::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function operatingHours()
    {
        return $this->hasMany(PharmacyOperatingHour::class);
    }
}
