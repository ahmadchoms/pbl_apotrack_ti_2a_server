<?php

namespace App\Models;

class Medicine extends BaseModel
{
    public function pharmacy()
    {
        return $this->belongsTo(Pharmacy::class);
    }

    public function category()
    {
        return $this->belongsTo(MedicineCategory::class);
    }

    public function form()
    {
        return $this->belongsTo(MedicineForm::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
