<?php

namespace App\Http\Controllers\Pharmacy;

use App\Http\Controllers\Controller;
use App\Models\Pharmacy;
use App\Services\Pharmacy\PharmacyDashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(
        protected PharmacyDashboardService $dashboardService
    ) {}

    public function index(Request $request)
    {
        $pharmacyId = $request->user()->pharmacyStaff->pharmacy_id;
        $filters = $request->only(['year', 'month']);

        return Inertia::render('pharmacy/dashboard', array_merge(
            $this->dashboardService->getDashboardData($pharmacyId, $filters),
            ['filters' => $filters]
        ));
    }
}
