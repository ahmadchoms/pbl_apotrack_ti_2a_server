<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class MedicineBatch extends Model
{
    use HasUuids;

    protected $guarded = [];

    public function medicine()
    {
        return $this->belongsTo(Medicine::class);
    }

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class, "batch_id");
    }
}