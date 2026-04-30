<?php

namespace App\Services\Admin;

use App\Models\Pharmacy;
use App\Models\PharmacyOperatingHour;
use App\Models\PharmacyStaff;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PharmacyService
{
    public function list($filters)
    {
        return Pharmacy::query()
            ->select([
                'id', 'name', 'address', 'phone', 'latitude', 'longitude',
                'rating', 'total_reviews',
                'verification_status', 'is_active', 'is_force_closed', 'created_at'
            ])
            ->with([
                'legality',
                'staffs.user:id,username,avatar_url',
                'hours',
                'images' => fn($q) => $q->where('is_primary', true)
            ])
            ->withCount(['orders', 'medicines'])
            ->withCount([
                'orders as monthly_orders_count' => fn($q) => $q
                    ->whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year)
            ])
            ->search($filters['search'] ?? null)
            ->filterStatus($filters['status'] ?? null)
            ->latest()
            ->paginate(12);
    }

    public function store(array $data)
    {
        return DB::transaction(function () use ($data) {
            $pharmacy = Pharmacy::create([
                'name' => $data['name'],
                'address' => $data['address'],
                'phone' => $data['phone'],
                'latitude' => $data['latitude'],
                'longitude' => $data['longitude'],
                'verification_status' => $data['verification_status'],
                'is_active' => $data['is_active'] ?? true,
            ]);

            $pharmacy->legality()->create([
                'sia_number' => $data['sia_number'] ?? null,
            ]);

            // Default hours: Mon-Sun, 08:00 - 20:00 if not provided
            $hours = $data['hours'] ?? [];
            if (empty($hours)) {
                for ($i = 0; $i < 7; $i++) {
                    $hours[] = [
                        'day_of_week' => $i,
                        'open_time' => '08:00',
                        'close_time' => '20:00',
                        'is_closed' => false,
                        'is_24_hours' => false
                    ];
                }
            }

            $this->syncHours($pharmacy, $hours);
            $this->syncStaffs($pharmacy, $data['staffs'] ?? []);

            return $pharmacy;
        });
    }

    public function update(Pharmacy $pharmacy, array $data)
    {
        return DB::transaction(function () use ($pharmacy, $data) {
            $pharmacy->update([
                'name' => $data['name'],
                'address' => $data['address'],
                'phone' => $data['phone'],
                'latitude' => $data['latitude'],
                'longitude' => $data['longitude'],
                'verification_status' => $data['verification_status'],
                'is_active' => $data['is_active'] ?? true,
                'is_force_closed' => $data['is_force_closed'] ?? false,
            ]);

            $pharmacy->legality()->updateOrCreate(
                ['pharmacy_id' => $pharmacy->id],
                ['sia_number' => $data['sia_number'] ?? null]
            );

            $this->syncHours($pharmacy, $data['hours'] ?? []);
            $this->syncStaffs($pharmacy, $data['staffs'] ?? []);

            return $pharmacy;
        });
    }

    public function delete(Pharmacy $pharmacy)
    {
        return DB::transaction(function () use ($pharmacy) {
            // Soft delete will handle main record, but we might want to cleanup relationships
            // if they aren't soft deleted.
            $pharmacy->staffs()->delete();
            $pharmacy->hours()->delete();
            $pharmacy->images()->delete();
            return $pharmacy->delete();
        });
    }

    protected function syncHours(Pharmacy $pharmacy, array $hours)
    {
        foreach ($hours as $hour) {
            $pharmacy->hours()->updateOrCreate(
                ['day_of_week' => $hour['day_of_week']],
                [
                    'open_time' => $hour['open_time'],
                    'close_time' => $hour['close_time'],
                    'is_closed' => $hour['is_closed'] ?? false,
                    'is_24_hours' => $hour['is_24_hours'] ?? false,
                ]
            );
        }
    }

    protected function syncStaffs(Pharmacy $pharmacy, array $staffs)
    {
        $userIds = collect($staffs)->pluck('user_id')->toArray();
        
        // Remove staffs not in the new list
        $pharmacy->staffs()->whereNotIn('user_id', $userIds)->delete();

        foreach ($staffs as $staff) {
            $pharmacy->staffs()->updateOrCreate(
                ['user_id' => $staff['user_id']],
                [
                    'role' => $staff['role'],
                    'is_active' => true,
                ]
            );
        }
    }
}
