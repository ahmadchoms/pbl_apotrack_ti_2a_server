<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class OrderPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the staff can view any orders.
     */
    public function viewAnyStaff(User $user): bool
    {
        return $user->pharmacyStaff !== null && $user->pharmacyStaff->is_active;
    }

    /**
     * Determine whether the staff can view the specific order.
     */
    public function viewStaff(User $user, Order $order): bool
    {
        return $user->pharmacyStaff && $user->pharmacyStaff->is_active && $order->pharmacy_id === $user->pharmacyStaff->pharmacy_id;
    }

    /**
     * Determine whether the staff can update the specific order.
     */
    public function updateStaff(User $user, Order $order): bool
    {
        return $user->pharmacyStaff && $user->pharmacyStaff->is_active && $order->pharmacy_id === $user->pharmacyStaff->pharmacy_id;
    }

    /**
     * Determine whether the customer can view their own order.
     */
    public function viewCustomer(User $user, Order $order): bool
    {
        return $user->id === $order->user_id;
    }

    /**
     * Determine whether the customer can update/upload prescription or simulate payment for their own order.
     */
    public function updateCustomer(User $user, Order $order): bool
    {
        return $user->id === $order->user_id;
    }
}
