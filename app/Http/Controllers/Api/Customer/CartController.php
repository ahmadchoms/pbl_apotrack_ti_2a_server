<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Api\BaseApiController;
use App\Services\Api\CartService;
use App\Http\Requests\Api\Customer\StoreCartRequest;
use App\Http\Resources\Api\CartResource;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;

class CartController extends BaseApiController
{
    public function __construct(
        protected CartService $cartService
    ) {}

    /**
     * @OA\Get(
     *     path="/api/cart",
     *     summary="Lihat isi keranjang belanja Customer",
     *     description="Mengambil seluruh item obat yang ada di keranjang belanja pengguna saat ini beserta total harganya. Memerlukan token Sanctum.",
     *     operationId="getCart",
     *     tags={"Cart"},
     *     security={{"sanctum": {}}},
     *
     *     @OA\Response(
     *         response=200,
     *         description="Data keranjang berhasil diambil",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Data keranjang berhasil diambil"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(
     *                     property="pharmacy",
     *                     type="object",
     *                     @OA\Property(property="id", type="string", format="uuid", example="01932c91-5f00-7341-91a3-b9e7f02c8d1a"),
     *                     @OA\Property(property="name", type="string", example="Apotek Sehat Bahagia"),
     *                     @OA\Property(property="address", type="string", example="Jl. Merdeka No. 123")
     *                 ),
     *                 @OA\Property(
     *                     property="items",
     *                     type="array",
     *                     @OA\Items(
     *                         @OA\Property(property="id", type="string", format="uuid", example="019e2ac0-684e-7139-8cb9-c150e027c872"),
     *                         @OA\Property(property="medicine_id", type="string", format="uuid", example="019e2ac0-684e-7139-8cb9-c150e027c872"),
     *                         @OA\Property(property="name", type="string", example="Paracetamol 500mg"),
     *                         @OA\Property(property="quantity", type="integer", example=2),
     *                         @OA\Property(property="price", type="integer", example=5000),
     *                         @OA\Property(property="subtotal", type="integer", example=10000),
     *                         @OA\Property(property="image_url", type="string", example="https://example.com/medicine.jpg")
     *                     )
     *                 ),
     *                 @OA\Property(property="total_price", type="integer", example=10000)
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
        $cartData = $this->cartService->getCart($request->user());

        if (empty($cartData['items'])) {
            return $this->successResponse([
                'items' => [],
                'total_price' => 0,
            ], 'Keranjang kosong');
        }

        return $this->successResponse(new CartResource($cartData), 'Data keranjang berhasil diambil');
    }

    /**
     * @OA\Post(
     *     path="/api/cart/items",
     *     summary="Tambahkan item obat ke keranjang belanja",
     *     description="Menambahkan obat ke dalam keranjang. Jika keranjang sudah berisi obat dari apotek lain, sistem akan memvalidasi atau mengganti keranjang sesuai aturan bisnis.",
     *     operationId="addCartItem",
     *     tags={"Cart"},
     *     security={{"sanctum": {}}},
     *
     *     @OA\RequestBody(
     *         required=true,
     *         description="Data item obat yang ditambahkan",
     *         @OA\JsonContent(
     *             required={"pharmacy_id", "medicine_id", "quantity"},
     *             @OA\Property(property="pharmacy_id", type="string", format="uuid", example="01932c91-5f00-7341-91a3-b9e7f02c8d1a"),
     *             @OA\Property(property="medicine_id", type="string", format="uuid", example="019e2ac0-684e-7139-8cb9-c150e027c872"),
     *             @OA\Property(property="quantity", type="integer", minimum=1, example=2)
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Item berhasil ditambahkan",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Item berhasil ditambahkan ke keranjang"),
     *             @OA\Property(property="data", nullable=true)
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
     *         description="Validasi gagal (stok tidak cukup atau ID tidak valid)",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Stok obat tidak mencukupi.")
     *         )
     *     )
     * )
     */
    public function store(StoreCartRequest $request)
    {
        $this->cartService->addItem($request->user(), $request->validated());

        return $this->successResponse(null, 'Item berhasil ditambahkan ke keranjang');
    }

    /**
     * @OA\Delete(
     *     path="/api/cart/items/{id}",
     *     summary="Hapus item dari keranjang belanja",
     *     description="Menghapus item obat tertentu dari keranjang berdasarkan ID item keranjang (CartItem ID).",
     *     operationId="removeCartItem",
     *     tags={"Cart"},
     *     security={{"sanctum": {}}},
     *
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID item keranjang (CartItem UUID)",
     *         @OA\Schema(type="string", format="uuid", example="019e2ac0-684e-7139-8cb9-c150e027c872")
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Item berhasil dihapus",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Item berhasil dihapus dari keranjang"),
     *             @OA\Property(property="data", nullable=true)
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
     *         description="Item tidak ditemukan di keranjang",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Item keranjang tidak ditemukan.")
     *         )
     *     )
     * )
     */
    public function destroy(Request $request, $id)
    {
        try {
            $this->cartService->removeItem($request->user(), $id);

            return $this->successResponse(null, 'Item berhasil dihapus dari keranjang');
        } catch (\Exception $e) {
            $code = $e->getCode() >= 400 && $e->getCode() <= 500 ? $e->getCode() : 404;
            return $this->errorResponse($e->getMessage(), $code);
        }
    }
}
