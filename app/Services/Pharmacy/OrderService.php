<?php

namespace App\Services\Pharmacy;

use App\Models\Order;
use App\Models\Pharmacy;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderService
{
    public function list(string $pharmacyId, array $filters)
    {
        return Order::query()
            ->with(['user:id,username,email,phone', 'items', 'prescription'])
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
            'items.medicine',
            'tracking'
        ])->findOrFail($orderId);
    }

    public function createPOSOrder(string $pharmacyId, array $data)
    {
        return DB::transaction(function () use ($pharmacyId, $data) {
            $order = Order::create([
                'user_id' => $data['user_id'] ?? \App\Models\User::where('role', 'CUSTOMER')->first()->id, // Default to a customer if not provided
                'pharmacy_id' => $pharmacyId,
                'order_number' => 'POS-' . strtoupper(Str::random(8)),
                'verification_code' => strtoupper(Str::random(6)),
                'service_type' => 'WALK_IN',
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

                // Reduce stock from batches (FIFO simple logic)
                $this->reduceStock($medicine, $item['quantity']);
            }

            return $order;
        });
    }

    protected function reduceStock($medicine, $quantity)
    {
        $batches = $medicine->batches()
            ->where('expired_date', '>', now())
            ->where('stock', '>', 0)
            ->orderBy('expired_date', 'asc')
            ->get();

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

    public function updateStatus(string $orderId, string $status, ?string $note = null)
    {
        return DB::transaction(function () use ($orderId, $status, $note) {
            $order = Order::findOrFail($orderId);
            $oldStatus = $order->order_status;

            $order->update(['order_status' => $status]);

            // Create log
            \App\Models\OrderStatusLog::create([
                'order_id' => $order->id,
                'status' => $status,
                'description' => $note ?? "Status changed from $oldStatus to $status",
                'source' => 'PHARMACY_WEB'
            ]);

            return $order;
        });
    }

    public function rejectOrder(string $orderId, string $reason)
    {
        return $this->updateStatus($orderId, 'CANCELLED', "Pesanan ditolak: $reason");
    }

    public function validatePrescription(string $prescriptionId, string $status, ?string $note = null)
    {
        return DB::transaction(function () use ($prescriptionId, $status, $note) {
            $prescription = \App\Models\Prescription::findOrFail($prescriptionId);
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
