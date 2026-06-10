<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\AuditLogResource;
use App\Services\Admin\DashboardService;
use App\Services\Admin\ProfileService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(
        protected DashboardService $dashboardService,
        protected ProfileService $profileService
    ) {}

    public function index(Request $request)
    {
        $year = $request->input('year', now()->year);
        $month = $request->input('month');

        $dateFrom = $request->date_from ?? now()->subDays(7)->format('Y-m-d');
        $dateTo = $request->date_to ?? now()->format('Y-m-d');

        $filters = array_merge($request->only(['search', 'status', 'action_type']), [
            'date_from' => $dateFrom,
            'date_to' => $dateTo
        ]);

        $logs = $this->profileService->getAuditHistory($filters);

        return Inertia::render('admin/dashboard', [
            'stats' => $this->dashboardService->getStats(),
            'charts' => $this->dashboardService->getChartData($year, $month),
            'auditLogs' => AuditLogResource::collection($logs),
            'filters' => [
                'year' => (int)$year,
                'month' => $month ? (int)$month : null,
            ]
        ]);
    }
}
