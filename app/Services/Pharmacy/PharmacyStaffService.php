<?php

namespace App\Services\Pharmacy;

use App\Models\PharmacyStaff;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

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
}
