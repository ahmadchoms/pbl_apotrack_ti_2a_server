<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseApiController;
use App\Services\Api\CustomerOrderService;
use App\Http\Requests\Api\Customer\StoreCustomerOrderRequest;
use App\Http\Requests\Api\Customer\UploadPrescriptionRequest;
use App\Http\Resources\Api\OrderResource;
use App\Http\Resources\Api\DeliveryTrackingResource;
use Illuminate\Http\Request;
use App\Exceptions\InsufficientStockException;
use Illuminate\Support\Facades\Log;

class OrderController extends BaseApiController
{
    public function __construct(
        protected CustomerOrderService $customerOrderService
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
                $request->user(), $id
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
