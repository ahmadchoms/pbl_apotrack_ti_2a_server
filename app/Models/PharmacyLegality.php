<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PharmacyLegality extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'pharmacy_id',
        'sia_number',
        'sipa_number',
        'stra_number',
        'apoteker_nik',
        'sia_document_url',
    ];

    public function pharmacy(): BelongsTo
    {
        return $this->belongsTo(Pharmacy::class);
    }
}
