<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;

class Medicine extends Model
{
    use HasUuids, SoftDeletes;

    protected $guarded = [];

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

    public function type()
    {
        return $this->belongsTo(MedicineType::class);
    }

    public function unit()
    {
        return $this->belongsTo(MedicineUnit::class);
    }

    public function images()
    {
        return $this->hasMany(MedicineImage::class);
    }

    public function batches()
    {
        return $this->hasMany(MedicineBatch::class);
    }

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }
}
