<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Api\BaseApiController;
use App\Services\Api\CustomerOrderService;
use App\Http\Requests\Api\Customer\StoreCustomerOrderRequest;
use App\Http\Requests\Api\Customer\UploadPrescriptionRequest;
use App\Http\Resources\Api\OrderResource;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;

class OrderController extends BaseApiController
{
    public function __construct(
        protected CustomerOrderService $orderService
    ) {}

    /**
     * @OA\Get(
     *     path="/api/orders",
     *     summary="Daftar pesanan aktif Customer",
     *     description="Mengambil daftar pesanan milik pengguna yang sedang login. Mendukung paginasi.",
     *     operationId="getCustomerOrders",
     *     tags={"Orders (Customer)"},
     *     security={{"sanctum": {}}},
     *
     *     @OA\Parameter(
     *         name="per_page",
     *         in="query",
     *         required=false,
     *         description="Jumlah item per halaman (default: 10)",
     *         @OA\Schema(type="integer", example=10)
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
     *             @OA\Property(property="message", type="string", example="Daftar pesanan aktif berhasil diambil"),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="id", type="string", format="uuid", example="019e2ac0-684e-7139-8cb9-c150e027c872"),
     *                     @OA\Property(property="invoice_number", type="string", example="INV/20260516/0001"),
     *                     @OA\Property(property="order_status", type="string", example="PENDING"),
     *                     @OA\Property(property="payment_status", type="string", example="UNPAID"),
     *                     @OA\Property(property="grand_total", type="integer", example=15000),
     *                     @OA\Property(property="service_type", type="string", example="PICKUP")
     *                 )
     *             ),
     *             @OA\Property(
     *                 property="meta",
     *                 type="object",
     *                 @OA\Property(property="current_page", type="integer", example=1),
     *                 @OA\Property(property="last_page", type="integer", example=5),
     *                 @OA\Property(property="per_page", type="integer", example=10),
     *                 @OA\Property(property="total", type="integer", example=50)
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Tidak terautentikasi",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Unauthenticated.")
     *         )
     *     )
     * )
     */
    public function index(Request $request)
    {
        $orders = $this->orderService->listOrders($request->user(), $request->query('per_page', 10));

        return $this->successResponse(OrderResource::collection($orders), 'Daftar pesanan aktif berhasil diambil');
    }

    /**
     * @OA\Get(
     *     path="/api/orders/history",
     *     summary="Riwayat pesanan selesai/batal Customer",
     *     description="Mengambil daftar pesanan milik pengguna yang berstatus COMPLETED atau CANCELLED.",
     *     operationId="getCustomerOrderHistory",
     *     tags={"Orders (Customer)"},
     *     security={{"sanctum": {}}},
     *
     *     @OA\Parameter(
     *         name="per_page",
     *         in="query",
     *         required=false,
     *         description="Jumlah item per halaman (default: 15)",
     *         @OA\Schema(type="integer", example=15)
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
     *         description="Riwayat pesanan berhasil diambil",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Riwayat pesanan berhasil diambil"),
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
     *     )
     * )
     */
    public function history(Request $request)
    {
        $orders = $this->orderService->listHistory($request->user(), $request->query('per_page', 15));

        return $this->successResponse(OrderResource::collection($orders), 'Riwayat pesanan berhasil diambil');
    }

