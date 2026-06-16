<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseApiController;
use App\Services\Api\CustomerOrderService;
use App\Http\Requests\Api\Customer\StoreCustomerOrderRequest;
use App\Http\Requests\Api\Customer\UploadPrescriptionRequest;
use App\Http\Requests\Api\Customer\CheckShippingRatesRequest;
use App\Models\Pharmacy;
use App\Models\UserAddress;
use App\Services\BiteshipService;
use App\Http\Resources\Api\OrderResource;
use App\Http\Resources\Api\DeliveryTrackingResource;
use Illuminate\Http\Request;
use App\Exceptions\InsufficientStockException;
use Illuminate\Support\Facades\Log;

class OrderController extends BaseApiController
{
    public function __construct(
        protected CustomerOrderService $customerOrderService,
        protected BiteshipService $biteshipService
    ) {}

    public function index(Request $request)
    {
        $orders = $this->customerOrderService->listOrders($request->user(), 10);

        return $this->successResponse(OrderResource::collection($orders), 'Riwayat pesanan berhasil diambil');
    }

    public function store(StoreCustomerOrderRequest $request)
    {
        try {
            $order = $this->customerOrderService->storeOrder($request->user(), $request->validated());

            return $this->successResponse(new OrderResource($order->load(['items.medicine', 'tracking'])), 'Pesanan berhasil dibuat', 201);
        } catch (InsufficientStockException $e) {
            return $this->errorResponse($e->getMessage(), 422);
        } catch (\Exception $e) {
            Log::error('Order creation failed: ' . $e->getMessage());
            return $this->errorResponse('Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.', 500);
        }
    }

    public function show($id, Request $request)
    {
        try {
            $order = $this->customerOrderService->showOrder($request->user(), $id);

            return $this->successResponse(new OrderResource($order), 'Detail pesanan berhasil diambil');
        } catch (\Exception $e) {
            return $this->errorResponse('Pesanan tidak ditemukan', 404);
        }
    }

    public function uploadPrescription(UploadPrescriptionRequest $request, $id)
    {
        try {
            $prescription = $this->customerOrderService->uploadPrescription(
                $request->user(),
                $id,
                $request->file('prescription_image')
            );

            return $this->successResponse($prescription, 'Resep dokter berhasil diunggah');
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal mengunggah resep: ' . $e->getMessage(), 500);
        }
    }

    public function history(Request $request)
    {
        $orders = $this->customerOrderService->listHistory($request->user(), 15);

        return $this->successResponse(OrderResource::collection($orders), 'Riwayat pesanan berhasil diambil');
    }

    public function tracking($id, Request $request)
    {
        try {
            $tracking = $this->customerOrderService->getTracking($request->user(), $id);

            return $this->successResponse(new DeliveryTrackingResource($tracking), 'Data pelacakan pengiriman berhasil diambil');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 404);
        }
    }

    public function simulatePayment($id, Request $request)
    {
        try {
            $order = $this->customerOrderService->simulatePayment($request->user(), $id);

            return $this->successResponse(new OrderResource($order), 'Simulasi pembayaran berhasil, pesanan telah dilunasi.');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    public function confirmReceived($id, Request $request)
    {
        try {
            $order = $this->customerOrderService->confirmReceived($request->user(), $id);

            return $this->successResponse(new OrderResource($order), 'Pesanan berhasil dikonfirmasi diterima.');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    public function shippingRates(CheckShippingRatesRequest $request)
    {
        try {
            $pharmacy = Pharmacy::findOrFail($request->pharmacy_id);
            $address = UserAddress::where('user_id', $request->user()->id)
                ->findOrFail($request->address_id);

            $items = [];
            if ($request->has('items') && is_array($request->items)) {
                $items = $request->items;
            }

            try {
                $rates = $this->biteshipService->checkRates([
                    'origin_latitude' => (float) $pharmacy->latitude,
                    'origin_longitude' => (float) $pharmacy->longitude,
                    'destination_latitude' => (float) $address->latitude,
                    'destination_longitude' => (float) $address->longitude,
                    'items' => $items,
                ]);

                return $this->successResponse($rates, 'Tarif pengiriman berhasil diambil');
            } catch (\Exception $e) {
                Log::info('Biteship rates unavailable, using manual fallback: ' . $e->getMessage());
                $manualRates = $this->calculateManualRates($pharmacy, $address);
                return $this->successResponse($manualRates, 'Tarif pengiriman berhasil diambil');
            }
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal mengambil tarif: ' . $e->getMessage(), 500);
        }
    }

    private function calculateManualRates(Pharmacy $pharmacy, UserAddress $address): array
    {
        $lat1 = deg2rad((float) $pharmacy->latitude);
        $lon1 = deg2rad((float) $pharmacy->longitude);
        $lat2 = deg2rad((float) $address->latitude);
        $lon2 = deg2rad((float) $address->longitude);

        $dlat = $lat2 - $lat1;
        $dlon = $lon2 - $lon1;
        $a = sin($dlat / 2) ** 2 + cos($lat1) * cos($lat2) * sin($dlon / 2) ** 2;
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        $distanceKm = round(6371 * $c, 1);

        $estimatedMinutes = match (true) {
            $distanceKm <= 3 => '15 - 25',
            $distanceKm <= 7 => '25 - 40',
            $distanceKm <= 15 => '40 - 60',
            default => '60 - 90',
        };

        $couriers = [
            [
                'company'         => 'GrabExpress',
                'courier_code'    => 'grab',
                'courier_service' => 'Instant',
                'service_type'    => 'instant',
                'price'           => max(12000, (int) round($distanceKm * 2500)),
                'etd'             => "$estimatedMinutes menit",
            ],
            [
                'company'         => 'GoSend',
                'courier_code'    => 'gojek',
                'courier_service' => 'Instant',
                'service_type'    => 'instant',
                'price'           => max(10000, (int) round($distanceKm * 2200)),
                'etd'             => "$estimatedMinutes menit",
            ],
            [
                'company'         => 'Maxim',
                'courier_code'    => 'maxim',
                'courier_service' => 'Instant',
                'service_type'    => 'instant',
                'price'           => max(9000, (int) round($distanceKm * 2000)),
                'etd'             => "$estimatedMinutes menit",
            ],
        ];

        return [
            'pricing'     => $couriers,
            'distance_km' => $distanceKm,
        ];
    }

    public function requestCancellation(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required|string|max:255',
        ]);

        try {
            $order = $this->customerOrderService->requestCancellation(
                $request->user(),
                $id,
                $request->reason
            );

            return $this->successResponse(
                new OrderResource($order),
                'Permintaan pembatalan berhasil dikirim'
            );
        } catch (\Exception $e) {
            $code = $e->getCode() >= 400 && $e->getCode() <= 500
                ? $e->getCode() : 422;
            return $this->errorResponse($e->getMessage(), $code);
        }
    }
    public function confirmReceived(Request $request, $id)
    {
        try {
            $order = $this->customerOrderService->confirmReceived(
                $request->user(),
                $id
            );

            return $this->successResponse(
                new OrderResource($order),
                'Pesanan berhasil dikonfirmasi diterima'
            );
        } catch (\Exception $e) {
            $code = $e->getCode() >= 400 && $e->getCode() <= 500
                ? $e->getCode() : 422;
            return $this->errorResponse($e->getMessage(), $code);
        }
    }
}
