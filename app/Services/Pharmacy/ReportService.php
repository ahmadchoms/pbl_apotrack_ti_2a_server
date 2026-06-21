<?php

namespace App\Services\Pharmacy;

use App\Models\Order;
use App\Models\StockMovement;
use Illuminate\Support\Facades\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportService
{
    public function getSalesReport(string $pharmacyId, ?string $startDate, ?string $endDate, int $perPage = 15)
    {
        $query = Order::with('user')
            ->where('pharmacy_id', $pharmacyId)
            ->where('order_status', 'COMPLETED');

        if ($startDate) {
            $query->whereDate('created_at', '>=', $startDate);
        }
        if ($endDate) {
            $query->whereDate('created_at', '<=', $endDate);
        }

        return $query->latest()->paginate($perPage);
    }

    public function getStockMovementReport(string $pharmacyId, ?string $startDate, ?string $endDate, int $perPage = 15)
    {
        $query = StockMovement::with(['medicine', 'batch'])
            ->whereHas('medicine', function ($q) use ($pharmacyId) {
                $q->where('pharmacy_id', $pharmacyId);
            });

        if ($startDate) {
            $query->whereDate('created_at', '>=', $startDate);
        }
        if ($endDate) {
            $query->whereDate('created_at', '<=', $endDate);
        }

        return $query->latest('created_at')->paginate($perPage);
    }

    public function exportSalesCsv(string $pharmacyId, ?string $startDate, ?string $endDate): StreamedResponse
    {
        $fileName = 'sales_report_' . now()->format('YmdHis') . '.csv';

        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$fileName",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $callback = function () use ($pharmacyId, $startDate, $endDate) {
            $file = fopen('php://output', 'w');

            fputcsv($file, ['No. Order', 'Tanggal', 'Pelanggan', 'Metode Pembayaran', 'Subtotal', 'Ongkir', 'Total']);

            Order::with('user')
                ->where('pharmacy_id', $pharmacyId)
                ->where('order_status', 'COMPLETED')
                ->when($startDate, fn($q) => $q->whereDate('created_at', '>=', $startDate))
                ->when($endDate, fn($q) => $q->whereDate('created_at', '<=', $endDate))
                ->latest()
                ->chunk(1000, function ($orders) use ($file) {
                    foreach ($orders as $order) {
                        fputcsv($file, [
                            $order->order_number,
                            $order->created_at->format('Y-m-d H:i:s'),
                            $order->user->username,
                            $order->payment_method,
                            $order->subtotal_amount,
                            $order->shipping_cost,
                            $order->grand_total,
                        ]);
                    }
                });

            fclose($file);
        };

        return Response::stream($callback, 200, $headers);
    }

    public function exportStockMovementCsv(string $pharmacyId, ?string $startDate, ?string $endDate): StreamedResponse
    {
        $fileName = 'stock_mutation_' . now()->format('YmdHis') . '.csv';

        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$fileName",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $callback = function () use ($pharmacyId, $startDate, $endDate) {
            $file = fopen('php://output', 'w');

            fputcsv($file, ['Tanggal', 'Obat', 'Batch', 'Tipe', 'Jumlah', 'Catatan']);

            StockMovement::with(['medicine', 'batch'])
                ->whereHas('medicine', function ($q) use ($pharmacyId) {
                    $q->where('pharmacy_id', $pharmacyId);
                })
                ->when($startDate, fn($q) => $q->whereDate('created_at', '>=', $startDate))
                ->when($endDate, fn($q) => $q->whereDate('created_at', '<=', $endDate))
                ->latest('created_at')
                ->chunk(1000, function ($movements) use ($file) {
                    foreach ($movements as $movement) {
                        fputcsv($file, [
                            $movement->created_at,
                            $movement->medicine->name,
                            $movement->batch->batch_number,
                            $movement->type,
                            $movement->quantity,
                            $movement->note,
                        ]);
                    }
                });

            fclose($file);
        };

        return Response::stream($callback, 200, $headers);
    }

    public function getSalesSummary(string $pharmacyId, ?string $startDate, ?string $endDate)
    {
        $query = Order::where('pharmacy_id', $pharmacyId)
            ->where('order_status', 'COMPLETED');

        if ($startDate) {
            $query->whereDate('created_at', '>=', $startDate);
        }
        if ($endDate) {
            $query->whereDate('created_at', '<=', $endDate);
        }

        $totalRevenue = $query->sum('grand_total');
        $totalTransactions = $query->count();
        
        $totalItemsSold = \App\Models\OrderItem::whereHas('order', function ($q) use ($pharmacyId, $startDate, $endDate) {
            $q->where('pharmacy_id', $pharmacyId)
              ->where('order_status', 'COMPLETED')
              ->when($startDate, fn($sq) => $sq->whereDate('created_at', '>=', $startDate))
              ->when($endDate, fn($sq) => $sq->whereDate('created_at', '<=', $endDate));
        })->sum('quantity');

        $prescriptionTransactions = $query->whereNotNull('prescription_id')->count();

        return [
            'total_revenue' => (float) $totalRevenue,
            'total_transactions' => $totalTransactions,
            'total_items_sold' => (int) $totalItemsSold,
            'prescription_transactions' => $prescriptionTransactions,
        ];
    }

    public function getStockSummary(string $pharmacyId, ?string $startDate, ?string $endDate)
    {
        $queryIn = StockMovement::where('type', 'IN')
            ->whereHas('medicine', function ($q) use ($pharmacyId) {
                $q->where('pharmacy_id', $pharmacyId);
            });
        
        $queryOut = StockMovement::where('type', 'OUT')
            ->whereHas('medicine', function ($q) use ($pharmacyId) {
                $q->where('pharmacy_id', $pharmacyId);
            });

        if ($startDate) {
            $queryIn->whereDate('created_at', '>=', $startDate);
            $queryOut->whereDate('created_at', '>=', $startDate);
        }
        if ($endDate) {
            $queryIn->whereDate('created_at', '<=', $endDate);
            $queryOut->whereDate('created_at', '<=', $endDate);
        }

        $totalIn = $queryIn->sum('quantity');
        $totalOut = $queryOut->sum('quantity');

        $lowStockCount = \App\Models\Medicine::where('pharmacy_id', $pharmacyId)
            ->where('is_active', true)
            ->whereHas('batches', function ($q) {
                $q->where('stock', '<=', 10);
            })
            ->count();

        $expiringCount = \App\Models\MedicineBatch::whereHas('medicine', function ($q) use ($pharmacyId) {
                $q->where('pharmacy_id', $pharmacyId);
            })
            ->where('stock', '>', 0)
            ->whereBetween('expired_date', [now(), now()->addDays(90)])
            ->count();

        return [
            'total_in' => (int) $totalIn,
            'total_out' => (int) $totalOut,
            'low_stock_count' => $lowStockCount,
            'expiring_count' => $expiringCount,
        ];
    }
}
