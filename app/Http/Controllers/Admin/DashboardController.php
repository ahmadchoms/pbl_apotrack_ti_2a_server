<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\DashboardService;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(
        protected DashboardService $dashboardService
    ) {}

    public function index()
    {
        return Inertia::render('admin/dashboard', [
            'stats' => $this->dashboardService->getStats(),
            'charts' => $this->dashboardService->getChartData(),
            'auditLogs' => $this->dashboardService->getRecentActivity()
        ]);
    }
}
