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
        $this->authorize('viewAny', \App\Models\Report::class);

        $pharmacyId = $request->user()->pharmacyStaff->pharmacy_id;
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $type = $request->input('type', 'sales');

        if ($type === 'stock') {
            $rawReport = $this->reportService->getStockMovementReport($pharmacyId, $startDate, $endDate);
            $summary = $this->reportService->getStockSummary($pharmacyId, $startDate, $endDate);
            
            $formattedData = collect($rawReport->items())->map(function ($movement) {
                return [
                    'date' => $movement->created_at ? $movement->created_at->format('d M Y H:i') : 'N/A',
                    'medicine_name' => $movement->medicine->name ?? 'N/A',
                    'type' => $movement->type,
                    'quantity' => $movement->quantity,
                    'remaining_stock' => $movement->batch->stock ?? 0,
                    'batch_number' => $movement->batch->batch_number ?? 'N/A',
                    'note' => $movement->note,
                ];
            })->all();
        } else {
            $rawReport = $this->reportService->getSalesReport($pharmacyId, $startDate, $endDate);
            $summary = $this->reportService->getSalesSummary($pharmacyId, $startDate, $endDate);
            
            $formattedData = collect($rawReport->items())->map(function ($order) {
                return [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                    'date' => $order->created_at->format('d M Y H:i'),
                    'customer_name' => $order->user->username ?? 'Guest',
                    'payment_method' => $order->payment_method,
                    'total' => (float) $order->grand_total,
                ];
            })->all();
        }

        $reportData = [
            'data' => $formattedData,
            'prev_page_url' => $rawReport->previousPageUrl(),
            'next_page_url' => $rawReport->nextPageUrl(),
            'meta' => [
                'from' => $rawReport->firstItem(),
                'to' => $rawReport->lastItem(),
                'total' => $rawReport->total(),
                'links' => $rawReport->linkCollection()->toArray(),
            ]
        ];

        return Inertia::render('pharmacy/reports/index', [
            'reportData' => $reportData,
            'summary' => $summary,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'type' => $type
            ]
        ]);
    }

    public function exportSales(Request $request)
    {
        $this->authorize('viewAny', \App\Models\Report::class);
        $pharmacyId = $request->user()->pharmacyStaff->pharmacy_id;
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        return $this->reportService->exportSalesCsv($pharmacyId, $startDate, $endDate);
    }

    public function exportStock(Request $request)
    {
        $this->authorize('viewAny', \App\Models\Report::class);
        $pharmacyId = $request->user()->pharmacyStaff->pharmacy_id;
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        return $this->reportService->exportStockMovementCsv($pharmacyId, $startDate, $endDate);
    }
}
