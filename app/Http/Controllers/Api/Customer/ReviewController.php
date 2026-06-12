<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Medicine;
use App\Models\Review;
use App\Models\Order;
use App\Models\OrderItem;
use App\Http\Requests\Api\Customer\StoreReviewRequest;
use App\Http\Resources\Api\ReviewResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use OpenApi\Annotations as OA;

class ReviewController extends BaseApiController
{
    /**
     * @OA\Get(
     *     path="/api/medicines/{medicineId}/reviews",
     *     summary="Daftar ulasan untuk suatu obat",
     *     description="Mengambil daftar ulasan beserta informasi pengguna dan rating rata-rata untuk obat tertentu. Endpoint ini bersifat publik dan tidak memerlukan autentikasi.",
     *     operationId="getReviews",
     *     tags={"Reviews (Public)"},
     *
     *     @OA\Parameter(
     *         name="medicineId",
     *         in="path",
     *         required=true,
     *         description="ID unik obat (UUID)",
     *         @OA\Schema(type="string", format="uuid", example="019e2ac0-684e-7139-8cb9-c150e027c872")
     *     ),
     *     @OA\Parameter(
     *         name="page",
     *         in="query",
     *         required=false,
     *         description="Nomor halaman (pagination, 10 item per halaman)",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Daftar ulasan berhasil diambil",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Daftar ulasan berhasil diambil."),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="id", type="string", format="uuid", example="01932c91-5f00-7341-91a3-b9e7f02c8d1a"),
     *                     @OA\Property(property="rating", type="integer", example=5),
     *                     @OA\Property(property="comment", type="string", example="Obatnya ampuh, pengiriman cepat!"),
     *                     @OA\Property(property="created_at", type="string", format="date-time", example="2025-05-10T09:30:00.000000Z"),
     *                     @OA\Property(
     *                         property="user",
     *                         type="object",
     *                         @OA\Property(property="id", type="string", format="uuid"),
     *                         @OA\Property(property="username", type="string", example="budi_santoso"),
     *                         @OA\Property(property="avatar_url", type="string", nullable=true, example="https://example.com/avatars/budi.jpg")
     *                     )
     *                 )
     *             ),
     *             @OA\Property(
     *                 property="meta",
     *                 type="object",
     *                 @OA\Property(property="average_rating", type="number", format="float", example=4.5),
     *                 @OA\Property(property="total_reviews", type="integer", example=24)
     *             ),
     *             @OA\Property(
     *                 property="pagination",
     *                 type="object",
     *                 @OA\Property(property="current_page", type="integer", example=1),
     *                 @OA\Property(property="last_page", type="integer", example=3),
     *                 @OA\Property(property="per_page", type="integer", example=10),
     *                 @OA\Property(property="total", type="integer", example=24)
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Obat tidak ditemukan",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="No query results for model [App\\Models\\Medicine].")
     *         )
     *     )
     * )
     */
    public function index($medicineId)
    {
        $medicine = Medicine::findOrFail($medicineId);

        $reviews = Review::with(['user:id,username,avatar_url'])
            ->where('medicine_id', $medicine->id)
            ->whereRaw('is_visible IS TRUE')
            ->latest()
            ->paginate(10);

        $averageRating = Review::where('medicine_id', $medicine->id)
            ->whereRaw('is_visible IS TRUE')
            ->avg('rating');

        return $this->successResponse(
            ReviewResource::collection($reviews),
            'Daftar ulasan berhasil diambil.',
            200,
            [
                'average_rating' => round($averageRating ?? 0, 1),
                'total_reviews' => $reviews->total(),
            ]
        );
    }

