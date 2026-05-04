<?php

namespace App\Services\Api;

use App\Models\Medicine;
use Illuminate\Database\Eloquent\Builder;

class MedicineService
{
    /**
     * List medicines with strict optimization rules.
     */
    public function listMedicines(array $filters)
    {
        $query = Medicine::query()
            ->select([
                'id', 'pharmacy_id', 'category_id', 'form_id', 'name', 
                'generic_name', 'price', 'image_url', 'requires_prescription'
            ])
            ->with([
                'category:id,name',
                'form:id,name',
                'pharmacy:id,name'
            ])
            ->withTotalActiveStock() // Custom scope
            ->where('is_active', true);

        // Filters
        $query->when($filters['search'] ?? null, function (Builder $q, $search) {
            $q->where('name', 'ilike', "%{$search}%")
              ->orWhere('generic_name', 'ilike', "%{$search}%");
        });

        $query->when($filters['category_id'] ?? null, function (Builder $q, $catId) {
            $q->where('category_id', $catId);
        });

        $query->when($filters['pharmacy_id'] ?? null, function (Builder $q, $pharId) {
            $q->where('pharmacy_id', $pharId);
        });

        return $query->latest()->paginate($filters['per_page'] ?? 15);
    }

    /**
     * Get medicine detail.
     */
    public function getMedicineDetail($id)
    {
        return Medicine::with([
                'category:id,name',
                'form:id,name',
                'type:id,name',
                'unit:id,name',
                'pharmacy:id,name,address'
            ])
            ->withTotalActiveStock()
            ->findOrFail($id);
    }
}
