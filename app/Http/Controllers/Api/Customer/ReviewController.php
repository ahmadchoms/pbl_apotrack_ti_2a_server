<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Models\Medicine;
use App\Models\Review;
use App\Models\OrderItem;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Get reviews for a specific medicine (Public).
     */
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

        return response()->json([
            'status' => 'success',
            'message' => 'Daftar ulasan berhasil diambil.',
            'data' => $reviews->items(),
            'meta' => [
                'average_rating' => round($averageRating ?? 0, 1),
                'total_reviews' => $reviews->total(),
                'current_page' => $reviews->currentPage(),
                'last_page' => $reviews->lastPage(),
            ],
        ]);
    }

    /**
     * Submit a new review for a medicine.
     */
    public function store(Request $request)
    {
        $request->validate([
            'medicine_id' => 'required|exists:medicines,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        try {
            $user = $request->user();
            $medicineId = $request->medicine_id;

            // 1. Cari semua pesanan COMPLETED milik user yang berisi medicine_id ini
            $completedOrdersWithMedicine = OrderItem::whereHas('order', function ($query) use ($user) {
                $query->where('user_id', $user->id)
                      ->where('order_status', 'COMPLETED');
            })
            ->where('medicine_id', $medicineId)
            ->pluck('order_id');

            if ($completedOrdersWithMedicine->isEmpty()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Anda belum pernah membeli obat ini yang telah selesai (COMPLETED).',
                ], 403);
            }

            // 2. Cari order_id dari daftar di atas yang BELUM di-review untuk medicine_id ini
            $reviewedOrderIds = Review::whereIn('order_id', $completedOrdersWithMedicine)
                ->where('medicine_id', $medicineId)
                ->pluck('order_id');

            // Ambil order_id pertama yang belum di-review
            $availableOrderId = $completedOrdersWithMedicine->diff($reviewedOrderIds)->first();

            if (!$availableOrderId) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Anda sudah mengulas semua pembelian Anda untuk obat ini.',
                ], 403);
            }

            $order = Order::find($availableOrderId);

            // 3. Buat review
            $review = Review::create([
                'user_id' => $user->id,
                'pharmacy_id' => $order->pharmacy_id,
                'order_id' => $order->id,
                'medicine_id' => $medicineId,
                'rating' => $request->rating,
                'comment' => $request->comment,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Ulasan berhasil dikirim.',
                'data' => $review,
            ], 201);
            
        } catch (\Exception $e) {
            \Log::error('Gagal membuat review: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat memproses ulasan. Silakan coba lagi.',
            ], 500);
        }
    }
}
