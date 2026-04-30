<?php

namespace App\Models\Traits;

trait HasStatusScope
{
    public function scopeFilterStatus($query, ?string $status, string $column = 'is_active')
    {
        return $query->when($status && $status !== 'all', function ($q) use ($status, $column) {
            $q->where($column, $status === 'active');
        });
    }
}
