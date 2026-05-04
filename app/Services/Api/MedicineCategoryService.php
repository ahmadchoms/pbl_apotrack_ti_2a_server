<?php

namespace App\Services\Api;

use App\Models\MedicineCategory;
use Illuminate\Support\Facades\Cache;

class MedicineCategoryService
{
    /**
     * Get all medicine categories with caching.
     */
    public function getAllCategories()
    {
        return Cache::remember('medicine_categories', 86400, function () {
            return MedicineCategory::select(['id', 'name'])->orderBy('name')->get();
        });
    }
}
