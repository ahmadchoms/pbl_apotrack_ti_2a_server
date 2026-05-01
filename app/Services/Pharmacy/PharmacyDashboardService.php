<?php

namespace App\Services\Pharmacy;

use App\Models\Medicine;
use App\Models\MedicineBatch;
use App\Models\Order;
use App\Models\PharmacyStaff;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;

class PharmacyDashboardService
{
    public function getDashboardData(string $pharmacyId)
    {
        // return Cache::tags(['pharmacy_dashboard', "pharmacy_{$pharmacyId}"])->remember("dashboard_data_{$pharmacyId}", now()->addMinutes(10), function () use ($pharmacyId) {
        return Cache::remember("dashboard_data_{$pharmacyId}", now()->addMinutes(10), function () use ($pharmacyId) {
            return [
                'kpi' => $this->getKpiStats($pharmacyId),
                'charts' => [
                    'revenue_trend' => $this->getRevenueTrend($pharmacyId),
                    'top_medicines' => $this->getTopMedicines($pharmacyId),
                ],
                'widgets' => [
                    'stock_alerts' => $this->getStockAlerts($pharmacyId),
                    'recent_orders' => $this->getRecentOrders($pharmacyId),
                ],
            ];
        });
    }

    protected function getKpiStats(string $pharmacyId)
    {
        $now = Carbon::now();

        $totalRevenueMonth = Order::where('pharmacy_id', $pharmacyId)
            ->where('order_status', 'COMPLETED')
            ->whereMonth('created_at', $now->month)
            ->whereYear('created_at', $now->year)
            ->sum('grand_total');

        $activeOrdersCount = Order::where('pharmacy_id', $pharmacyId)
            ->whereIn('order_status', ['PENDING', 'PROCESSING'])
            ->count();

        $totalMedicinesCount = Medicine::where('pharmacy_id', $pharmacyId)
            ->where('is_active', true)
            ->count();

        $totalStaffCount = PharmacyStaff::where('pharmacy_id', $pharmacyId)
            ->where('is_active', true)
            ->count();

        return [
            'total_revenue_month' => (float) $totalRevenueMonth,
            'active_orders_count' => $activeOrdersCount,
            'total_medicines_count' => $totalMedicinesCount,
            'total_staff_count' => $totalStaffCount,
        ];
    }

    protected function getRevenueTrend(string $pharmacyId)
    {
        $days = 30;
        $startDate = Carbon::now()->subDays($days - 1)->startOfDay();

        $revenueDataRaw = Order::where('pharmacy_id', $pharmacyId)
            ->where('order_status', 'COMPLETED')
            ->where('created_at', '>=', $startDate)
            ->select(
                DB::raw("DATE(created_at) as date"),
                DB::raw("SUM(grand_total) as revenue")
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $trend = [];
        for ($i = 0; $i < $days; $i++) {
            $date = $startDate->copy()->addDays($i)->toDateString();
            $stat = $revenueDataRaw->firstWhere('date', $date);

            $trend[] = [
                'date' => Carbon::parse($date)->format('d M'),
                'revenue' => $stat ? (float) $stat->revenue : 0,
            ];
        }

        return $trend;
    }

    protected function getTopMedicines(string $pharmacyId)
    {
        return DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('medicines', 'order_items.medicine_id', '=', 'medicines.id')
            ->where('orders.pharmacy_id', $pharmacyId)
            ->where('orders.order_status', 'COMPLETED')
            ->select(
                'medicines.name',
                DB::raw('SUM(order_items.quantity) as total_sold')
            )
            ->groupBy('medicines.id', 'medicines.name')
            ->orderByDesc('total_sold')
            ->limit(5)
            ->get()
            ->map(fn($item) => [
                'name' => $item->name,
                'value' => (int) $item->total_sold,
            ]);
    }

    protected function getStockAlerts(string $pharmacyId)
    {
        return MedicineBatch::whereHas('medicine', fn($q) => $q->where('pharmacy_id', $pharmacyId))
            ->with('medicine:id,name')
            ->where('stock', '<=', 15)
            ->orderBy('stock')
            ->limit(5)
            ->get()
            ->map(fn($batch) => [
                'medicine_name' => $batch->medicine->name,
                'batch_number' => $batch->batch_number,
                'stock' => $batch->stock,
                'status' => $batch->stock <= 5 ? 'Critical' : 'Low',
            ]);
    }

    protected function getRecentOrders(string $pharmacyId)
    {
        return Order::with('user:id,username')
            ->where('pharmacy_id', $pharmacyId)
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn($order) => [
                'id' => $order->id,
                'customer' => $order->user->username ?? 'Guest',
                'amount' => (float) $order->grand_total,
                'status' => $order->order_status,
                'time' => $order->created_at->diffForHumans(),
            ]);
    }
}
