<?php

namespace App\Policies;

use App\Models\PharmacyStaff;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PharmacyStaffPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->pharmacyStaff !== null;
    }

    public function view(User $user, PharmacyStaff $staff): bool
    {
        return $user->pharmacyStaff && $staff->pharmacy_id === $user->pharmacyStaff->pharmacy_id;
    }

    public function update(User $user, PharmacyStaff $staff): bool
    {
        // Only APOTEKER can update staff status usually, or check pharmacy_id
        return $user->pharmacyStaff && 
               $staff->pharmacy_id === $user->pharmacyStaff->pharmacy_id &&
               $user->pharmacyStaff->role === 'APOTEKER';
    }

    public function toggleStatus(User $user, PharmacyStaff $staff): bool
    {
        return $user->pharmacyStaff && 
               $staff->pharmacy_id === $user->pharmacyStaff->pharmacy_id &&
               $user->pharmacyStaff->role === 'APOTEKER';
    }
}
