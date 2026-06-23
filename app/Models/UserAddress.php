<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class UserAddress extends Model
{
    use HasUuids;

    protected $guarded = [];

    protected $appends = ['complete_address'];

    protected function casts(): array
    {
        return [
            'is_primary' => 'boolean',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class, "address_id");
    }

    public function getCompleteAddressAttribute()
    {
        return $this->address_detail;
    }
}