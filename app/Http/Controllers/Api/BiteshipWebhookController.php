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
            if ($request->getContent() == "" || empty($request->all()) || !$request->has('order_id')) {
                Log::info('Biteship Webhook Handshake/Ping received.');

                return response()->json([
                    'status' => 'success',
                    'message' => 'ok'
                ], 200);
            }

            ProcessBiteshipWebhookJob::dispatch($request->all());

            return $this->successResponse(null, 'Webhook received and queued for processing');
        } catch (\Exception $e) {
            Log::error('Webhook queuing failed: ' . $e->getMessage());
            return $this->errorResponse('Failed to queue webhook', 500);
        }
    }
}