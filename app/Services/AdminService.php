<?php

namespace App\Services;

use App\Models\Pharmacy;
use App\Models\User;

class AdminService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function getDashboardMetrics()
    {
        return [
            'total_users' => User::count(),
            'total_pharmacies' => Pharmacy::count(),
        ];
    }

    public function getAllUsers()
    {
        // Mengambil data user beserta relasi alamat utamanya
        return User::with(['addresses' => function ($query) {
            $query->where('is_primary', true);
        }])->orderBy('created_at', 'desc')->get();
    }

    public function getAllPharmacies()
    {
        // Mengambil data apotek beserta jam operasional dan gambar utamanya
        return Pharmacy::with(['operatingHours', 'images' => function ($query) {
            $query->where('is_primary', true);
        }])->orderBy('created_at', 'desc')->get();
    }
}
