<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Review;
use App\Models\OrderItem;
use Illuminate\Auth\Access\HandlesAuthorization;

class ReviewPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can create a review for the medicine.
     */
    public function create(User $user, int $medicineId): bool
    {
        if ($user->role !== 'USER') {
            return false;
        }

        $completedOrdersWithMedicine = OrderItem::whereHas('order', function ($query) use ($user) {
            $query->where('user_id', $user->id)
                  ->where('order_status', 'COMPLETED');
        })
        ->where('medicine_id', $medicineId)
        ->pluck('order_id');

        if ($completedOrdersWithMedicine->isEmpty()) {
            return false;
        }

        $reviewedOrderIds = Review::whereIn('order_id', $completedOrdersWithMedicine)
            ->where('medicine_id', $medicineId)
            ->pluck('order_id');

        return $completedOrdersWithMedicine->diff($reviewedOrderIds)->isNotEmpty();
    }
}
