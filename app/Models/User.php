<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasUuids, Notifiable, SoftDeletes;

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

    // Local Scopes
    public function scopeSearch($query, $search)
    {
        return $query->when($search, function ($q) use ($search) {
            $q->where(function ($sq) use ($search) {
                $sq->where('username', 'ilike', "%{$search}%")
                  ->orWhere('email', 'ilike', "%{$search}%")
                  ->orWhereHas('pharmacyStaff.pharmacy', function($pq) use ($search) {
                      $pq->where('name', 'ilike', "%{$search}%");
                  });
            });
        });
    }

    public function scopeFilterRole($query, $role)
    {
        return $query->when($role && $role !== 'all', function ($q) use ($role) {
            $q->where('role', $role);
        });
    }

    public function scopeFilterStatus($query, $status)
    {
        return $query->when($status && $status !== 'all', function ($q) use ($status) {
            $q->where('is_active', $status === 'active');
        });
    }
}
