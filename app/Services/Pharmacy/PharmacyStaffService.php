<?php

namespace App\Services\Pharmacy;

use App\Models\PharmacyStaff;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\URL;

class PharmacyStaffService
{
    public function list(string $pharmacyId, array $filters)
    {
        return PharmacyStaff::query()
            ->with(['user'])
            ->where('pharmacy_id', $pharmacyId)
            ->search($filters['search'] ?? null)
            ->filterStatus($filters['status'] ?? null)
            ->latest()
            ->paginate(10);
    }

    public function store(string $pharmacyId, array $data)
    {
        return DB::transaction(function () use ($pharmacyId, $data) {
            $user = User::create([
                'username' => $data['username'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'password_hash' => Hash::make($data['password']),
                'role' => 'PHARMACY_STAFF',
                'is_active' => $data['is_active'],
            ]);

            return PharmacyStaff::create([
                'pharmacy_id' => $pharmacyId,
                'user_id' => $user->id,
                'role' => $data['role'],
                'is_active' => $data['is_active'],
            ]);
        });
    }

    public function update(PharmacyStaff $staff, array $data)
    {
        return DB::transaction(function () use ($staff, $data) {
            $staff->user->update([
                'username' => $data['username'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'is_active' => $data['is_active'],
            ]);

            $staff->update([
                'role' => $data['role'],
                'is_active' => $data['is_active'],
            ]);

            return $staff;
        });
    }

    public function delete(PharmacyStaff $staff)
    {
        $staff->delete();
    }

    public function toggleStatus(PharmacyStaff $staff)
    {
        $newStatus = !$staff->is_active;

        return DB::transaction(function () use ($staff, $newStatus) {
            $staff->update(['is_active' => $newStatus]);
            $staff->user->update(['is_active' => $newStatus]);

            return $staff;
        });
    }

    public function getActivityLogs(string $pharmacyId)
    {
        $staffUserIds = PharmacyStaff::where('pharmacy_id', $pharmacyId)->pluck('user_id');

        return \App\Models\AuditLog::with('user')
            ->whereIn('user_id', $staffUserIds)
            ->latest()
            ->paginate(15);
    }

    /**
     * Generate signed URL + PIN 8 digit yang disimpan di cache selama 24 jam.
     * Mengembalikan array ['url' => ..., 'pin' => ...].
     */
    public function generateInvitationUrl(string $pharmacyId): array
    {
        $url = URL::temporarySignedRoute(
            'auth.register.staff',
            now()->addHours(24),
            ['pharmacy_id' => $pharmacyId]
        );

        $pin = null;
        for ($i = 0; $i < 10; $i++) {
            $candidate = strtoupper(substr(str_shuffle('ABCDEFGHJKLMNPQRSTUVWXYZ23456789'), 0, 8));
            if (!Cache::has("staff_pin:{$candidate}")) {
                $pin = $candidate;
                break;
            }
        }

        if ($pin === null) {
            $pin = strtoupper(substr(md5(uniqid($pharmacyId, true)), 0, 8));
        }

        Cache::put("staff_pin:{$pin}", $url, now()->addHours(24));

        return ['url' => $url, 'pin' => $pin];
    }

    /**
     * Lookup URL dari PIN yang diinput manual.
     * Return URL string atau null jika PIN tidak ditemukan / expired.
     */
    public function resolveInvitationPin(string $pin): ?string
    {
        $pin = strtoupper(trim($pin));
        return Cache::get("staff_pin:{$pin}");
    }
}
