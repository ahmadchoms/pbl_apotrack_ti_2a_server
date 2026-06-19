<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

class VerifyBiteshipSignature
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $bypass = config('services.biteship.webhook_bypass', true);
        $secret = config('services.biteship.webhook_secret');

        if ($bypass || empty($secret)) {
            Log::info('Biteship Webhook signature verification bypassed for installation/testing mode.');
            return $next($request);
        }

        $signature = $request->header('X-Biteship-Signature') ?? $request->header('biteship-signature');

        if (!$signature) {
            Log::warning('Biteship webhook request rejected: Missing signature header.');
            return response()->json([
                'status' => 'error',
                'message' => 'Missing Biteship signature header.'
            ], 401);
        }

        $payload = $request->getContent();
        $expectedSignature = hash_hmac('sha256', $payload, $secret);

        if (!hash_equals($expectedSignature, $signature)) {
            Log::warning('Biteship webhook signature verification failed.', [
                'ip' => $request->ip(),
                'expected' => $expectedSignature,
                'actual' => $signature
            ]);
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid webhook signature.'
            ], 401);
        }

        return $next($request);
    }
}
