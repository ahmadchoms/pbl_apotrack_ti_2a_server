<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasUuids, Notifiable, SoftDeletes;

    protected $guarded = [];

    protected $hidden = [
        'password_hash',
    ];

    public function getAuthPassword()
    {
        return $this->password_hash;
    }

    public function refreshTokens()
    {
        return $this->hasMany(RefreshToken::class);
    }

    public function addresses()
    {
        return $this->hasMany(UserAddress::class);
    }

    public function pharmacyStaff()
    {
        return $this->hasOne(PharmacyStaff::class);
    }

    public function prescriptions()
    {
        return $this->hasMany(Prescription::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class);
    }
}
