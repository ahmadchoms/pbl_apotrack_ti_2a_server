<?php

namespace App\Services;

use App\Models\Medicine;
use App\Models\Order;
use App\Models\PharmacyStaff;

class PharmacyService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function getDashboardMetrics($pharmacyId)
    {
        return [
            'total_orders' => Order::where('pharmacy_id', $pharmacyId)->count(),
            'total_medicines' => Medicine::where('pharmacy_id', $pharmacyId)->count(),
            'total_revenue' => Order::where('pharmacy_id', $pharmacyId)
                ->where('payment_status', 'PAID')
                ->sum('grand_total'),
        ];
    }

    public function getStaffs($pharmacyId)
    {
        // Mengambil staff yang terhubung dengan apotek ini beserta profil user-nya
        return PharmacyStaff::with('user:id,full_name,email,phone,avatar_url,role,is_active')
            ->where('pharmacy_id', $pharmacyId)
            ->where('role', 'STAFF')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getOrders($pharmacyId)
    {
        return Order::with([
            'user:id,full_name,email,phone',
            'items',
            'tracking',
            'prescription'
        ])
            ->where('pharmacy_id', $pharmacyId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    // Mengambil data obat lengkap
    public function getMedicines($pharmacyId)
    {
        return Medicine::with([
            'category',
            'unit',
            'form',
            'images',
            'batches'
        ])
            ->where('pharmacy_id', $pharmacyId)
            ->get();
    }
}
