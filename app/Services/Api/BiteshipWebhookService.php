<?php

namespace App\Services\Api;

use App\Models\DeliveryTracking;
use App\Models\Order;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class BiteshipWebhookService
{
    /**
     * Handle incoming Biteship webhook payload (ACID Protected & Pessimistic Locking).
     */
    public function handleWebhook(array $payload): void
    {
        DB::transaction(function () use ($payload) {
            $biteshipId = $payload['order_id'] ?? null;
            $biteshipStatus = $payload['status'] ?? null;

            Log::info("Biteship Webhook Received: ID {$biteshipId}, Status {$biteshipStatus}");

            if (!$biteshipId || !$biteshipStatus) {
                throw new \InvalidArgumentException('Invalid payload', 400);
            }

            // Lock tracking row to prevent race conditions from duplicate/concurrent webhooks
            $tracking = DeliveryTracking::with('order')
                ->where('biteship_id', $biteshipId)
                ->lockForUpdate()
                ->first();

            if (!$tracking) {
                throw new \Exception('Tracking record not found', 404);
            }

            $internalStatus = strtoupper($biteshipStatus);
            
            $tracking->update([
                'status' => $internalStatus,
                'tracking_number' => $payload['courier']['waybill_id'] ?? $tracking->tracking_number,
            ]);

            $tracking->logs()->create([
                'status' => $internalStatus,
                'description' => "Status kurir diperbarui menjadi {$internalStatus}",
            ]);

            $order = $tracking->order;
            
            if ($biteshipStatus === 'delivered') {
                $order->update(['order_status' => Order::STATUS_COMPLETED]);
            } elseif ($biteshipStatus === 'picking_up' || $biteshipStatus === 'picked_up') {
                $order->update(['order_status' => Order::STATUS_SHIPPED]);
            } elseif ($biteshipStatus === 'cancelled' || $biteshipStatus === 'rejected') {
                Log::warning("Shipment for Order {$order->order_number} was cancelled by Biteship/Courier.");
            }
        });
    }
}
