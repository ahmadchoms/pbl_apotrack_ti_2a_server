<?php

namespace App\Models;

class Notification extends BaseModel
{
    const UPDATED_AT = null;

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
