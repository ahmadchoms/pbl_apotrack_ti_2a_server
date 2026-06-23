<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Review;
use App\Models\Order;
use Illuminate\Auth\Access\HandlesAuthorization;

class ReviewPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can create a review for the order.
     */
    public function create(User $user, string $orderId): bool
    {
        if ($user->role !== 'USER') {
            return false;
        }

        $order = Order::where('id', $orderId)
            ->where('user_id', $user->id)
            ->where('order_status', 'COMPLETED')
            ->first();

        if (!$order) {
            return false;
        }

        // Pastikan pesanan ini belum pernah diulas
        $exists = Review::where('order_id', $orderId)->exists();

        return !$exists;
    }
}
