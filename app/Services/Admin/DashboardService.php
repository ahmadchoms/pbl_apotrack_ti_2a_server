<?php

namespace App\Services\Admin;

use App\Models\Pharmacy;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    public function getStats()
    {
        $totalUsers = User::count();
        $totalPharmacies = Pharmacy::count();
        $activePharmacies = Pharmacy::where('is_active', true)->count();

        $lastMonth = now()->subMonth();
        $lastMonthUsers = User::whereYear('created_at', $lastMonth->year)
            ->whereMonth('created_at', $lastMonth->month)
            ->count();
        
        $userGrowth = $lastMonthUsers > 0 ? (($totalUsers - $lastMonthUsers) / $lastMonthUsers) * 100 : 0;
        $activePharmacyPercentage = $totalPharmacies > 0 ? ($activePharmacies / $totalPharmacies) * 100 : 0;

        return [
            'totalUsers' => $totalUsers,
            'userGrowth' => round($userGrowth, 1),
            'totalPharmacies' => $totalPharmacies,
            'activePharmacies' => $activePharmacies,
            'activePharmacyPercentage' => round($activePharmacyPercentage, 1),
        ];
    }

    public function getChartData()
    {
        $monthsMapping = [1 => 'JAN', 2 => 'FEB', 3 => 'MAR', 4 => 'APR', 5 => 'MEI', 6 => 'JUN', 7 => 'JUL', 8 => 'AGU', 9 => 'SEP', 10 => 'OKT', 11 => 'NOV', 12 => 'DES'];
        $monthQuery = "EXTRACT(MONTH FROM created_at)";

        $userGrowthData = User::select(DB::raw("COUNT(*) as count"), DB::raw("$monthQuery as month"))
            ->whereYear('created_at', now()->year)
            ->groupBy('month')
            ->get();

        $pharmacyGrowthData = Pharmacy::select(DB::raw("COUNT(*) as count"), DB::raw("$monthQuery as month"))
            ->whereYear('created_at', now()->year)
            ->groupBy('month')
            ->get();

        return [
            'userGrowth' => $this->formatTimeSeries($userGrowthData, $monthsMapping),
            'pharmacyGrowth' => $this->formatTimeSeries($pharmacyGrowthData, $monthsMapping),
        ];
    }

    public function getRecentActivity()
    {
        return Pharmacy::select('id', 'name', 'created_at')
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
    }

    protected function formatTimeSeries($data, $mapping)
    {
        return collect(range(1, 12))->map(function($m) use ($mapping, $data) {
            $existing = $data->firstWhere('month', str_pad($m, 2, '0', STR_PAD_LEFT)) 
                       ?? $data->firstWhere('month', (int)$m);
            return [
                'name' => $mapping[$m],
                'value' => $existing ? (int)$existing->count : 0
            ];
        })->values();
    }
}
