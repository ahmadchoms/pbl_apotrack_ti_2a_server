<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Api\MedicineCategoryService;
use Illuminate\Http\Request;

class MedicineCategoryController extends Controller
{
    public function __construct(
        protected MedicineCategoryService $categoryService
    ) {}

    /**
     * Get all medicine categories (Optimized with Caching).
     */
    public function index()
    {
        $categories = $this->categoryService->getAllCategories();

        return response()->json([
            'status' => 'success',
            'message' => 'Daftar kategori obat berhasil diambil',
            'data' => $categories,
        ]);
    }
}
