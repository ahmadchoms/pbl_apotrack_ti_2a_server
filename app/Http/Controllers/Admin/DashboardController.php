<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(
        protected DashboardService $dashboardService
    ) {}

    public function index(Request $request)
    {
        $year = $request->input('year', now()->year);
        $month = $request->input('month');

        return Inertia::render('admin/dashboard', [
            'stats' => $this->dashboardService->getStats(),
            'charts' => $this->dashboardService->getChartData($year, $month),
            'auditLogs' => $this->dashboardService->getRecentActivity(),
            'filters' => [
                'year' => (int)$year,
                'month' => $month ? (int)$month : null,
            ]
        ]);
    }
}
