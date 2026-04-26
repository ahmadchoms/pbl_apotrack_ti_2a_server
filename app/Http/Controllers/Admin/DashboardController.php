<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Pharmacy;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        // Use select and count for efficiency
        $totalUsers = User::count();
        $totalPharmacies = Pharmacy::count();
        $activePharmacies = Pharmacy::where('is_active', true)->count();

        // Calculate growth percentages
        $lastMonth = now()->subMonth();
        $lastMonthUsers = User::whereYear('created_at', $lastMonth->year)
            ->whereMonth('created_at', $lastMonth->month)
            ->count();
        $userGrowth = $lastMonthUsers > 0 ? (($totalUsers - $lastMonthUsers) / $lastMonthUsers) * 100 : 0;

        $activePharmacyPercentage = $totalPharmacies > 0 ? ($activePharmacies / $totalPharmacies) * 100 : 0;

        $monthsMapping = [1 => 'JAN', 2 => 'FEB', 3 => 'MAR', 4 => 'APR', 5 => 'MEI', 6 => 'JUN', 7 => 'JUL', 8 => 'AGU', 9 => 'SEP', 10 => 'OKT', 11 => 'NOV', 12 => 'DES'];

        $monthQuery = "EXTRACT(MONTH FROM created_at)";

        // Optimized data fetching for charts
        $userGrowthData = User::select(DB::raw("COUNT(*) as count"), DB::raw("$monthQuery as month"))
            ->whereYear('created_at', now()->year)
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $apotekGrowthData = Pharmacy::select(DB::raw("COUNT(*) as count"), DB::raw("$monthQuery as month"))
            ->whereYear('created_at', now()->year)
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Standardize time-series data
        $fullUserGrowth = collect(range(1, 12))->map(function($m) use ($monthsMapping, $userGrowthData) {
            $existing = $userGrowthData->firstWhere('month', str_pad($m, 2, '0', STR_PAD_LEFT)) 
                       ?? $userGrowthData->firstWhere('month', (int)$m);
            return [
                'name' => $monthsMapping[$m],
                'value' => $existing ? $existing->count : 0
            ];
        })->values();

        $fullApotekGrowth = collect(range(1, 12))->map(function($m) use ($monthsMapping, $apotekGrowthData) {
            $existing = $apotekGrowthData->firstWhere('month', str_pad($m, 2, '0', STR_PAD_LEFT))
                       ?? $apotekGrowthData->firstWhere('month', (int)$m);
            return [
                'name' => $monthsMapping[$m],
                'value' => $existing ? $existing->count : 0
            ];
        })->values();

        // Clean audit logs transformation
        $auditLogs = Pharmacy::select('id', 'name', 'created_at')
            ->latest()
            ->take(4)
            ->get()
            ->map(fn($p) => [
                'id' => $p->id,
                'title' => 'Pendaftaran Apotek',
                'desc' => "Node \"{$p->name}\" telah berhasil diverifikasi.",
                'time' => $p->created_at->diffForHumans(),
                'isNew' => $p->created_at->diffInHours(now()) < 24,
            ]);

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'userGrowth' => round($userGrowth, 1),
                'totalPharmacies' => $totalPharmacies,
                'activePharmacies' => $activePharmacies,
                'activePharmacyPercentage' => round($activePharmacyPercentage, 1),
            ],
            'charts' => [
                'userGrowth' => $fullUserGrowth,
                'pharmacyGrowth' => $fullApotekGrowth,
            ],
            'auditLogs' => $auditLogs
        ]);
    }
}
