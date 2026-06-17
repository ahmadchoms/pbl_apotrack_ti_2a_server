<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Medicine;
use App\Http\Resources\Pharmacy\MedicineResource;
use Illuminate\Http\Request;

class MedicineController extends BaseApiController
{
    /**
     * Display a listing of medicines per pharmacy (Public Catalog).
     */
    public function index(Request $request)
    {
        $query = Medicine::with(['pharmacy:id,name,address', 'category:id,name', 'form:id,name', 'type:id,name', 'unit:id,name'])
            ->whereHas('pharmacy', function ($q) {
                $q->where('verification_status', 'VERIFIED');
            })
            ->whereHas('batches', function ($q) {
                $q->where('expired_date', '>=', now()->startOfDay())
                  ->where('stock', '>', 0);
            });

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('generic_name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->has('pharmacy_id')) {
            $query->where('pharmacy_id', $request->pharmacy_id);
        }

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('type_id')) {
            $query->where('type_id', $request->type_id);
        }

        if ($request->has('form_id')) {
            $query->where('form_id', $request->form_id);
        }

        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        $query->withSum(['batches as total_active_stock' => function ($sq) {
            $sq->where('expired_date', '>=', now()->startOfDay());
        }], 'stock');

        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');

        $allowedSorts = ['name', 'price', 'created_at'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder === 'asc' ? 'asc' : 'desc');
        }

        $medicines = $query->paginate($request->get('per_page', 15));

        return $this->successResponse(MedicineResource::collection($medicines), 'Katalog obat berhasil diambil');
    }

    /**
     * Display the specified medicine detail.
     */
    public function show($id)
    {
        $medicine = Medicine::with(['pharmacy:id,name,address,phone', 'category', 'form', 'type', 'unit', 'batches'])
            ->whereHas('pharmacy', function ($q) {
                $q->where('verification_status', 'VERIFIED');
            })
            ->whereHas('batches', function ($q) {
                $q->where('expired_date', '>=', now()->startOfDay())
                  ->where('stock', '>', 0);
            })
            ->withSum(['batches as total_active_stock' => function ($sq) {
                $sq->where('expired_date', '>=', now()->startOfDay());
            }], 'stock')
            ->findOrFail($id);

        return $this->successResponse(new MedicineResource($medicine), 'Detail obat berhasil diambil');
    }
}
