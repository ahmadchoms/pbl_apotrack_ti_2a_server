<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\MedicineCategory;
use Illuminate\Http\Request;

class MedicineCategoryController extends BaseApiController
{
    /**
     * Get all medicine categories.
     */
    public function index(Request $request)
    {
        $categories = MedicineCategory::select('id', 'name')
            ->orderBy('name')
            ->get();

        return $this->successResponse($categories, 'Daftar kategori obat berhasil diambil');
    }

    /**
     * Get popular medicine categories based on purchase frequency.
     */
    public function popular(Request $request)
    {
        $popular = MedicineCategory::select('medicine_categories.id', 'medicine_categories.name')
            ->join('medicines', 'medicines.category_id', '=', 'medicine_categories.id')
            ->join('order_items', 'order_items.medicine_id', '=', 'medicines.id')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->selectRaw('SUM(order_items.quantity) as total_sold')
            ->where('orders.order_status', 'COMPLETED')
            ->groupBy('medicine_categories.id', 'medicine_categories.name')
            ->orderByDesc('total_sold')
            ->limit(4)
            ->get();

        if ($popular->isEmpty()) {
            // Fallback: get first 4 categories
            $popular = MedicineCategory::select('id', 'name')
                ->limit(4)
                ->get()
                ->map(function ($cat) {
                    $cat->total_sold = 0;
                    return $cat;
                });
        }

        return $this->successResponse($popular, 'Daftar kategori obat terpopuler berhasil diambil');
    }
}
