<?php

namespace App\Services\Api;

use App\Models\Pharmacy;
use Illuminate\Http\Request;

class PharmacyService
{
    /**
     * List active and verified pharmacies with selective columns and eager loading.
     */
    public function listActivePharmacies(array $filters)
    {
        $query = Pharmacy::query()
            ->select(['id', 'name', 'address', 'latitude', 'longitude', 'rating', 'verification_status', 'is_active'])
            ->with(['operatingHours' => function($q) {
                $q->select(['id', 'pharmacy_id', 'day_of_week', 'open_time', 'close_time', 'is_closed']);
            }])
            ->where('verification_status', 'VERIFIED')
            ->where('is_active', true);

        // Search by name
        if (isset($filters['search'])) {
            $query->where('name', 'ilike', '%' . $filters['search'] . '%');
        }

        // Distance Calculation
        if (isset($filters['latitude']) && isset($filters['longitude'])) {
            $lat = $filters['latitude'];
            $lng = $filters['longitude'];
            
            $query->selectRaw(
                "( 6371 * acos( cos( radians(?) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(?) ) + sin( radians(?) ) * sin( radians( latitude ) ) ) ) AS distance",
                [$lat, $lng, $lat]
            )->orderBy('distance');
        } else {
            $query->latest();
        }

        return $query->paginate($filters['per_page'] ?? 15);
    }

    /**
     * Get pharmacy detail with specific relationships.
     */
    public function getPharmacyDetail($id)
    {
        return Pharmacy::select(['id', 'name', 'address', 'phone', 'latitude', 'longitude', 'rating', 'total_reviews'])
            ->with([
                'images:id,pharmacy_id,image_url,is_primary',
                'operatingHours',
                'legality:id,pharmacy_id,sia_number'
            ])
            ->where('verification_status', 'VERIFIED')
            ->findOrFail($id);
    }
}
