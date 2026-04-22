<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class MedicineImage extends Model
{
    use HasUuids;

    protected $guarded = [];

    public $timestamps = false;

    public function medicine()
    {
        return $this->belongsTo(Medicine::class);
    }
}