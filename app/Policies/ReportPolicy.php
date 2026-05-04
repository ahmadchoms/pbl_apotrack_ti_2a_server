<?php

namespace App\Policies;

use App\Models\User;

class ReportPolicy
{
    public function viewAny(User $user): bool
    {
        // Check if user is a pharmacy staff (either by direct role or by linkage)
        $staff = $user->pharmacyStaff;
        if (!$staff) return false;

        $role = $user->role === 'USER' ? $staff->role : $user->role;
        
        return in_array($role, ['APOTEKER', 'STAFF']);
    }
}
