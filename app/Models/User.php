<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasUuids, Notifiable, SoftDeletes, \App\Models\Traits\HasSearchScope, \App\Models\Traits\HasStatusScope;

    protected $fillable = ['username', 'phone', 'email', 'password_hash', 'role', 'avatar_url', 'is_active'];

    protected array $searchColumns = ['username', 'email'];

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

    public function scopeFilterRole($query, $role)
    {
        return $query->when($role && $role !== 'all', function ($q) use ($role) {
            if ($role === 'APOTEKER' || $role === 'STAFF') {
                $q->whereHas('pharmacyStaff', function ($sq) use ($role) {
                    $sq->where('role', $role);
                });
            } else {
                $q->where('role', $role);
            }
        });
    }
}
