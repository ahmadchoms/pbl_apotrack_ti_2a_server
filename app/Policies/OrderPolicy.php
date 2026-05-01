<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class OrderPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->pharmacyStaff !== null;
    }

    public function view(User $user, Order $order): bool
    {
        return $user->pharmacyStaff && $order->pharmacy_id === $user->pharmacyStaff->pharmacy_id;
    }

    public function update(User $user, Order $order): bool
    {
        return $user->pharmacyStaff && $order->pharmacy_id === $user->pharmacyStaff->pharmacy_id;
    }
}
