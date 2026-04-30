<?php

namespace App\Models\Traits;

trait HasSearchScope
{
    public function scopeSearch($query, ?string $search, array $columns = [])
    {
        $searchCols = empty($columns) && property_exists($this, 'searchColumns') 
            ? $this->searchColumns 
            : (empty($columns) ? ['name'] : $columns);

        return $query->when($search, function ($q) use ($search, $searchCols) {
            $q->where(function ($sq) use ($search, $searchCols) {
                foreach ($searchCols as $i => $col) {
                    $method = $i === 0 ? 'where' : 'orWhere';
                    $sq->$method($col, 'ilike', "%{$search}%");
                }
            });
        });
    }
}
