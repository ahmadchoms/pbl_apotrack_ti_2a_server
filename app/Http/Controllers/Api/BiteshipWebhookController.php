<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseApiController;
use App\Jobs\ProcessBiteshipWebhookJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class BiteshipWebhookController extends BaseApiController
{
    public function handle(Request $request)
    {
        try {
            // Jika body kosong atau tidak memiliki order_id (seperti saat Biteship melakukan ping/instalasi webhook), langsung kembalikan respons 200 OK
            if (empty($request->all()) || !$request->has('order_id')) {
                Log::info('Biteship Webhook Installation/Ping received. Responding with 200 OK.');
                return response()->json(['success' => true, 'message' => 'Webhook verification/ping successful'], 200);
            }

            // Dispatch job ke antrean latar belakang agar Biteship (!mengalami timeout)
            ProcessBiteshipWebhookJob::dispatch($request->all());

            return $this->successResponse(null, 'Webhook received and queued for processing');
        } catch (\Exception $e) {
            Log::error('Webhook queuing failed: ' . $e->getMessage());
            return $this->errorResponse('Failed to queue webhook', 500);
        }
    }
}
