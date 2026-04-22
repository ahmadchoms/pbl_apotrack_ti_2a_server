<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class PaymentProof extends Model
{
    use HasUuids;

    protected $guarded = [];

    public $timestamps = false;

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function verifier()
    {
        return $this->belongsTo(User::class, "verified_by");
    }
}