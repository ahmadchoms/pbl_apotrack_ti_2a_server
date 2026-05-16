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
        $categories = MedicineCategory::select('id', 'name', 'description')
            ->orderBy('name')
            ->get();

        return $this->successResponse($categories, 'Daftar kategori obat berhasil diambil');
    }
}
