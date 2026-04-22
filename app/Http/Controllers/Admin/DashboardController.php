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
        $totalUsers = User::count();
        $lastMonthUsers = User::whereMonth('created_at', now()->subMonth()->month)->count();
        $userGrowth = $lastMonthUsers > 0 ? (($totalUsers - $lastMonthUsers) / $lastMonthUsers) * 100 : 0;

        $totalPharmacies = Pharmacy::count();
        $activePharmacies = Pharmacy::where('is_active', true)->count();
        $activePharmacyPercentage = $totalPharmacies > 0 ? ($activePharmacies / $totalPharmacies) * 100 : 0;

        $monthsMapping = [1 => 'JAN', 2 => 'FEB', 3 => 'MAR', 4 => 'APR', 5 => 'MEI', 6 => 'JUN', 7 => 'JUL', 8 => 'AGU', 9 => 'SEP', 10 => 'OKT', 11 => 'NOV', 12 => 'DES'];

        // Group by month for chart
        $dbDriver = DB::connection()->getDriverName();
        $monthQuery = $dbDriver === 'sqlite' ? "strftime('%m', created_at)" : "MONTH(created_at)";

        $userGrowthData = User::select(DB::raw("COUNT(*) as count"), DB::raw("$monthQuery as month"))
            ->whereYear('created_at', now()->year)
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($item) use ($monthsMapping) {
                return [
                    'name' => $monthsMapping[(int)$item->month] ?? '',
                    'value' => $item->count
                ];
            });
            
        $apotekGrowthData = Pharmacy::select(DB::raw("COUNT(*) as count"), DB::raw("$monthQuery as month"))
            ->whereYear('created_at', now()->year)
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($item) use ($monthsMapping) {
                return [
                    'name' => $monthsMapping[(int)$item->month] ?? '',
                    'value' => $item->count
                ];
            });

        // Audit Logs (mocked using recent pharmacies for now)
        $auditLogs = Pharmacy::latest()->take(3)->get()->map(function($p) {
            return [
                'id' => $p->id,
                'title' => 'Node Farmasi Baru',
                'desc' => '"'.$p->name.'" berhasil diverifikasi dan diintegrasikan.',
                'time' => $p->created_at ? $p->created_at->diffForHumans() : 'Baru saja',
                'isNew' => $p->created_at ? $p->created_at->diffInHours(now()) < 24 : true,
            ];
        });

        // Ensure we always have empty months fallback
        $fullUserGrowth = collect(range(1, 12))->map(function($m) use ($monthsMapping, $userGrowthData) {
            $existing = $userGrowthData->firstWhere('name', $monthsMapping[$m]);
            return $existing ?: ['name' => $monthsMapping[$m], 'value' => 0];
        })->values();

        $fullApotekGrowth = collect(range(1, 12))->map(function($m) use ($monthsMapping, $apotekGrowthData) {
            $existing = $apotekGrowthData->firstWhere('name', $monthsMapping[$m]);
            return $existing ?: ['name' => $monthsMapping[$m], 'value' => 0];
        })->values();

        return Inertia::render('admin/dashboard', [
            'totalUsers' => $totalUsers,
            'userGrowth' => round($userGrowth, 1),
            'totalPharmacies' => $totalPharmacies,
            'activePharmacyPercentage' => round($activePharmacyPercentage, 1),
            'userGrowthData' => $fullUserGrowth,
            'apotekGrowthData' => $fullApotekGrowth,
            'auditLogs' => $auditLogs
        ]);
    }
}
