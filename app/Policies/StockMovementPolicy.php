<?php

namespace App\Policies;

use App\Models\StockMovement;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class StockMovementPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->pharmacyStaff !== null;
    }

    public function view(User $user, StockMovement $movement): bool
    {
        // StockMovement relates to Medicine, which relates to Pharmacy
        return $user->pharmacyStaff && 
               $movement->medicine && 
               $movement->medicine->pharmacy_id === $user->pharmacyStaff->pharmacy_id;
    }

    public function create(User $user): bool
    {
        return $user->pharmacyStaff !== null;
    }
}
