<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class MedicineForm extends Model
{
    use HasUuids;

    protected $guarded = [];

    public $timestamps = false;

    public function medicines()
    {
        return $this->hasMany(Medicine::class, "form_id");
    }
}