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
use App\Enums\OrderStatus;
use Illuminate\Validation\Rules\Rule;
use App\Models\Order;
use App\Models\Prescription;
use Illuminate\Validation\Rule as ValidationRule;
use App\Exceptions\InsufficientStockException;
use App\Exceptions\InvalidOrderStatusTransitionException;

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

        $this->authorize('view', $order);

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
        
        try {
            $this->orderService->createPOSOrder($pharmacyId, $request->all());
        } catch (InsufficientStockException $e) {
            return redirect()->back()
                ->withErrors(['items' => $e->getMessage()])
                ->withInput();
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Gagal membuat pesanan: ' . $e->getMessage())
                ->withInput();
        }

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

    public function updateStatus(Request $request, string $id)
    {
        $order = Order::findOrFail($id);
        $this->authorize('update', $order);

        $request->validate([
            'status' => ['required', ValidationRule::enum(OrderStatus::class)],
            'note' => 'nullable|string'
        ]);

        try {
            $this->orderService->updateStatus($id, OrderStatus::from($request->status), $request->note);
        } catch (InvalidOrderStatusTransitionException $e) {
            return redirect()->back()->with('error', $e->getMessage());
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal memperbarui status: ' . $e->getMessage());
        }

        return redirect()->back()->with('success', "Status pesanan berhasil diupdate ke {$request->status}");
    }

    public function reject(Request $request, string $id)
    {
        $order = Order::findOrFail($id);
        $this->authorize('update', $order);

        $request->validate([
            'reason' => 'required|string'
        ]);

        $this->orderService->rejectOrder($id, $request->reason);

        return redirect()->back()->with('success', "Pesanan berhasil ditolak");
    }

    public function validatePrescription(Request $request, string $id)
    {
        $prescription = Prescription::with('order')->findOrFail($id);
        $this->authorize('update', $prescription->order);

        $request->validate([
            'status' => 'required|string|in:VERIFIED,REJECTED',
            'note' => 'nullable|string'
        ]);

        $this->orderService->validatePrescription($id, $request->status, $request->note);

        return redirect()->back()->with('success', "Resep berhasil divalidasi");
    }
}
