<?php

namespace App\Http\Controllers\Api\Staff;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\Pharmacy\OrderService;
use Illuminate\Http\Request;
use App\Enums\OrderStatus;

class OrderController extends Controller
{
    public function __construct(
        protected OrderService $orderService
    ) {}

    /**
     * Get orders for the staff's pharmacy.
     */
    public function index(Request $request)
    {
        $staff = $request->user()->pharmacyStaff;

        if (!$staff) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda tidak terdaftar sebagai staf apotek mana pun.',
            ], 403);
        }

        $query = Order::with(['items', 'user'])
            ->where('pharmacy_id', $staff->pharmacy_id);

        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('order_status', $request->status);
        }

        $orders = $query->latest()->paginate(20);

        return response()->json([
            'status' => 'success',
            'message' => 'Daftar pesanan apotek berhasil diambil',
            'data' => $orders->items(),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'total' => $orders->total(),
            ],
        ]);
    }

    public function show(Request $request, $id)
    {
        $staff = $request->user()->pharmacyStaff;

        $order = Order::with(['items.medicine', 'user', 'prescription', 'deliveryTracking'])
            ->where('pharmacy_id', $staff->pharmacy_id)
            ->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'message' => 'Detail pesanan berhasil diambil',
            'data' => $order,
        ]);
    }

    /**
     * Update order status (State Machine).
     */
    public function updateStatus(Request $request, $id)
    {
        $staff = $request->user()->pharmacyStaff;
        $order = Order::where('pharmacy_id', $staff->pharmacy_id)->findOrFail($id);

        $request->validate([
            'status' => 'required|string',
            'note' => 'nullable|string',
        ]);

        try {
            $updatedOrder = $this->orderService->updateStatus($order->id, $request->status, $request->note);

            return response()->json([
                'status' => 'success',
                'message' => "Status pesanan berhasil diperbarui menjadi {$request->status}",
                'data' => $updatedOrder,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Verify order by code (for Pickup).
     */
    public function verify(Request $request)
    {
        $request->validate([
            'verification_code' => 'required|string',
        ]);

        $staff = $request->user()->pharmacyStaff;
        $order = Order::where('pharmacy_id', $staff->pharmacy_id)
            ->where('verification_code', $request->verification_code)
            ->first();

        if (!$order) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kode verifikasi tidak valid atau pesanan tidak ditemukan di apotek ini.',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Kode verifikasi valid',
            'data' => $order->load(['items', 'user']),
        ]);
    }

    /**
     * Create a new POS order (Direct sale).
     */
    public function storePOS(Request $request)
    {
        $staff = $request->user()->pharmacyStaff;

        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:medicines,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'payment_method' => 'nullable|string',
            'user_id' => 'nullable|exists:users,id',
        ]);

        try {
            $order = $this->orderService->createPOSOrder($staff->pharmacy_id, $request->all());

            return response()->json([
                'status' => 'success',
                'message' => 'Pesanan kasir berhasil dibuat',
                'data' => $order->load('items'),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}
