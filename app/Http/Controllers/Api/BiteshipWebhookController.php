<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DeliveryTracking;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class BiteshipWebhookController extends Controller
{
    /**
     * Handle incoming webhooks from Biteship.
     */
    public function handle(Request $request)
    {
        // Biteship security: Optional check for signature/token if configured
        
        $payload = $request->all();
        $biteshipId = $payload['order_id'] ?? null;
        $biteshipStatus = $payload['status'] ?? null;

        Log::info("Biteship Webhook Received: ID {$biteshipId}, Status {$biteshipStatus}");

        if (!$biteshipId || !$biteshipStatus) {
            return response()->json(['message' => 'Invalid payload'], 400);
        }

        $tracking = DeliveryTracking::with('order')->where('biteship_id', $biteshipId)->first();

        if (!$tracking) {
            return response()->json(['message' => 'Tracking record not found'], 404);
        }

        // Mapping Biteship status to internal status
        $internalStatus = strtoupper($biteshipStatus);
        
        $tracking->update([
            'status' => $internalStatus,
            'tracking_number' => $payload['courier']['waybill_id'] ?? $tracking->tracking_number,
        ]);

        // Create delivery log
        $tracking->logs()->create([
            'status' => $internalStatus,
            'description' => "Status kurir diperbarui menjadi {$internalStatus}",
        ]);

        // Auto-update Order status based on delivery progress
        $order = $tracking->order;
        
        if ($biteshipStatus === 'delivered') {
            $order->update(['order_status' => Order::STATUS_COMPLETED]);
        } elseif ($biteshipStatus === 'picking_up' || $biteshipStatus === 'picked_up') {
            $order->update(['order_status' => Order::STATUS_SHIPPED]);
        } elseif ($biteshipStatus === 'cancelled' || $biteshipStatus === 'rejected') {
            // Log cancellation but maybe keep order as processing for manual check
            Log::warning("Shipment for Order {$order->order_number} was cancelled by Biteship/Courier.");
        }

        return response()->json(['message' => 'Webhook processed successfully']);
    }
}
