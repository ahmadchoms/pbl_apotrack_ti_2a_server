<?php

namespace App\Services\Pharmacy;

use App\Models\PharmacyStaff;
use App\Models\User;
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
        return DB::transaction(function () use ($staff) {
            $user = $staff->user;
            $staff->delete();
            return $user->delete();
        });
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
        // Combine audit logs and stock movements for all staff in this pharmacy
        $staffUserIds = PharmacyStaff::where('pharmacy_id', $pharmacyId)->pluck('user_id');

        return \App\Models\AuditLog::with('user')
            ->whereIn('user_id', $staffUserIds)
            ->latest()
            ->paginate(15);
    }

    public function generateInvitationUrl(string $pharmacyId)
    {
        return URL::temporarySignedRoute(
            'auth.register.staff',
            now()->addHours(24),
            ['pharmacy_id' => $pharmacyId]
        );
    }
}
