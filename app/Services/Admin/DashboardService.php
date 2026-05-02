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

    public function getChartData($year, $month = null)
    {
        $monthsMapping = [1 => 'JAN', 2 => 'FEB', 3 => 'MAR', 4 => 'APR', 5 => 'MEI', 6 => 'JUN', 7 => 'JUL', 8 => 'AGU', 9 => 'SEP', 10 => 'OKT', 11 => 'NOV', 12 => 'DES'];
        
        $userQuery = User::whereYear('created_at', $year);
        $pharmacyQuery = Pharmacy::whereYear('created_at', $year);

        if ($month) {
            $userQuery->whereMonth('created_at', $month);
            $pharmacyQuery->whereMonth('created_at', $month);
            
            $dayQuery = "EXTRACT(DAY FROM created_at)";
            
            $userData = $userQuery->select(DB::raw("COUNT(*) as count"), DB::raw("$dayQuery as day"))
                ->groupBy('day')
                ->get();
            
            $pharmacyData = $pharmacyQuery->select(DB::raw("COUNT(*) as count"), DB::raw("$dayQuery as day"))
                ->groupBy('day')
                ->get();
                
            $daysInMonth = cal_days_in_month(CAL_GREGORIAN, $month, $year);
            
            return [
                'userGrowth' => $this->formatDailyTimeSeries($userData, $daysInMonth),
                'pharmacyGrowth' => $this->formatDailyTimeSeries($pharmacyData, $daysInMonth),
            ];
        }

        $monthQuery = "EXTRACT(MONTH FROM created_at)";
        
        $userData = $userQuery->select(DB::raw("COUNT(*) as count"), DB::raw("$monthQuery as month"))
            ->groupBy('month')
            ->get();

        $pharmacyData = $pharmacyQuery->select(DB::raw("COUNT(*) as count"), DB::raw("$monthQuery as month"))
            ->groupBy('month')
            ->get();

        return [
            'userGrowth' => $this->formatTimeSeries($userData, $monthsMapping),
            'pharmacyGrowth' => $this->formatTimeSeries($pharmacyData, $monthsMapping),
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
            $existing = $data->firstWhere('month', (int)$m) ?? $data->firstWhere('month', str_pad($m, 2, '0', STR_PAD_LEFT));
            return [
                'name' => $mapping[$m],
                'value' => $existing ? (int)$existing->count : 0
            ];
        })->values();
    }

    protected function formatDailyTimeSeries($data, $daysInMonth)
    {
        return collect(range(1, $daysInMonth))->map(function($d) use ($data) {
            $existing = $data->firstWhere('day', (int)$d) ?? $data->firstWhere('day', str_pad($d, 2, '0', STR_PAD_LEFT));
            return [
                'name' => "Tgl $d",
                'value' => $existing ? (int)$existing->count : 0
            ];
        })->values();
    }
}
