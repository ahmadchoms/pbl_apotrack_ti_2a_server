<?php

namespace App\Http\Controllers\Pharmacy;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\Medicine;
use App\Models\MedicineBatch;
use App\Models\Pharmacy;
use App\Models\Prescription;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        // Default to a temporary pharmacy_id if auth is not fully hooked up
        $pharmacyId = request()->user()->pharmacy_staff->pharmacy_id ?? Pharmacy::first()->id ?? 1;

        $totalOrders = Order::where('pharmacy_id', $pharmacyId)->count();

        $totalMedicines = Medicine::where('pharmacy_id', $pharmacyId)->count();
        $criticalStocks = MedicineBatch::whereHas('medicine', fn($q) => $q->where('pharmacy_id', $pharmacyId))
            ->where('stock', '<', 10)
            ->get()
            ->map(function ($batch) {
                return [
                    'id' => $batch->id,
                    'name' => $batch->medicine->name ?? 'Unknown',
                    'type' => $batch->medicine->type->name ?? 'Obat',
                    'sisa' => $batch->stock,
                    'critical' => $batch->stock < 5
                ];
            });

        $prescriptionQueue = Prescription::whereHas('order', fn($q) => $q->where('pharmacy_id', $pharmacyId))
            ->where('status', 'PENDING')
            ->count();

        $totalRevenue = Order::where('pharmacy_id', $pharmacyId)
            ->where('order_status', 'COMPLETED')
            ->sum('grand_total');

        // Revenue Chart (Day of week)
        $dbDriver = DB::connection()->getDriverName();
        if ($dbDriver === 'sqlite') {
            $dayOfWeekQuery = "strftime('%w', created_at)";
            // sqlite: 0=Sun, 1=Mon, etc. Maps roughly.
        } else {
            $dayOfWeekQuery = "DAYOFWEEK(created_at)";
            // mysql: 1=Sun, 2=Mon
        }

        $revenueDataRaw = Order::where('pharmacy_id', $pharmacyId)
            ->where('order_status', 'COMPLETED')
            ->select(
                DB::raw("SUM(grand_total) as revenue"),
                DB::raw("COUNT(*) as orders"),
                DB::raw("EXTRACT(DOW FROM created_at) as day") // 0=Sun, 1=Mon... 6=Sat
            )
            ->where('created_at', '>=', now()->subDays(7))
            ->groupBy('day')
            ->get();

        $daysMap = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];

        $revenueData = collect(range(0, 6))->map(function ($day) use ($revenueDataRaw, $daysMap) {
            // Check for both string and integer formats just in case PDO casting varies
            $stat = $revenueDataRaw->firstWhere('day', (string)$day) ?? $revenueDataRaw->firstWhere('day', $day);

            return [
                'name' => $daysMap[$day],
                'revenue' => $stat ? (float)$stat->revenue : 0,
                'orders' => $stat ? (int)$stat->orders : 0
            ];
        })->values();

        // Order Trend logic (Week of month)
        $trendData = collect([
            ['week' => 'Minggu 1', 'pesanan' => Order::where('pharmacy_id', $pharmacyId)->whereBetween('created_at', [now()->startOfMonth(), now()->startOfMonth()->addDays(7)])->count()],
            ['week' => 'Minggu 2', 'pesanan' => Order::where('pharmacy_id', $pharmacyId)->whereBetween('created_at', [now()->startOfMonth()->addDays(7), now()->startOfMonth()->addDays(14)])->count()],
            ['week' => 'Minggu 3', 'pesanan' => Order::where('pharmacy_id', $pharmacyId)->whereBetween('created_at', [now()->startOfMonth()->addDays(14), now()->startOfMonth()->addDays(21)])->count()],
            ['week' => 'Minggu 4', 'pesanan' => Order::where('pharmacy_id', $pharmacyId)->whereBetween('created_at', [now()->startOfMonth()->addDays(21), now()->endOfMonth()])->count()],
        ]);

        // User Activities (Recent orders)
        $userActivities = Order::with('user')
            ->where('pharmacy_id', $pharmacyId)
            ->latest()
            ->take(6)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'name' => $order->user->full_name ?? 'Guest',
                    'status' => $order->created_at ? $order->created_at->diffForHumans() : 'Baru saja',
                    'amount' => 'Rp ' . number_format($order->grand_total, 0, ',', '.'),
                    'avatar' => strtoupper(substr($order->user->full_name ?? 'GU', 0, 2))
                ];
            });

        return Inertia::render('pharmacy/dashboard', [
            'totalOrders' => $totalOrders,
            'totalMedicines' => $totalMedicines,
            'criticalStocksCount' => $criticalStocks->count(),
            'prescriptionQueue' => $prescriptionQueue,
            'totalRevenue' => $totalRevenue,
            'revenueData' => $revenueData,
            'trendData' => $trendData,
            'userActivities' => $userActivities,
            'criticalStocks' => $criticalStocks
        ]);
    }
}
