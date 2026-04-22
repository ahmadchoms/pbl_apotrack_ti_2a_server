<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pharmacy extends Model
{
    use HasUuids, SoftDeletes;

    protected $guarded = [];

    public function images()
    {
        return $this->hasMany(PharmacyImage::class);
    }

    public function staffs()
    {
        return $this->hasMany(PharmacyStaff::class);
    }

    public function hours()
    {
        return $this->hasMany(PharmacyOperatingHour::class);
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
}
