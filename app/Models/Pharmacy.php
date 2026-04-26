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

    // Local Scopes
    public function scopeSearch($query, $search)
    {
        return $query->when($search, function ($q) use ($search) {
            $q->where(function ($sq) use ($search) {
                $sq->where('name', 'ilike', "%{$search}%")
                  ->orWhere('address', 'ilike', "%{$search}%")
                  ->orWhere('phone', 'ilike', "%{$search}%");
            });
        });
    }

    public function scopeFilterStatus($query, $status)
    {
        return $query->when($status && $status !== 'all', function ($q) use ($status) {
            match ($status) {
                'verified' => $q->where('verification_status', 'VERIFIED'),
                'pending' => $q->where('verification_status', 'PENDING'),
                'rejected' => $q->where('verification_status', 'REJECTED'),
                'active' => $q->where('is_active', true)->where('is_force_closed', false),
                'closed' => $q->where(fn($sq) => $sq->where('is_active', false)->orWhere('is_force_closed', true)),
                default => null,
            };
        });
    }
}
