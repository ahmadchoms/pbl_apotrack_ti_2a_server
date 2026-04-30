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
        $filters = $request->only(['search', 'status']);
        
        $orders = OrderResource::collection(
            $this->orderService->list($pharmacyId, $filters)
        );

        return Inertia::render('pharmacy/orders/index', [
            'orders' => $orders,
            'pendingCount' => $this->orderService->getPendingCount($pharmacyId),
            'filters' => $filters
        ]);
    }

    public function list(Request $request)
    {
        $pharmacyId = $request->user()->pharmacyStaff->pharmacy_id;
        $filters = $request->only(['search', 'status']);
        $filters['status'] = $filters['status'] ?? 'ALL';

        $orders = OrderResource::collection(
            $this->orderService->list($pharmacyId, $filters)
        );

        return Inertia::render('pharmacy/orders/list', [
            'orders' => $orders,
            'currentStatus' => strtoupper($filters['status']),
            'filters' => $filters
        ]);
    }

    public function show(Request $request, string $id)
    {
        $order = $this->orderService->getOrderDetail($id);

        if ($order->pharmacy_id !== $request->user()->pharmacyStaff->pharmacy_id) {
            abort(403);
        }

        return Inertia::render('pharmacy/orders/show', [
            'order' => new OrderResource($order)
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:medicines,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric',
            'total' => 'required|numeric',
            'payment_method' => 'required|string'
        ]);

        $pharmacyId = $request->user()->pharmacyStaff->pharmacy_id;
        $this->orderService->createPOSOrder($pharmacyId, $request->all());

        return redirect()->route('pharmacy.orders.index')
            ->with('success', 'Pesanan POS berhasil dibuat');
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
