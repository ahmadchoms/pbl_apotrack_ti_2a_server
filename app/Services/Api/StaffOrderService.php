<?php

namespace App\Services\Api;

use App\Models\Order;
use App\Models\User;
use App\Enums\OrderStatus;
use App\Services\BiteshipService;
use App\Services\Pharmacy\OrderService;
use App\Jobs\CreateBiteshipOrderJob;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class StaffOrderService
{
    public function __construct(
        protected OrderService $orderService,
        protected BiteshipService $biteshipService
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

        $query = Order::with(['items.medicine', 'user', 'address', 'tracking'])
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

        return Order::with(['items.medicine', 'user', 'prescription', 'tracking', 'address'])
            ->where('pharmacy_id', $staff->pharmacy_id)
            ->findOrFail($id);
    }

    /**
     * Verify order by verification code and complete it.
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

        $this->orderService->updateStatus(
            $order->id,
            OrderStatus::COMPLETED,
            'Pesanan diambil oleh customer (verifikasi kode pickup).'
        );

        return $order->fresh()->load(['items', 'user']);
    }

    /**
     * Ship order via Biteship asynchronously (Non-Blocking & ACID Protected).
     * Uses courier info from existing DeliveryTracking record (set by customer during checkout).
     */
    public function shipOrder(User $user, string $id, array $data): Order
    {
        $staff = $user->pharmacyStaff;

        return DB::transaction(function () use ($staff, $id, $data) {
            $order = Order::with(['address', 'items.medicine', 'pharmacy', 'user', 'tracking'])
                ->where('pharmacy_id', $staff->pharmacy_id)
                ->lockForUpdate()
                ->findOrFail($id);

            if ($order->order_status !== Order::STATUS_READY_FOR_PICKUP) {
                throw new \Exception(
                    'Pesanan harus dalam status READY_FOR_PICKUP sebelum dikirim.',
                    422
                );
            }

            // Gunakan kurir yang sudah dipilih customer dari tracking record
            $tracking = $order->tracking;
            $courierInfo = $tracking->courier ?? [];
            if (!$tracking || !($courierInfo['company'] ?? null)) {
                throw new \Exception('Pesanan ini belum memiliki data kurir. Customer harus memilih kurir saat checkout.', 422);
            }

            // Gunakan kurir yang sudah dipilih customer dari tracking record
            $tracking = $order->tracking;
            $courierInfo = $tracking->courier ?? [];
            if (!$tracking || !($courierInfo['company'] ?? null)) {
                throw new \Exception('Pesanan ini belum memiliki data kurir. Customer harus memilih kurir saat checkout.', 422);
            }

            $items = $order->items->map(function ($item) {
                return [
                    'name'     => $item->medicine_name,
                    'quantity' => $item->quantity,
                    'value' => (int) $item->price,
                    'weight' => $item->medicine?->weight_in_grams ?? 200,
                ];
            })->toArray();

            $payload = [
                'shipper_contact_name'    => $order->pharmacy->name,
                'shipper_contact_phone'   => $order->pharmacy->phone ?? '081234567890',
                'shipper_contact_email'   => $order->pharmacy->email ?? 'admin@apotrack.com',
                'shipper_organization'    => $order->pharmacy->name,
                'origin_contact_name'     => $order->pharmacy->name,
                'origin_contact_phone'    => $order->pharmacy->phone ?? '081234567890',
                'origin_address'          => $order->pharmacy->address,
                'origin_coordinate'       => [
                    'latitude'  => (float) $order->pharmacy->latitude,
                    'longitude' => (float) $order->pharmacy->longitude,
                ],
                'destination_contact_name'  => $order->user->username,
                'destination_contact_phone' => $order->user->phone ?? '081234567890',
                'destination_contact_email' => $order->user->email,
                'destination_address'       => $order->address->complete_address,
                'destination_coordinate'    => [
                    'latitude'  => (float) $order->address->latitude,
                    'longitude' => (float) $order->address->longitude,
                ],
                'delivery_type' => 'now',
                'items' => $items,
                'courier_company' => $data['courier_code'],
                'courier_type'    => $data['courier_service'],
            ];

            $courierData = [
                'courier' => $courierInfo,
                'shipping_cost'    => $order->shipping_cost,
            ];

            // Update status tracking
            $tracking->update(['status'          => 'PENDING_BITESHIP']);

            // Ubah status order menjadi sedang mengalokasikan kurir
            $order->update(['order_status' => 'ALLOCATING_COURIER']);

            // Dispatch job ke antrean latar belakang
            CreateBiteshipOrderJob::dispatch($order->id, $payload, $courierData);

            return $order->load(['tracking', 'address', 'user']);
        });
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
     * Simulasi perubahan status tracking Biteship (Sandbox only).
     */
    public function simulateTrackingStatus(User $user, string $id, string $status): Order
    {
        $staff = $user->pharmacyStaff;

        $order = Order::with(['tracking', 'address', 'user'])
            ->where('pharmacy_id', $staff->pharmacy_id)
            ->findOrFail($id);

        $tracking = $order->tracking;

        if (!$tracking || !$tracking->biteship_order_id) {
            throw new \Exception('Pesanan ini belum memiliki tracking Biteship.', 422);
        }

        try {
            $this->biteshipService->simulateTracking($tracking->biteship_order_id, $status);
        } catch (\Exception $e) {
            Log::warning("Biteship simulateTracking gagal, lanjut update lokal: " . $e->getMessage());
        }

        // Normalize camelCase statuses to snake_case for consistency with webhook
        $normalized = match ($status) {
            'pickingUp' => 'picking_up',
            'droppingOff' => 'dropping_off',
            'inTransit' => 'in_transit',
            'returnInTransit' => 'return_in_transit',
            default => $status,
        };
        $status = $normalized;

        // Append history entry (matching webhook history structure)
        $history = $tracking->history ?? [];
        $history[] = [
            'status'       => $status,
            'note'         => "Status simulasi: {$status}",
            'service_type' => 'instant',
            'updated_at'   => now()->toIso8601String(),
        ];

        $internalStatus = strtoupper($status);
        $tracking->update([
            'status'        => $internalStatus,
            'tracking_link' => 'https://track.biteship.com/test',
            'history'       => $history,
        ]);

        // Mapping order status (sama seperti webhook)
        $shippedStatuses = [
            'allocated',
            'pickingUp',
            'picked',
            'inTransit',
            'droppingOff',
            'returnInTransit',
            'picking_up',
            'dropping_off',
            'in_transit',
            'return_in_transit',
        ];
        $cancelledStatuses = ['cancelled', 'rejected', 'courierNotFound', 'returned', 'disposed'];

        if ($status === 'delivered') {
            $order->update(['order_status' => Order::STATUS_DELIVERED]);
        } elseif (in_array($status, $shippedStatuses, true)) {
            $order->update(['order_status' => Order::STATUS_SHIPPED]);
        } elseif (in_array($status, $cancelledStatuses, true)) {
            $order->update(['order_status' => Order::STATUS_CANCELLED]);
        }

        return $order->fresh()->load(['tracking', 'address', 'user']);
    }

    /**
     * Update order status.
     */
    public function updateStatus(User $user, string $id, string $status, ?string $note): Order
    {
        $staff = $user->pharmacyStaff;
        $order = Order::where('pharmacy_id', $staff->pharmacy_id)->findOrFail($id);

        $orderStatus = OrderStatus::tryFrom($status) ?? throw new \InvalidArgumentException("Status '{$status}' tidak valid.");
        return $this->orderService->updateStatus($order->id, $orderStatus, $note);
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

            $order->update([
                'order_status' => Order::STATUS_CANCELLED,
            ]);

            $order->statusLogs()->create([
                'status'      => Order::STATUS_CANCELLED,
                'description' => 'Staff menyetujui pembatalan pesanan.',
                'source'      => 'STAFF',
            ]);

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

            // Kembalikan ke PENDING agar customer bisa lanjut
            $order->update([
                'order_status'        => Order::STATUS_PENDING,
                'cancellation_reason' => null,
            ]);

            $order->statusLogs()->create([
                'status'      => Order::STATUS_PENDING,
                'description' => 'Staff menolak pembatalan, pesanan dikembalikan ke PENDING.',
                'source'      => 'STAFF',
            ]);

            return $order->fresh(['items.medicine', 'pharmacy', 'statusLogs']);
        });
    }
}