    /**
     * @OA\Post(
     *     path="/api/reviews",
     *     summary="Kirim ulasan untuk obat yang telah dibeli",
     *     description="Customer dapat mengirim ulasan hanya jika memiliki pesanan dengan status COMPLETED yang mengandung obat tersebut dan belum pernah diulas sebelumnya.",
     *     operationId="storeReview",
     *     tags={"Reviews (Customer)"},
     *     security={{"sanctum": {}}},
     *
     *     @OA\RequestBody(
     *         required=true,
     *         description="Data ulasan yang akan dikirimkan",
     *         @OA\JsonContent(
     *             required={"medicine_id", "rating"},
     *             @OA\Property(
     *                 property="medicine_id",
     *                 type="string",
     *                 format="uuid",
     *                 description="ID obat yang akan diulas",
     *                 example="019e2ac0-684e-7139-8cb9-c150e027c872"
     *             ),
     *             @OA\Property(
     *                 property="rating",
     *                 type="integer",
     *                 description="Rating 1 (sangat buruk) hingga 5 (sangat baik)",
     *                 minimum=1,
     *                 maximum=5,
     *                 example=5
     *             ),
     *             @OA\Property(
     *                 property="comment",
     *                 type="string",
     *                 nullable=true,
     *                 description="Komentar opsional (maksimal 1000 karakter)",
     *                 example="Obatnya sangat efektif dan pengirimannya cepat!"
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=201,
     *         description="Ulasan berhasil dikirim",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Ulasan berhasil dikirim."),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="string", format="uuid", example="01932c91-5f00-7341-91a3-b9e7f02c8d1a"),
     *                 @OA\Property(property="rating", type="integer", example=5),
     *                 @OA\Property(property="comment", type="string", example="Obatnya sangat efektif!"),
     *                 @OA\Property(property="created_at", type="string", format="date-time"),
     *                 @OA\Property(
     *                     property="user",
     *                     type="object",
     *                     @OA\Property(property="id", type="string", format="uuid"),
     *                     @OA\Property(property="username", type="string", example="budi_santoso"),
     *                     @OA\Property(property="avatar_url", type="string", nullable=true)
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Tidak terautentikasi — token Sanctum tidak valid atau tidak disertakan",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Unauthenticated.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Tidak berhak memberikan ulasan — belum pernah membeli obat ini dengan status COMPLETED atau sudah mengulas semua pembelian",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Anda belum pernah membeli obat ini dengan status selesai (COMPLETED) atau sudah mengulas seluruh pembelian Anda.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validasi gagal — data yang dikirim tidak sesuai aturan",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="The rating field is required."),
     *             @OA\Property(
     *                 property="errors",
     *                 type="object",
     *                 @OA\Property(
     *                     property="rating",
     *                     type="array",
     *                     @OA\Items(type="string", example="The rating field is required.")
     *                 ),
     *                 @OA\Property(
     *                     property="medicine_id",
     *                     type="array",
     *                     @OA\Items(type="string", example="The selected medicine id is invalid.")
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function store(StoreReviewRequest $request)
    {
        try {
            $user = $request->user();
            $medicineId = $request->medicine_id;

            // Delegasikan pengecekan otorisasi ke ReviewPolicy
            if ($user->cannot('create', [Review::class, $medicineId])) {
                return $this->errorResponse('Anda belum pernah membeli obat ini dengan status selesai (COMPLETED) atau sudah mengulas seluruh pembelian Anda.', 403);
            }

            $completedOrdersWithMedicine = OrderItem::whereHas('order', function ($query) use ($user) {
                $query->where('user_id', $user->id)
                      ->where('order_status', 'COMPLETED');
            })
            ->where('medicine_id', $medicineId)
            ->pluck('order_id');

            $reviewedOrderIds = Review::whereIn('order_id', $completedOrdersWithMedicine)
                ->where('medicine_id', $medicineId)
                ->pluck('order_id');

            $availableOrderId = $completedOrdersWithMedicine->diff($reviewedOrderIds)->first();

            $order = Order::find($availableOrderId);

            $review = Review::create([
                'user_id' => $user->id,
                'pharmacy_id' => $order->pharmacy_id,
                'order_id' => $order->id,
                'medicine_id' => $medicineId,
                'rating' => $request->rating,
                'comment' => $request->comment,
            ]);

            $order->pharmacy->recalculateRating();

            return $this->successResponse(new ReviewResource($review->load('user')), 'Ulasan berhasil dikirim.', 201);
            
        } catch (\Exception $e) {
            Log::error('Gagal membuat review: ' . $e->getMessage());
            return $this->errorResponse('Terjadi kesalahan saat memproses ulasan. Silakan coba lagi.', 500);
        }
    }
}
