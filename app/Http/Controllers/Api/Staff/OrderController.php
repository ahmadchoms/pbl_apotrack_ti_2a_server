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
use OpenApi\Annotations as OA;
use App\Helpers\AuditHelper;

class OrderController extends BaseApiController
{
    public function __construct(
        protected StaffOrderService $staffOrderService
    ) {}

    public function index(Request $request)
    {
        try {
            $orders = $this->staffOrderService->listOrders($request->user(), $request->only('status'), 20);

            return $this->successResponse(OrderResource::collection($orders), 'Daftar pesanan apotek berhasil diambil');
        } catch (\Throwable $e) {
            return $this->errorResponse($e->getMessage(), 403);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/staff/orders/{id}",
     *     summary="Detail pesanan apotek (Staff)",
     *     description="Mengambil detail lengkap pesanan yang masuk ke apotek staf, termasuk item obat dan resep jika ada.",
     *     operationId="staffShowOrder",
     *     tags={"Orders (Staff)"},
     *     security={{"sanctum": {}}},
     *
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID pesanan (UUID)",
     *         @OA\Schema(type="string", format="uuid", example="019e2ac0-684e-7139-8cb9-c150e027c872")
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Detail pesanan berhasil diambil",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Detail pesanan berhasil diambil"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Tidak terautentikasi",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Unauthenticated.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Pesanan tidak ditemukan di apotek ini",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Pesanan tidak ditemukan di apotek ini.")
     *         )
     *     )
     * )
     */
    public function show(Request $request, $id)
    {
        try {
            $order = $this->staffOrderService->showOrder($request->user(), $id);

            return $this->successResponse(new OrderResource($order), 'Detail pesanan berhasil diambil');
        } catch (\Throwable $e) {
            return $this->errorResponse('Pesanan tidak ditemukan di apotek ini.', 404);
        }
    }

    /**
     * @OA\Patch(
     *     path="/api/staff/orders/{id}/status",
     *     summary="Perbarui status pesanan (Staff)",
     *     description="Mengubah status pesanan (misal: dari PENDING menjadi PROCESSING, atau COMPLETED).",
     *     operationId="staffUpdateOrderStatus",
     *     tags={"Orders (Staff)"},
     *     security={{"sanctum": {}}},
     *
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID pesanan (UUID)",
     *         @OA\Schema(type="string", format="uuid", example="019e2ac0-684e-7139-8cb9-c150e027c872")
     *     ),
     *
     *     @OA\RequestBody(
     *         required=true,
     *         description="Data status baru",
     *         @OA\JsonContent(
     *             required={"status"},
     *             @OA\Property(property="status", type="string", example="PROCESSING"),
     *             @OA\Property(property="note", type="string", nullable=true, example="Sedang disiapkan oleh apoteker")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Status pesanan berhasil diperbarui",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Status pesanan berhasil diperbarui menjadi PROCESSING"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Tidak terautentikasi",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Unauthenticated.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Transisi status tidak valid",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Status pesanan tidak dapat diubah ke PROCESSING.")
     *         )
     *     )
     * )
     */
    public function updateStatus(UpdateOrderStatusRequest $request, $id)
    {
        try {
            $updatedOrder = $this->staffOrderService->updateStatus(
                $request->user(),
                $id,
                $request->status,
                $request->note
            );

            $orderStatusEnum = \App\Enums\OrderStatus::from($updatedOrder->order_status);
            $statusLabel = $orderStatusEnum->label();

            AuditHelper::log(
                'UPDATE_ORDER_STATUS',
                "Staf memperbarui status pesanan nomor {$updatedOrder->order_number} menjadi '{$statusLabel}'.",
                [
                    'order_id' => $updatedOrder->id,
                    'status' => $orderStatusEnum->value
                ]
            );

            return $this->successResponse(
                new OrderResource($updatedOrder),
                "Status pesanan berhasil diperbarui menjadi '{$statusLabel}'."
            );
        } catch (\Throwable $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    /**
     * @OA\Post(
     *     path="/api/staff/orders/verify",
     *     summary="Verifikasi kode pengambilan/pickup (Staff)",
     *     description="Memverifikasi kode unik 6 digit yang dibawa oleh Customer saat mengambil obat di apotek (layanan PICK_UP).",
     *     operationId="staffVerifyOrder",
     *     tags={"Orders (Staff)"},
     *     security={{"sanctum": {}}},
     *
     *     @OA\RequestBody(
     *         required=true,
     *         description="Kode verifikasi pesanan",
     *         @OA\JsonContent(
     *             required={"verification_code"},
     *             @OA\Property(property="verification_code", type="string", example="ABC123")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Kode verifikasi valid",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Kode verifikasi valid"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Tidak terautentikasi",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Unauthenticated.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Kode verifikasi salah atau pesanan tidak ditemukan",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Kode verifikasi tidak valid atau pesanan tidak ditemukan.")
     *         )
     *     )
     * )
     */
    public function verify(VerifyOrderRequest $request)
    {
        try {
            $order = $this->staffOrderService->verifyOrder($request->user(), $request->verification_code);

            AuditHelper::log(
                'VERIFY_PRESCRIPTION',
                "Melakukan verifikasi pesanan/resep #{$order->id}.",
                ['order_id' => $order->id]
            );

            return $this->successResponse(new OrderResource($order), 'Kode verifikasi valid');
        } catch (\Throwable $e) {
            return $this->errorResponse($e->getMessage(), 404);
        }
    }

    /**
     * @OA\Post(
     *     path="/api/staff/pos/orders",
     *     summary="Transaksi kasir langsung / Point-of-Sale (POS)",
     *     description="Membuat pesanan baru secara langsung di kasir apotek (layanan POS). Mengurangi stok obat secara otomatis dan mencatat transaksi lunas.",
     *     operationId="staffStorePOS",
     *     tags={"POS"},
     *     security={{"sanctum": {}}},
     *
     *     @OA\RequestBody(
     *         required=true,
     *         description="Data transaksi POS kasir",
     *         @OA\JsonContent(
     *             required={"items", "total", "payment_method"},
     *             @OA\Property(
     *                 property="items",
     *                 type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="id", type="string", format="uuid", example="019e2ac0-684e-7139-8cb9-c150e027c872"),
     *                     @OA\Property(property="quantity", type="integer", example=1),
     *                     @OA\Property(property="price", type="integer", example=5000)
     *                 )
     *             ),
     *             @OA\Property(property="total", type="integer", example=5000),
     *             @OA\Property(property="payment_method", type="string", enum={"CASH", "QRIS", "DEBIT"}, example="CASH"),
     *             @OA\Property(property="user_id", type="string", format="uuid", nullable=true, example="01932c91-5f00-7341-91a3-b9e7f02c8d1a")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=201,
     *         description="Pesanan POS berhasil dibuat",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Pesanan kasir berhasil dibuat"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Tidak terautentikasi",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Unauthenticated.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validasi gagal (misal: stok tidak cukup)",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Stok obat tidak mencukupi untuk transaksi POS.")
     *         )
     *     )
     * )
     */
    public function storePOS(StorePOSOrderRequest $request)
    {
        try {
            $order = $this->staffOrderService->storePOS($request->user(), $request->validated());

            AuditHelper::log(
                'CREATE_POS_ORDER',
                "Membuat transaksi kasir langsung (POS) dengan invoice {$order->order_number}.",
                ['invoice' => $order->order_number, 'total' => $order->grand_total]
            );

            return $this->successResponse(new OrderResource($order->load('items')), 'Pesanan kasir berhasil dibuat', 201);
        } catch (\Throwable $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    public function approveCancellation(Request $request, $id)
    {
        try {
            $order = $this->staffOrderService->approveCancellation(
                $request->user(),
                $id
            );

            AuditHelper::log(
                'APPROVE_CANCELLATION',
                "Menyetujui pembatalan pesanan {$order->order_number}.",
                ['order_id' => $order->id]
            );

            return $this->successResponse(
                new OrderResource($order),
                'Pembatalan pesanan disetujui'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    public function rejectCancellation(Request $request, $id)
    {
        try {
            $order = $this->staffOrderService->rejectCancellation(
                $request->user(),
                $id
            );

            AuditHelper::log(
                'REJECT_CANCELLATION',
                "Menolak pembatalan pesanan {$order->order_number}.",
                ['order_id' => $order->id]
            );

            return $this->successResponse(
                new OrderResource($order),
                'Pembatalan pesanan ditolak'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }
}
