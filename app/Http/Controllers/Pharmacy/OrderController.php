<?php

namespace App\Http\Controllers\Pharmacy;

use App\Http\Controllers\Controller;
use App\Http\Resources\Pharmacy\MedicineResource;
use App\Http\Resources\Pharmacy\OrderResource;
use App\Models\Pharmacy;
use App\Services\Pharmacy\MedicineService;
use App\Services\Pharmacy\OrderService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function __construct(
        protected OrderService $orderService,
        protected MedicineService $medicineService
    ) {}

    public function index(Request $request)
    {
        $pharmacyId = $request->user()->pharmacyStaff->pharmacy_id;
        
        $orders = OrderResource::collection(
            $this->orderService->list($pharmacyId, ['status' => 'ALL'])
        );

        return Inertia::render('pharmacy/orders/index', [
            'orders' => $orders,
            'pendingCount' => $this->orderService->getPendingCount($pharmacyId)
        ]);
    }

    public function list(Request $request)
    {
        $pharmacyId = $request->user()->pharmacyStaff->pharmacy_id;
        $status = $request->query('status', 'ALL');

        $orders = OrderResource::collection(
            $this->orderService->list($pharmacyId, ['status' => $status])
        );

        return Inertia::render('pharmacy/orders/list', [
            'orders' => $orders,
            'currentStatus' => strtoupper($status)
        ]);
    }

    public function pos(Request $request)
    {
        $pharmacyId = $request->user()->pharmacyStaff->pharmacy_id;
        $medicines = $this->medicineService->getActiveMedicines($pharmacyId);

        return Inertia::render('pharmacy/orders/pos', [
            'medicines' => MedicineResource::collection($medicines),
        ]);
    }
}
