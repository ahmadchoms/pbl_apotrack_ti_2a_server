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
                'id',
                'name',
                'address',
                'phone',
                'latitude',
                'longitude',
                'rating',
                'total_reviews',
                'verification_status',
                'is_active',
                'is_force_closed',
                'created_at'
            ])
            ->with([
                'legality',
                'staffs.user:id,username,avatar_url',
                'operatingHours',
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
            $hours = $data['operatingHours'] ?? [];
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

            $this->syncHours($pharmacy, $data['operatingHours'] ?? []);
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
            $pharmacy->operatingHours()->delete();
            return $pharmacy->delete();
        });
    }

    public function getDetail(string $id)
    {
        return Pharmacy::with([
            'legality',
            'staffs.user',
            'operatingHours',
        ])
            ->withCount([
                'orders as completed_orders_count' => fn($q) => $q->where('order_status', 'COMPLETED')
            ])
            ->withSum([
                'orders as total_revenue' => fn($q) => $q->where('order_status', 'COMPLETED')
            ], 'grand_total')
            ->findOrFail($id);
    }

    public function verifyLegality(Pharmacy $pharmacy, string $status, ?string $note = null)
    {
        return DB::transaction(function () use ($pharmacy, $status, $note) {
            $pharmacy->update([
                'verification_status' => $status === 'APPROVED' ? 'VERIFIED' : 'REJECTED'
            ]);

            // Assuming there's a way to record the verification note in legality or a separate table
            // For now, let's just log it in AuditLog
            \App\Models\AuditLog::create([
                'user_id' => auth()->id(),
                'action' => 'VERIFY_PHARMACY_LEGALITY',
                'description' => "Verified legality for {$pharmacy->name} as {$status}. Note: " . ($note ?? '-'),
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent()
            ]);

            return $pharmacy;
        });
    }

    public function toggleSuspend(Pharmacy $pharmacy)
    {
        return DB::transaction(function () use ($pharmacy) {
            $newStatus = $pharmacy->verification_status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
            $pharmacy->update(['verification_status' => $newStatus]);

            \App\Models\AuditLog::create([
                'user_id' => auth()->id(),
                'action' => 'TOGGLE_PHARMACY_SUSPENSION',
                'description' => "Changed status for {$pharmacy->name} to {$newStatus}",
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent()
            ]);

            return $pharmacy;
        });
    }

    protected function syncHours(Pharmacy $pharmacy, array $hours)
    {
        foreach ($hours as $hour) {
            $pharmacy->operatingHours()->updateOrCreate(
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
