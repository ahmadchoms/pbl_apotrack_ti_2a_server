<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;

class MedicineBatch extends Model
{
    use HasUuids, SoftDeletes;

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