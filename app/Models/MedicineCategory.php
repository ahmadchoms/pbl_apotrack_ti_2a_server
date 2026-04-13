<?php

namespace App\Models;

class MedicineCategory extends BaseModel
{
    public $timestamps = false;

    public function medicines()
    {
        return $this->hasMany(Medicine::class, 'category_id');
    }
}