    /**
     * @OA\Post(
     *     path="/api/orders",
     *     summary="Buat pesanan baru (Checkout)",
     *     description="Membuat pesanan baru dari item keranjang.",
     *     operationId="createCustomerOrder",
     *     tags={"Orders (Customer)"},
     *     security={{"sanctum": {}}},
     *
     *     @OA\RequestBody(
     *         required=true,
     *         description="Data lengkap pesanan/checkout",
     *         @OA\JsonContent(
     *             required={"pharmacy_id", "items", "subtotal_amount", "service_type", "payment_method"},
     *             @OA\Property(property="pharmacy_id", type="string", format="uuid", example="01932c91-5f00-7341-91a3-b9e7f02c8d1a"),
     *             @OA\Property(
     *                 property="items",
     *                 type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="id", type="string", format="uuid", example="019e2ac0-684e-7139-8cb9-c150e027c872"),
     *                     @OA\Property(property="quantity", type="integer", example=2),
     *                     @OA\Property(property="price", type="integer", example=5000)
     *                 )
     *             ),
     *             @OA\Property(property="subtotal_amount", type="integer", example=10000),
     *             @OA\Property(property="service_type", type="string", enum={"PICK_UP", "DELIVERY"}, example="PICK_UP"),
     *             @OA\Property(property="payment_method", type="string", enum={"CASH", "TRANSFER", "E-WALLET"}, example="TRANSFER"),
     *             @OA\Property(property="address_id", type="string", format="uuid", nullable=true, example="01932c91-5f00-7341-91a3-b9e7f02c8d1a"),
     *             @OA\Property(property="courier_code", type="string", nullable=true, example="jne"),
     *             @OA\Property(property="courier_service", type="string", nullable=true, example="reg"),
     *             @OA\Property(property="shipping_cost", type="integer", example=15000),
     *             @OA\Property(property="notes", type="string", nullable=true, example="Tolong dibungkus rapi")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=201,
     *         description="Pesanan berhasil dibuat",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Pesanan berhasil dibuat"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="string", format="uuid", example="019e2ac0-684e-7139-8cb9-c150e027c872"),
     *                 @OA\Property(property="invoice_number", type="string", example="INV/20260516/0001"),
     *                 @OA\Property(property="grand_total", type="integer", example=25000)
     *             )
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
     *         description="Validasi gagal",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Validasi gagal.")
     *         )
     *     )
     * )
     */
    public function store(StoreCustomerOrderRequest $request)
    {
        $order = $this->orderService->storeOrder($request->user(), $request->validated());

        return $this->successResponse(new OrderResource($order), 'Pesanan berhasil dibuat', 201);
    }

    /**
     * @OA\Get(
     *     path="/api/orders/{id}",
     *     summary="Detail pesanan Customer",
     *     description="Mengambil detail pesanan lengkap beserta item obat, status log, dan informasi resep jika ada.",
     *     operationId="getCustomerOrderById",
     *     tags={"Orders (Customer)"},
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
     *         description="Pesanan tidak ditemukan",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="No query results for model [App\\Models\\Order].")
     *         )
     *     )
     * )
     */
    public function show(Request $request, $id)
    {
        $order = $this->orderService->showOrder($request->user(), $id);

        return $this->successResponse(new OrderResource($order), 'Detail pesanan berhasil diambil');
    }

    /**
     * @OA\Post(
     *     path="/api/orders/{id}/prescription",
     *     summary="Unggah foto resep dokter",
     *     description="Mengunggah file gambar resep dokter untuk pesanan obat keras. Menggunakan format multipart/form-data.",
     *     operationId="uploadPrescription",
     *     tags={"Orders (Customer)"},
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
     *         description="File gambar resep dokter (jpg/png, maks 5MB)",
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"prescription_image"},
     *                 @OA\Property(property="prescription_image", type="string", format="binary", description="File gambar resep")
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=201,
     *         description="Resep berhasil diunggah",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Resep dokter berhasil diunggah dan sedang diproses"),
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
     *         description="Validasi file gagal (bukan gambar atau terlalu besar)",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="The prescription image must be an image.")
     *         )
     *     )
     * )
     */
    public function uploadPrescription(UploadPrescriptionRequest $request, $id)
    {
        $prescription = $this->orderService->uploadPrescription($request->user(), $id, $request->file('prescription_image'));

        return $this->successResponse($prescription, 'Resep dokter berhasil diunggah dan sedang diproses', 201);
    }

    /**
     * @OA\Post(
     *     path="/api/orders/{id}/simulate-payment",
     *     summary="Simulasi pembayaran lunas (QRIS/Transfer)",
     *     description="Mengubah status pembayaran pesanan menjadi PAID secara instan untuk keperluan simulasi/testing.",
     *     operationId="simulatePayment",
     *     tags={"Orders (Customer)"},
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
     *         description="Simulasi pembayaran berhasil",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Simulasi pembayaran berhasil, pesanan lunas"),
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
     *         description="Pesanan sudah dibayar sebelumnya",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Pesanan ini sudah dibayar atau status tidak valid.")
     *         )
     *     )
     * )
     */
    public function simulatePayment(Request $request, $id)
    {
        try {
            $order = $this->orderService->simulatePayment($request->user(), $id);

            return $this->successResponse(new OrderResource($order), 'Simulasi pembayaran berhasil, pesanan lunas');
        } catch (\Exception $e) {
            $code = $e->getCode() >= 400 && $e->getCode() <= 500 ? $e->getCode() : 422;
            return $this->errorResponse($e->getMessage(), $code);
        }
    }

    public function requestCancellation(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required|string|max:255',
        ]);

        try {
            $order = $this->orderService->requestCancellation(
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
}
