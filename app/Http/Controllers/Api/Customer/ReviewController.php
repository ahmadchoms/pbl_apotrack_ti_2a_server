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

class ReviewController extends BaseApiController
{
    public function index($medicineId)
    {
        $medicine = Medicine::findOrFail($medicineId);

        $reviews = Review::with(['user:id,username,avatar_url'])
            ->where('medicine_id', $medicine->id)
            ->where('is_visible', true)
            ->latest()
            ->paginate(10);

        $averageRating = Review::where('medicine_id', $medicine->id)
            ->where('is_visible', true)
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

    public function store(StoreReviewRequest $request)
    {
        try {
            $user = $request->user();
            $medicineId = $request->medicine_id;

            // Delegasikan pengecekan otorisasi ke ReviewPolicy
            if ($user->cannot('create', [Review::class, (int) $medicineId])) {
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

            return $this->successResponse(new ReviewResource($review->load('user')), 'Ulasan berhasil dikirim.', 201);
            
        } catch (\Exception $e) {
            Log::error('Gagal membuat review: ' . $e->getMessage());
            return $this->errorResponse('Terjadi kesalahan saat memproses ulasan. Silakan coba lagi.', 500);
        }
    }
}
