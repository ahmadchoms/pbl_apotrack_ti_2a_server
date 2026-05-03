<?php

namespace App\Policies;

use App\Models\Pharmacy;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PharmacyPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->role === 'SUPER_ADMIN';
    }

    public function view(User $user, Pharmacy $pharmacy): bool
    {
        if ($user->role === 'SUPER_ADMIN') return true;
        return $user->pharmacyStaff && $user->pharmacyStaff->pharmacy_id === $pharmacy->id;
    }

    public function create(User $user): bool
    {
        return $user->role === 'SUPER_ADMIN';
    }

    public function update(User $user, Pharmacy $pharmacy): bool
    {
        if ($user->role === 'SUPER_ADMIN') return true;
        return $user->pharmacyStaff && $user->pharmacyStaff->pharmacy_id === $pharmacy->id;
    }

    public function delete(User $user, Pharmacy $pharmacy): bool
    {
        return $user->role === 'SUPER_ADMIN';
    }

    public function restore(User $user, Pharmacy $pharmacy): bool
    {
        return $user->role === 'SUPER_ADMIN';
    }

    public function forceDelete(User $user, Pharmacy $pharmacy): bool
    {
        return $user->role === 'SUPER_ADMIN';
    }
}
