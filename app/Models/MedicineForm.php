<?php

namespace App\Models;

class MedicineForm extends BaseModel
{
    public $timestamps = false;

    public function medicines()
    {
        return $this->hasMany(Medicine::class, 'form_id');
    }
}
