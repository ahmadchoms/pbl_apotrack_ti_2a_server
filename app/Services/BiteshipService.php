<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Client\ConnectionException;
use Exception;

class BiteshipService
{
    protected string $apiKey;
    protected string $baseUrl;

    public function __construct()
    {
        $this->apiKey = config('services.biteship.key');
        $this->baseUrl = config('services.biteship.url', 'https://api.biteship.com');
    }

    /**
     * Mengecek tarif ongkos kirim dari berbagai kurir.
     * Menerima parameter area_id ATAU latitude/longitude sebagai origin/destination.
     */
    public function checkRates(array $params): array
    {
        return $this->safeRequest(function () use ($params) {
            $response = Http::timeout(5)->withHeaders([
                'Authorization' => $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post("{$this->baseUrl}/rates/couriers", $params);

            return $response->json();
        }, 'Check Rates');
    }

    /**
     * Membuat order pengiriman (Request Pickup) ke Biteship.
     */
    public function createOrder(array $orderData)
    {
        return $this->safeRequest(function () use ($orderData) {
            $response = Http::withHeaders([
                'Authorization' => $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post("{$this->baseUrl}/orders", $orderData);

            return $response->json();
        }, 'Create Order');
    }

    /**
     * Melacak status pengiriman berdasarkan ID Biteship.
     */
    public function getTracking(string $biteshipId)
    {
        return $this->safeRequest(function () use ($biteshipId) {
            $response = Http::withHeaders([
                'Authorization' => $this->apiKey,
            ])->get("{$this->baseUrl}/trackings/{$biteshipId}");

            return $response->json();
        }, 'Get Tracking');
    }

    /**
     * Simulasi perubahan status tracking (Sandbox only).
     */
    public function simulateTracking(string $biteshipId, string $status)
    {
        return $this->safeRequest(function () use ($biteshipId, $status) {
            $response = Http::withHeaders([
                'Authorization' => $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post("{$this->baseUrl}/trackings/{$biteshipId}/simulate/{$status}");

            return $response->json();
        }, 'Simulate Tracking');
    }

    /**
     * Helper untuk menangani request dengan error handling yang seragam.
     */
    protected function safeRequest(callable $callback, string $actionName)
    {
        try {
            if (empty($this->apiKey)) {
                throw new Exception("Biteship API Key belum dikonfigurasi.");
            }

            $result = $callback();

            // Tangani jika Biteship mengembalikan error validasi atau error lainnya
            if (isset($result['success']) && $result['success'] === false) {
                $errorMsg = $result['error'] ?? ($result['message'] ?? 'Unknown error from Biteship');
                Log::error("Biteship Error [$actionName]: " . json_encode($result));
                throw new Exception($errorMsg);
            }

            return $result;
        } catch (ConnectionException $e) {
            Log::error("Biteship Timeout/Connection Error [$actionName]: " . $e->getMessage());
            throw new Exception("Koneksi ke layanan pengiriman (Biteship) terputus atau timeout.");
        } catch (Exception $e) {
            Log::error("Biteship Exception [$actionName]: " . $e->getMessage());
            throw $e;
        }
    }
}
