<?php

namespace App\Policies;

use App\Models\Medicine;
use App\Models\User;

class MedicinePolicy
{
    /**
     * Determine whether the user can view the medicine.
     */
    public function view(User $user, Medicine $medicine): bool
    {
        return $user->pharmacyStaff?->pharmacy_id === $medicine->pharmacy_id;
    }

    /**
     * Determine whether the user can update the medicine.
     */
    public function update(User $user, Medicine $medicine): bool
    {
        return $user->pharmacyStaff?->pharmacy_id === $medicine->pharmacy_id;
    }

    /**
     * Determine whether the user can delete the medicine.
     */
    public function delete(User $user, Medicine $medicine): bool
    {
        return $user->pharmacyStaff?->pharmacy_id === $medicine->pharmacy_id;
    }
}
