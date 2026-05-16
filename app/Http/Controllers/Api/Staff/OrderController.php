<?php

namespace App\Http\Controllers\Api\Staff;

use App\Http\Controllers\Api\BaseApiController;
use App\Services\Api\StaffOrderService;
use App\Http\Requests\Api\Staff\ShipOrderRequest;
use App\Http\Requests\Api\Staff\UpdateOrderStatusRequest;
use App\Http\Requests\Api\Staff\VerifyOrderRequest;
use App\Http\Requests\Api\Staff\StorePOSOrderRequest;
use App\Http\Resources\Api\OrderResource;
use Illuminate\Http\Request;

class OrderController extends BaseApiController
{
    public function __construct(
        protected StaffOrderService $staffOrderService
    ) {}

    public function shipOrder(ShipOrderRequest $request, $id)
    {
        try {
            $order = $this->staffOrderService->shipOrder($request->user(), $id, $request->validated());

            return $this->successResponse(new OrderResource($order), 'Permintaan pengiriman berhasil dikirim ke Biteship');
        } catch (\Exception $e) {
            $code = $e->getCode() >= 400 && $e->getCode() <= 500 ? $e->getCode() : 422;
            return $this->errorResponse('Gagal memproses pengiriman: ' . $e->getMessage(), $code);
        }
    }

    public function index(Request $request)
    {
        try {
            $orders = $this->staffOrderService->listOrders($request->user(), $request->only('status'), 20);

            return $this->successResponse(OrderResource::collection($orders), 'Daftar pesanan apotek berhasil diambil');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 403);
        }
    }

    public function show(Request $request, $id)
    {
        try {
            $order = $this->staffOrderService->showOrder($request->user(), $id);

            return $this->successResponse(new OrderResource($order), 'Detail pesanan berhasil diambil');
        } catch (\Exception $e) {
            return $this->errorResponse('Pesanan tidak ditemukan di apotek ini.', 404);
        }
    }

    public function updateStatus(UpdateOrderStatusRequest $request, $id)
    {
        try {
            $updatedOrder = $this->staffOrderService->updateStatus(
                $request->user(),
                $id,
                $request->status,
                $request->note
            );

            return $this->successResponse(new OrderResource($updatedOrder), "Status pesanan berhasil diperbarui menjadi {$request->status}");
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    public function verify(VerifyOrderRequest $request)
    {
        try {
            $order = $this->staffOrderService->verifyOrder($request->user(), $request->verification_code);

            return $this->successResponse(new OrderResource($order), 'Kode verifikasi valid');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 404);
        }
    }

    public function storePOS(StorePOSOrderRequest $request)
    {
        try {
            $order = $this->staffOrderService->storePOS($request->user(), $request->validated());

            return $this->successResponse(new OrderResource($order->load('items')), 'Pesanan kasir berhasil dibuat', 201);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }
}
