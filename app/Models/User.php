<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;

class User extends BaseModel
{
    use HasFactory, HasApiTokens;

    protected $hidden = [
        'password_hash',
    ];

    public function addresses()
    {
        return $this->hasMany(UserAddress::class);
    }

    public function pharmacies()
    {
        return $this->hasMany(Pharmacy::class, 'admin_id');
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
