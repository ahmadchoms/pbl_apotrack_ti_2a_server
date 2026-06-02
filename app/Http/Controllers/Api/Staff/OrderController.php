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

    /**
     * @OA\Post(
     *     path="/api/staff/orders/{id}/ship",
     *     summary="Minta penjemputan paket kurir (Biteship)",
     *     description="Membuat pesanan pengiriman (pickup request) ke Biteship untuk pesanan dengan layanan DELIVERY yang sudah siap dikirim.",
     *     operationId="staffShipOrder",
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
     *         description="Data kurir pengiriman",
     *         @OA\JsonContent(
     *             required={"courier_code", "courier_service"},
     *             @OA\Property(property="courier_code", type="string", example="jne"),
     *             @OA\Property(property="courier_service", type="string", example="reg")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Permintaan pickup berhasil dikirim ke Biteship",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Permintaan pengiriman berhasil dikirim ke Biteship"),
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
     *         description="Gagal memproses pengiriman (misal: Biteship API error atau pesanan belum lunas)",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Gagal memproses pengiriman: Kurir tidak tersedia.")
     *         )
     *     )
     * )
     */
    public function shipOrder(ShipOrderRequest $request, $id)
    {
        try {
            $order = $this->staffOrderService->shipOrder($request->user(), $id, $request->validated());

            AuditHelper::log(
                'SHIP_ORDER',
                "Mengatur pengiriman pesanan {$order->order_number} melalui Biteship.",
                ['order_id' => $order->id, 'courier' => $request->courier_code]
            );

            return $this->successResponse(new OrderResource($order), 'Permintaan pengiriman berhasil dikirim ke Biteship');
        } catch (\Exception $e) {
            $code = $e->getCode() >= 400 && $e->getCode() <= 500 ? $e->getCode() : 422;
            return $this->errorResponse('Gagal memproses pengiriman: ' . $e->getMessage(), $code);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/staff/orders",
     *     summary="Daftar pesanan apotek (Staff)",
     *     description="Mengambil daftar pesanan yang masuk ke apotek tempat staf bekerja. Mendukung filter status dan paginasi.",
     *     operationId="staffListOrders",
     *     tags={"Orders (Staff)"},
     *     security={{"sanctum": {}}},
     *
     *     @OA\Parameter(
     *         name="status",
     *         in="query",
     *         required=false,
     *         description="Filter berdasarkan status pesanan (contoh: PENDING, PROCESSING, SHIPPED, COMPLETED, CANCELLED)",
     *         @OA\Schema(type="string", example="PENDING")
     *     ),
     *     @OA\Parameter(
     *         name="page",
     *         in="query",
     *         required=false,
     *         description="Nomor halaman",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Daftar pesanan berhasil diambil",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Daftar pesanan apotek berhasil diambil"),
     *             @OA\Property(property="data", type="array", @OA\Items(type="object"))
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
     *         response=403,
     *         description="Staf tidak memiliki akses atau tidak aktif",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Anda tidak memiliki izin untuk mengakses apotek ini.")
     *         )
     *     )
     * )
     */
    public function index(Request $request)
    {
        try {
            $orders = $this->staffOrderService->listOrders($request->user(), $request->only('status'), 20);

            return $this->successResponse(OrderResource::collection($orders), 'Daftar pesanan apotek berhasil diambil');
        } catch (\Exception $e) {
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
        } catch (\Exception $e) {
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

            AuditHelper::log(
                'UPDATE_ORDER_STATUS',
                "Memperbarui status pesanan {$updatedOrder->order_number} menjadi {$request->status}.",
                ['order_id' => $updatedOrder->id, 'status' => $request->status]
            );

            return $this->successResponse(new OrderResource($updatedOrder), "Status pesanan berhasil diperbarui menjadi {$request->status}");
        } catch (\Exception $e) {
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
        } catch (\Exception $e) {
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
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    // ── TAMBAHAN BARU ─────────────────────────────────────────────

    public function approveCancellation(Request $request, $id)
    {
        try {
            $order = $this->staffOrderService->approveCancellation(
                $request->user(), $id
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
                $request->user(), $id
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