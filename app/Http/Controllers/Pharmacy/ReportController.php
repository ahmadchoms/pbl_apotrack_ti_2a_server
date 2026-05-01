<?php

namespace App\Http\Controllers\Pharmacy;

use App\Http\Controllers\Controller;
use App\Services\Pharmacy\ReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    protected $reportService;

    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
    }

    public function index(Request $request)
    {
        $pharmacyId = $pharmacyId = $request->user()->pharmacyStaff->pharmacy_id;
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $type = $request->input('type', 'sales'); // sales or stock

        if ($type === 'stock') {
            $reportData = $this->reportService->getStockMovementReport($pharmacyId, $startDate, $endDate);
        } else {
            $reportData = $this->reportService->getSalesReport($pharmacyId, $startDate, $endDate);
        }

        return Inertia::render('pharmacy/reports', [
            'reportData' => $reportData,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'type' => $type
            ]
        ]);
    }

    public function exportSales(Request $request)
    {
        $pharmacyId = $pharmacyId = $request->user()->pharmacyStaff->pharmacy_id;
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        return $this->reportService->exportSalesCsv($pharmacyId, $startDate, $endDate);
    }

    public function exportStock(Request $request)
    {
        $pharmacyId = $pharmacyId = $request->user()->pharmacyStaff->pharmacy_id;
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        return $this->reportService->exportStockMovementCsv($pharmacyId, $startDate, $endDate);
    }
}
