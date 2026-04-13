<?php

namespace App\Models;

class PharmacyOperatingHour extends BaseModel
{
    public $timestamps = false;

    public function pharmacy()
    {
        return $this->belongsTo(Pharmacy::class);
    }
}
