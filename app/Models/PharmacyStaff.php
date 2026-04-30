<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class PharmacyStaff extends Model
{
    use HasUuids, \App\Models\Traits\HasStatusScope;

    protected $fillable = ['pharmacy_id', 'user_id', 'role', 'is_active'];

    protected $table = 'pharmacy_staffs';

    public function pharmacy()
    {
        return $this->belongsTo(Pharmacy::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Local Scopes
    public function scopeSearch($query, $search)
    {
        return $query->when($search, function ($q) use ($search) {
            $q->whereHas('user', function ($sq) use ($search) {
                $sq->where('username', 'ilike', "%{$search}%")
                  ->orWhere('email', 'ilike', "%{$search}%");
            });
        });
    }


}