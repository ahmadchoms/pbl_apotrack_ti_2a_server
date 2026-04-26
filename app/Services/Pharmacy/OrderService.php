<?php

namespace App\Services\Pharmacy;

use App\Models\Order;
use App\Models\Pharmacy;

class OrderService
{
    public function list(string $pharmacyId, array $filters)
    {
        return Order::query()
            ->with(['user:id,username,email,phone'])
            ->forPharmacy($pharmacyId)
            ->filterStatus($filters['status'] ?? 'ALL')
            ->orderBy('created_at', 'desc')
            ->paginate(20);
    }

    public function getOrderDetail(string $orderId)
    {
        return Order::with([
            'user:id,username,email,phone',
            'prescription',
            'items',
            'tracking'
        ])->findOrFail($orderId);
    }

    public function getPendingCount(string $pharmacyId)
    {
        return Order::where('pharmacy_id', $pharmacyId)
            ->where('order_status', 'PENDING')
            ->count();
    }
}
