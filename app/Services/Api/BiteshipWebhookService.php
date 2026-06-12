<?php

namespace App\Services\Api;

use App\Models\DeliveryTracking;
use App\Models\Order;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class BiteshipWebhookService
{
    public function handleWebhook(array $payload): void
    {
        DB::transaction(function () use ($payload) {
            $biteshipId = $payload['order_id'] ?? null;
            $biteshipStatus = $payload['status'] ?? null;

            Log::info("Biteship Webhook Received: ID {$biteshipId}, Status {$biteshipStatus}");

            if (!$biteshipId || !$biteshipStatus) {
                throw new \InvalidArgumentException('Invalid payload', 400);
            }

            $tracking = DeliveryTracking::with('order')
                ->where('biteship_order_id', $biteshipId)
                ->lockForUpdate()
                ->first();

            if (!$tracking) {
                throw new \Exception('Tracking record not found', 404);
            }

            $internalStatus = strtoupper($biteshipStatus);

            $updateData = [
                'status'               => $internalStatus,
                'tracking_number'      => $payload['waybill_id'] ?? $tracking->tracking_number,
                'tracking_link'        => $payload['link'] ?? $tracking->tracking_link,
                'biteship_tracking_id' => $payload['waybill_id'] ?? $tracking->biteship_tracking_id,
                'courier'              => $payload['courier'] ?? $tracking->courier,
                'history'              => $payload['history'] ?? $tracking->history,
            ];

            $tracking->update($updateData);

            $order = $tracking->order;

            $shippedStatuses = [
                'allocated', 'pickingUp', 'picked', 'inTransit', 'droppingOff', 'returnInTransit',
                'picking_up', 'dropping_off', 'in_transit', 'return_in_transit',
            ];
            $cancelledStatuses = ['cancelled', 'rejected', 'courierNotFound', 'returned', 'disposed'];

            if ($biteshipStatus === 'delivered') {
                $order->update(['order_status' => Order::STATUS_DELIVERED]);
            } elseif (in_array($biteshipStatus, $shippedStatuses, true)) {
                $order->update(['order_status' => Order::STATUS_SHIPPED]);
            } elseif (in_array($biteshipStatus, $cancelledStatuses, true)) {
                $order->update(['order_status' => Order::STATUS_CANCELLED]);
                Log::warning("Shipment for Order {$order->order_number} was cancelled by Biteship/Courier.");
            }
        });
    }
}
