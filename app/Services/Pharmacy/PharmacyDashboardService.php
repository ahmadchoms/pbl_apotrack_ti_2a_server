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
        return collect([
            ['week' => 'Minggu 1', 'pesanan' => Order::where('pharmacy_id', $pharmacyId)->whereBetween('created_at', [now()->startOfMonth(), now()->startOfMonth()->addDays(7)])->count()],
            ['week' => 'Minggu 2', 'pesanan' => Order::where('pharmacy_id', $pharmacyId)->whereBetween('created_at', [now()->startOfMonth()->addDays(7), now()->startOfMonth()->addDays(14)])->count()],
            ['week' => 'Minggu 3', 'pesanan' => Order::where('pharmacy_id', $pharmacyId)->whereBetween('created_at', [now()->startOfMonth()->addDays(14), now()->startOfMonth()->addDays(21)])->count()],
            ['week' => 'Minggu 4', 'pesanan' => Order::where('pharmacy_id', $pharmacyId)->whereBetween('created_at', [now()->startOfMonth()->addDays(21), now()->endOfMonth()])->count()],
        ]);
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
