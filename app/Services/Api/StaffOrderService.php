<?php

namespace App\Services\Api;

use App\Models\Order;
use App\Models\User;
use App\Enums\OrderStatus;
use App\Services\Pharmacy\OrderService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class StaffOrderService
{
    public function __construct(
        protected OrderService $orderService,
    ) {}

    /**
     * Get paginated orders for a staff's pharmacy.
     */
    public function listOrders(User $user, array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        $staff = $user->pharmacyStaff;

        if (!$staff) {
            throw new \Exception('Anda tidak terdaftar sebagai staf apotek mana pun.', 403);
        }

        $query = Order::with(['items.medicine', 'user'])
            ->where('pharmacy_id', $staff->pharmacy_id);

        if (!empty($filters['status'])) {
            $query->where('order_status', $filters['status']);
        }

        return $query->latest()->paginate($perPage);
    }

    /**
     * Get specific order details for staff.
     */
    public function showOrder(User $user, string $id): Order
    {
        $staff = $user->pharmacyStaff;

        return Order::with(['items.medicine', 'user', 'prescription'])
            ->where('pharmacy_id', $staff->pharmacy_id)
            ->findOrFail($id);
    }

    /**
     * Verify order by verification code and complete it.
     * For CASH orders, automatically marks payment as PAID.
     */
    public function verifyOrder(User $user, string $code): Order
    {
        $staff = $user->pharmacyStaff;

        $order = Order::where('pharmacy_id', $staff->pharmacy_id)
            ->where('verification_code', $code)
            ->first();

        if (!$order) {
            throw new \Exception(
                'Kode verifikasi tidak valid atau pesanan tidak ditemukan di apotek ini.',
                404
            );
        }

        DB::transaction(function () use ($order) {
            $this->orderService->updateStatus(
                $order->id,
                OrderStatus::COMPLETED,
                'Pesanan diambil oleh customer (verifikasi kode pickup).',
                'STAFF'
            );
        });

        return $order->fresh()->load(['items', 'user']);
    }

    /**
     * Create a new POS order.
     */
    public function storePOS(User $user, array $data): Order
    {
        $staff = $user->pharmacyStaff;
        return $this->orderService->createPOSOrder($staff->pharmacy_id, $data);
    }

    /**
     * Update order status.
     */
    public function updateStatus(User $user, string $id, string $status, ?string $note): Order
    {
        $staff = $user->pharmacyStaff;
        $order = Order::where('pharmacy_id', $staff->pharmacy_id)->findOrFail($id);

        $orderStatus = OrderStatus::tryFrom($status) ?? throw new \InvalidArgumentException("Status operasi '{$status}' tidak dikenali oleh sistem.");
        return $this->orderService->updateStatus($order->id, $orderStatus, $note, 'STAFF');
    }

    public function approveCancellation(User $user, string $id): Order
    {
        $staff = $user->pharmacyStaff;

        return DB::transaction(function () use ($staff, $id) {
            $order = Order::where('pharmacy_id', $staff->pharmacy_id)
                ->lockForUpdate()
                ->findOrFail($id);

            if ($order->order_status !== Order::STATUS_CANCELLATION_REQUESTED) {
                throw new \Exception(
                    'Pesanan tidak dalam status permintaan pembatalan.'
                );
            }

            $this->orderService->updateStatus(
                $order->id,
                OrderStatus::CANCELLED,
                'Staff menyetujui pembatalan pesanan.',
                'STAFF'
            );

            return $order->fresh(['items.medicine', 'pharmacy', 'statusLogs']);
        });
    }

    public function rejectCancellation(User $user, string $id): Order
    {
        $staff = $user->pharmacyStaff;

        return DB::transaction(function () use ($staff, $id) {
            $order = Order::where('pharmacy_id', $staff->pharmacy_id)
                ->lockForUpdate()
                ->findOrFail($id);

            if ($order->order_status !== Order::STATUS_CANCELLATION_REQUESTED) {
                throw new \Exception(
                    'Pesanan tidak dalam status permintaan pembatalan.'
                );
            }

            $this->orderService->updateStatus(
                $order->id,
                OrderStatus::PENDING,
                'Staff menolak pembatalan, pesanan dikembalikan ke PENDING.',
                'STAFF'
            );

            return $order->fresh(['items.medicine', 'pharmacy', 'statusLogs']);
        });
    }
}
