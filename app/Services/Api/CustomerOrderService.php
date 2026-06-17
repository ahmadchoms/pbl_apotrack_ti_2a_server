<?php

namespace App\Services\Api;

use App\Models\Order;
use App\Models\Prescription;
use App\Models\User;
use App\Services\Pharmacy\OrderService;
use App\Jobs\UploadPrescriptionToS3Job;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CustomerOrderService
{
    public function __construct(
        protected OrderService $orderService
    ) {}

    /**
     * Get paginated orders for a user.
     */
    public function listOrders(User $user, int $perPage = 10): LengthAwarePaginator
    {
        return Order::with(['items.medicine', 'pharmacy', 'reviews'])
            ->where('user_id', $user->id)
            ->latest()
            ->paginate($perPage);
    }

    /**
     * Store a new customer order.
     */
    public function storeOrder(User $user, array $data): Order
    {
        return $this->orderService->createCustomerOrder($user, $data);
    }

    /**
     * Get specific order details.
     */
    public function showOrder(User $user, string $id): Order
    {
        return Order::with(['items.medicine', 'pharmacy', 'tracking', 'statusLogs', 'prescription', 'reviews', 'address'])
            ->where('user_id', $user->id)
            ->findOrFail($id);
    }

    /**
     * Upload prescription image asynchronously (Non-Blocking & ACID Protected).
     */
    public function uploadPrescription(User $user, string $id, $file): Prescription
    {
        return DB::transaction(function () use ($user, $id, $file) {
            $order = Order::where('user_id', $user->id)
                ->lockForUpdate()
                ->findOrFail($id);

            // Simpan file sementara di local disk agar proses HTTP tidak terblokir
            $localPath = $file->store('temp/prescriptions', 'local');

            $prescription = Prescription::create([
                'user_id'   => $user->id,
                'order_id'  => $order->id,
                'image_url' => url('api/temp-prescription/' . basename($localPath)),
                'status'    => 'UPLOADING',
            ]);

            $order->update(['prescription_id' => $prescription->id]);

            // Dispatch job ke antrean latar belakang
            UploadPrescriptionToS3Job::dispatch($prescription->id, $localPath);

            return $prescription;
        });
    }

    /**
     * Get order history (COMPLETED or CANCELLED).
     */
    public function listHistory(User $user, int $perPage = 15): LengthAwarePaginator
    {
        return Order::with(['items.medicine', 'pharmacy', 'reviews'])
            ->where('user_id', $user->id)
            ->whereIn('order_status', [
                Order::STATUS_COMPLETED,
                Order::STATUS_CANCELLED,
            ])
            ->latest()
            ->paginate($perPage);
    }

    /**
     * Get courier tracking details.
     */
    public function getTracking(User $user, string $id)
    {
        $order = Order::with(['tracking'])
            ->where('user_id', $user->id)
            ->findOrFail($id);

        if (!$order->tracking) {
            throw new \Exception('Informasi pengiriman tidak ditemukan untuk pesanan ini.', 404);
        }

        return $order->tracking;
    }

    /**
     * Simulate payment for UI testing (ACID Protected & Pessimistic Locking).
     */
    public function simulatePayment(User $user, string $id): Order
    {
        return DB::transaction(function () use ($user, $id) {
            $order = Order::where('user_id', $user->id)
                ->lockForUpdate()
                ->findOrFail($id);

            if ($order->payment_status !== 'UNPAID') {
                throw new \Exception(
                    'Pesanan ini sudah dibayar atau status tidak valid.',
                    422
                );
            }

            if ($order->payment_method !== 'QRIS') {
                throw new \Exception('Simulasi pembayaran hanya untuk metode QRIS.', 422);
            }

            $order->update([
                'payment_status' => 'PAID',
                'paid_at'        => now(),
            ]);

            return $order;
        });
    }

    public function requestCancellation(User $user, string $id, string $reason): Order
    {
        return DB::transaction(function () use ($user, $id, $reason) {
            $order = Order::where('user_id', $user->id)
                ->lockForUpdate()
                ->findOrFail($id);

            if ($order->order_status !== Order::STATUS_PENDING) {
                throw new \Exception(
                    'Hanya pesanan dengan status PENDING yang dapat dibatalkan.'
                );
            }

            $order->update([
                'order_status'        => Order::STATUS_CANCELLATION_REQUESTED,
                'cancellation_reason' => $reason,
            ]);

            $order->statusLogs()->create([
                'status'      => Order::STATUS_CANCELLATION_REQUESTED,
                'description' => 'Customer mengajukan pembatalan: ' . $reason,
                'source'      => 'CUSTOMER',
            ]);

            return $order->fresh(['items.medicine', 'pharmacy', 'statusLogs']);
        });
    }
    public function confirmReceived(User $user, string $id): Order
    {
        return DB::transaction(function () use ($user, $id) {
            $order = Order::where('user_id', $user->id)
                ->lockForUpdate()
                ->findOrFail($id);

            if (!in_array($order->order_status, ['SHIPPED', 'DELIVERED'])) {
                throw new \Exception(
                    'Pesanan harus dalam status SHIPPED atau DELIVERED untuk dikonfirmasi.',
                    422
                );
            }

            $order->update([
                'order_status' => Order::STATUS_COMPLETED,
            ]);

            $order->statusLogs()->create([
                'status'      => Order::STATUS_COMPLETED,
                'description' => 'Customer mengkonfirmasi pesanan telah diterima.',
                'source'      => 'CUSTOMER',
            ]);

            return $order;
        });
    }
}
