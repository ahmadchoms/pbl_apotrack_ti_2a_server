<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class PharmacyOperatingHour extends Model
{
    use HasUuids;

    protected $guarded = [];

    public $timestamps = false;

    public function pharmacy()
    {
        return $this->belongsTo(Pharmacy::class);
    }
}