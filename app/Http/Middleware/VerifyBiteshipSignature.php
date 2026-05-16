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
        // Cek apakah mode bypass diaktifkan via .env (BITESHIP_WEBHOOK_BYPASS=true) atau rahasia belum diatur.
        // Ini memastikan instalasi awal webhook di dashboard Biteship berjalan lancar dengan merespons 200 OK.
        // Setelah instalasi berhasil dan secret didapatkan, atur BITESHIP_WEBHOOK_BYPASS=false di .env.
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

        // Calculate HMAC SHA256 signature
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
