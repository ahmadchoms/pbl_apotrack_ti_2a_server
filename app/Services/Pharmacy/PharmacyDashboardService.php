<?php

namespace App\Services\Pharmacy;

use App\Models\Medicine;
use App\Models\MedicineBatch;
use App\Models\Order;
use App\Models\Prescription;
use Illuminate\Support\Facades\DB;

class PharmacyDashboardService
{
    public function getDashboardData(string $pharmacyId)
    {
        $totalOrders = Order::where('pharmacy_id', $pharmacyId)->count();
        $totalMedicines = Medicine::where('pharmacy_id', $pharmacyId)->count();
        
        $criticalStocks = $this->getCriticalStocks($pharmacyId);
        
        $prescriptionQueue = Prescription::whereHas('order', fn($q) => $q->where('pharmacy_id', $pharmacyId))
            ->where('status', 'PENDING')
            ->count();

        $totalRevenue = Order::where('pharmacy_id', $pharmacyId)
            ->where('order_status', 'COMPLETED')
            ->sum('grand_total');

        return [
            'totalOrders' => $totalOrders,
            'totalMedicines' => $totalMedicines,
            'criticalStocksCount' => $criticalStocks->count(),
            'prescriptionQueue' => $prescriptionQueue,
            'totalRevenue' => (float)$totalRevenue,
            'revenueData' => $this->getRevenueChartData($pharmacyId),
            'trendData' => $this->getOrderTrendData($pharmacyId),
            'userActivities' => $this->getRecentActivities($pharmacyId),
            'criticalStocks' => $criticalStocks,
        ];
    }

    protected function getCriticalStocks(string $pharmacyId)
    {
        return MedicineBatch::whereHas('medicine', fn($q) => $q->where('pharmacy_id', $pharmacyId))
            ->with(['medicine.type'])
            ->where('stock', '<', 10)
            ->get()
            ->map(fn($batch) => [
                'id' => $batch->id,
                'name' => $batch->medicine->name ?? 'Unknown',
                'type' => $batch->medicine->type->name ?? 'Obat',
                'sisa' => $batch->stock,
                'critical' => $batch->stock < 5
            ]);
    }

    protected function getRevenueChartData(string $pharmacyId)
    {
        $revenueDataRaw = Order::where('pharmacy_id', $pharmacyId)
            ->where('order_status', 'COMPLETED')
            ->select(
                DB::raw("SUM(grand_total) as revenue"),
                DB::raw("COUNT(*) as orders"),
                DB::raw("EXTRACT(DOW FROM created_at) as day")
            )
            ->where('created_at', '>=', now()->subDays(7))
            ->groupBy('day')
            ->get();

        $daysMap = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];

        return collect(range(0, 6))->map(function ($day) use ($revenueDataRaw, $daysMap) {
            $stat = $revenueDataRaw->firstWhere('day', (string)$day) ?? $revenueDataRaw->firstWhere('day', $day);

            return [
                'name' => $daysMap[$day],
                'revenue' => $stat ? (float)$stat->revenue : 0,
                'orders' => $stat ? (int)$stat->orders : 0
            ];
        })->values();
    }

    protected function getOrderTrendData(string $pharmacyId)
    {
        $startOfMonth = now()->startOfMonth();
        $endOfMonth = now()->endOfMonth();

        // Calculate dates for week boundaries
        $week2Start = $startOfMonth->copy()->addDays(7);
        $week3Start = $startOfMonth->copy()->addDays(14);
        $week4Start = $startOfMonth->copy()->addDays(21);

        $data = Order::where('pharmacy_id', $pharmacyId)
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->select(
                DB::raw("CASE 
                    WHEN created_at < '{$week2Start->toDateTimeString()}' THEN 1
                    WHEN created_at < '{$week3Start->toDateTimeString()}' THEN 2
                    WHEN created_at < '{$week4Start->toDateTimeString()}' THEN 3
                    ELSE 4
                END as week_number"),
                DB::raw("COUNT(*) as count")
            )
            ->groupBy('week_number')
            ->get();

        return collect([1, 2, 3, 4])->map(function ($weekNum) use ($data) {
            $stat = $data->firstWhere('week_number', $weekNum);
            return [
                'week' => "Minggu $weekNum",
                'pesanan' => $stat ? (int)$stat->count : 0
            ];
        })->values();
    }

    protected function getRecentActivities(string $pharmacyId)
    {
        return Order::with('user')
            ->where('pharmacy_id', $pharmacyId)
            ->latest()
            ->take(6)
            ->get()
            ->map(fn($order) => [
                'id' => $order->id,
                'name' => $order->user->username ?? 'Guest',
                'status' => $order->created_at ? $order->created_at->diffForHumans() : 'Baru saja',
                'amount' => 'Rp ' . number_format($order->grand_total, 0, ',', '.'),
                'avatar' => strtoupper(substr($order->user->username ?? 'GU', 0, 2))
            ]);
    }
}
