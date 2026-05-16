<?php

namespace App\Models\Traits;

use Illuminate\Database\Eloquent\Concerns\HasUuids as EloquentHasUuids;

/**
 * Custom HasUuids trait yang membungkus HasUuids bawaan Laravel.
 * Digunakan agar seluruh Model menggunakan UUID sebagai primary key secara konsisten.
 */
trait HasUuids
{
    use EloquentHasUuids;
}
