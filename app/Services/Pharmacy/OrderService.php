<?php

namespace App\Services\Pharmacy;

use App\Models\Order;
use App\Models\Pharmacy;
use App\Events\OrderStatusChangedEvent;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Enums\OrderStatus;
use App\Exceptions\InsufficientStockException;
use App\Exceptions\InvalidOrderStatusTransitionException;
use App\Models\OrderStatusLog;

class OrderService
{
    public function list(string $pharmacyId, array $filters)
    {
        return Order::query()
            ->with(['user:id,username,email,phone', 'items.medicine', 'prescription', 'address'])
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
            'items.medicine'
        ])->findOrFail($orderId);
    }

    public function createPOSOrder(string $pharmacyId, array $data)
    {
        return DB::transaction(function () use ($pharmacyId, $data) {
            $order = Order::create([
                'user_id' => $data['user_id'] ?? \App\Models\User::where('role', 'USER')->first()?->id,
                'pharmacy_id' => $pharmacyId,
                'order_number' => 'POS-' . strtoupper(Str::random(8)),
                'verification_code' => strtoupper(Str::random(10)),
                'service_type' => 'POS',
                'payment_method' => $data['payment_method'] ?? 'CASH',
                'order_status' => 'COMPLETED',
                'payment_status' => 'PAID',
                'subtotal_amount' => $data['total'],
                'grand_total' => $data['total'],
                'expired_at' => now()->addHour(),
                'paid_at' => now(),
            ]);

            foreach ($data['items'] as $item) {
                $medicine = \App\Models\Medicine::with('unit')->findOrFail($item['id']);

                $order->items()->create([
                    'medicine_id' => $medicine->id,
                    'medicine_name' => $medicine->name,
                    'unit_name' => $medicine->unit->name ?? '-',
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'subtotal' => $item['price'] * $item['quantity'],
                ]);

                $this->reduceStock($medicine, $item['quantity']);
            }

            return $order;
        });
    }

    public function createCustomerOrder(\App\Models\User $user, array $data)
    {
        $order = DB::transaction(function () use ($user, $data) {
            $order = Order::create([
                'user_id' => $user->id,
                'pharmacy_id' => $data['pharmacy_id'],
                'order_number' => 'ORD-' . strtoupper(Str::random(8)),
                'verification_code' => strtoupper(Str::random(10)),
                'service_type' => 'PICKUP',
                'payment_method' => $data['payment_method'] ?? 'CASH',
                'order_status' => 'PENDING',
                'payment_status' => 'UNPAID',
                'subtotal_amount' => $data['subtotal_amount'],
                'grand_total' => $data['subtotal_amount'],
                'notes' => $data['notes'] ?? null,
                'expired_at' => now()->addHours(24),
            ]);

            foreach ($data['items'] as $item) {
                $medicine = \App\Models\Medicine::with('unit')->findOrFail($item['id']);

                $order->items()->create([
                    'medicine_id' => $medicine->id,
                    'medicine_name' => $medicine->name,
                    'unit_name' => $medicine->unit->name ?? '-',
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'subtotal' => $item['price'] * $item['quantity'],
                ]);

                $this->reduceStock($medicine, $item['quantity']);
            }

            $cart = \App\Models\Cart::where('user_id', $user->id)
                ->where('pharmacy_id', $data['pharmacy_id'])
                ->lockForUpdate()
                ->first();

            if ($cart) {
                $cart->items()->delete();
            }

            return $order;
        });

        OrderStatusChangedEvent::dispatch($order, 'NONE', 'PENDING');

        return $order;
    }

    protected function reduceStock($medicine, $quantity)
    {
        $med = \App\Models\Medicine::where('id', $medicine->id)->lockForUpdate()->first();

        $batches = $med->batches()
            ->where('expired_date', '>', now())
            ->where('stock', '>', 0)
            ->orderBy('expired_date', 'asc')
            ->lockForUpdate()
            ->get();

        $totalAvailable = $batches->sum('stock');
        if ($totalAvailable < $quantity) {
            throw new InsufficientStockException("Stok obat \"{$med->name}\" tidak mencukupi. Tersedia: {$totalAvailable}, Diminta: {$quantity}.");
        }

        $remainingToReduce = $quantity;

        foreach ($batches as $batch) {
            if ($remainingToReduce <= 0) break;

            if ($batch->stock >= $remainingToReduce) {
                $batch->decrement('stock', $remainingToReduce);
                $remainingToReduce = 0;
            } else {
                $remainingToReduce -= $batch->stock;
                $batch->update(['stock' => 0]);
            }
        }
    }

    public function getPendingCount(string $pharmacyId)
    {
        return Order::where('pharmacy_id', $pharmacyId)
            ->where('order_status', 'PENDING')
            ->count();
    }

    public function updateStatus(string $orderId, OrderStatus $status, ?string $note = null, string $source = 'PHARMACY_WEB')
    {
        return DB::transaction(function () use ($orderId, $status, $note, $source) {
            $order = Order::with('user')->where('id', $orderId)->lockForUpdate()->firstOrFail();
            $oldStatus = OrderStatus::from($order->order_status);

            $this->validateStatusTransition($oldStatus, $status);

            $order->update(['order_status' => $status->value]);

            if ($status === OrderStatus::COMPLETED && $order->payment_method === 'CASH') {
                $order->update([
                    'payment_status' => 'PAID',
                    'paid_at' => now(),
                ]);
            }

            OrderStatusLog::create([
                'order_id'    => $order->id,
                'status'      => $status->value,
                'description' => $note ?? $status->logDescription($oldStatus->label()),
                'source'      => $source
            ]);

            if ($status === OrderStatus::CANCELLED && $oldStatus !== OrderStatus::CANCELLED) {
                $this->restoreStock($order);
            }

            OrderStatusChangedEvent::dispatch($order, $oldStatus->value, $status->value);

            return $order;
        });
    }

    protected function restoreStock(Order $order)
    {
        foreach ($order->items as $item) {
            $med = \App\Models\Medicine::where('id', $item->medicine_id)->lockForUpdate()->first();
            if (!$med) continue;

            $batch = $med->batches()
                ->where('expired_date', '>', now())
                ->orderBy('expired_date', 'desc')
                ->lockForUpdate()
                ->first();

            if ($batch) {
                $batch->increment('stock', $item->quantity);
            } else {
                $med->batches()->create([
                    'batch_number' => 'RET-' . strtoupper(Str::random(6)),
                    'expired_date' => now()->addMonths(6),
                    'stock' => $item->quantity,
                ]);
            }
        }
    }

    protected function validateStatusTransition(OrderStatus $from, OrderStatus $to): void
    {
        if ($from === $to) return;

        $validTransitions = [
            OrderStatus::PENDING->value => [
                OrderStatus::PROCESSING->value,
                OrderStatus::CANCELLED->value,
                OrderStatus::CANCEL_REQUESTED->value,
            ],
            OrderStatus::PROCESSING->value => [
                OrderStatus::READY_FOR_PICKUP->value,
                OrderStatus::CANCELLED->value
            ],
            OrderStatus::READY_FOR_PICKUP->value => [
                OrderStatus::COMPLETED->value,
            ],
            OrderStatus::CANCEL_REQUESTED->value => [
                OrderStatus::CANCELLED->value,
                OrderStatus::PENDING->value,
            ],
            OrderStatus::COMPLETED->value => [],
            OrderStatus::CANCELLED->value => [],
        ];

        if (!in_array($to->value, $validTransitions[$from->value] ?? [])) {
            throw new InvalidOrderStatusTransitionException(
                "Tidak dapat mengubah status pesanan dari {$from->label()} ke {$to->label()}."
            );
        }
    }

    public function rejectOrder(string $orderId, string $reason)
    {
        return $this->updateStatus($orderId, OrderStatus::CANCELLED, "Pesanan ditolak: $reason");
    }

    public function validatePrescription(string $prescriptionId, string $status, ?string $note = null)
    {
        return DB::transaction(function () use ($prescriptionId, $status, $note) {
            $prescription = \App\Models\Prescription::where('id', $prescriptionId)->lockForUpdate()->firstOrFail();
            $prescription->update([
                'status' => $status,
                'rejection_note' => $note,
                'verified_at' => $status === 'VERIFIED' ? now() : null,
                'verified_by' => $status === 'VERIFIED' ? Auth::id() : null,
            ]);

            return $prescription;
        });
    }
}
