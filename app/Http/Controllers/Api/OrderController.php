<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\Pharmacy\OrderService;
use Illuminate\Http\Request;
use App\Exceptions\InsufficientStockException;

class OrderController extends Controller
{
    public function __construct(
        protected OrderService $orderService
    ) {}

    /**
     * Display a listing of user orders.
     */
    public function index(Request $request)
    {
        $orders = Order::with(['items.medicine', 'pharmacy'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return response()->json([
            'status' => 'success',
            'message' => 'Riwayat pesanan berhasil diambil',
            'data' => $orders->items(),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'total' => $orders->total(),
            ],
        ]);
    }

    /**
     * Store a new order from mobile.
     */
    public function store(Request $request)
    {
        $request->validate([
            'pharmacy_id' => 'required|exists:pharmacies,id',
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:medicines,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric',
            'subtotal_amount' => 'required|numeric',
            'service_type' => 'required|string|in:PICK_UP,DELIVERY',
            'payment_method' => 'required|string|in:CASH,TRANSFER,E-WALLET',
            
            // Aturan khusus logistik jika memilih DELIVERY
            'address_id' => 'required_if:service_type,DELIVERY|nullable|exists:user_addresses,id',
            'courier_code' => 'required_if:service_type,DELIVERY|nullable|string',
            'courier_service' => 'required_if:service_type,DELIVERY|nullable|string',
            'shipping_cost' => 'required_if:service_type,DELIVERY|numeric',
            'notes' => 'nullable|string'
        ]);

        try {
            $user = $request->user();
            $data = $request->all();

            $order = $this->orderService->createCustomerOrder($user, $data);

            return response()->json([
                'status' => 'success',
                'message' => 'Pesanan berhasil dibuat',
                'data' => $order->load(['items.medicine', 'tracking']),
            ], 201);
        } catch (InsufficientStockException $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Order creation failed: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.',
            ], 500);
        }
    }

    /**
     * Display specific order details.
     */
    public function show($id, Request $request)
    {
        $order = Order::with(['items.medicine', 'pharmacy', 'tracking', 'statusLogs', 'prescription'])
            ->where('user_id', $request->user()->id)
            ->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'message' => 'Detail pesanan berhasil diambil',
            'data' => $order,
        ]);
    }

    /**
     * Upload prescription for an order.
     */
    public function uploadPrescription(Request $request, $id)
    {
        $request->validate([
            'prescription_image' => 'required|image|max:5120', // Max 5MB
        ]);

        $order = Order::where('user_id', $request->user()->id)->findOrFail($id);

        try {
            $file = $request->file('prescription_image');
            $path = $file->store('prescriptions', 's3');
            $url = \Illuminate\Support\Facades\Storage::disk('s3')->url($path);

            $prescription = \App\Models\Prescription::create([
                'user_id' => $request->user()->id,
                'order_id' => $order->id,
                'image_url' => $url,
                'status' => 'PENDING',
            ]);

            $order->update(['prescription_id' => $prescription->id]);

            return response()->json([
                'status' => 'success',
                'message' => 'Resep dokter berhasil diunggah',
                'data' => $prescription,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengunggah resep: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get order history (Completed or Cancelled).
     */
    public function history(Request $request)
    {
        $orders = Order::with(['items.medicine', 'pharmacy'])
            ->where('user_id', $request->user()->id)
            ->whereIn('order_status', ['COMPLETED', 'CANCELLED'])
            ->latest()
            ->paginate(15);

        return response()->json([
            'status' => 'success',
            'message' => 'Riwayat pesanan berhasil diambil',
            'data' => $orders->items(),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'total' => $orders->total(),
            ],
        ]);
    }

    /**
     * Get courier tracking details.
     */
    public function tracking($id, Request $request)
    {
        $order = Order::with(['deliveryTracking.logs'])
            ->where('user_id', $request->user()->id)
            ->findOrFail($id);

        if (!$order->deliveryTracking) {
            return response()->json([
                'status' => 'error',
                'message' => 'Informasi pengiriman tidak ditemukan untuk pesanan ini.',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Data pelacakan pengiriman berhasil diambil',
            'data' => $order->deliveryTracking,
        ]);
    }

    /**
     * Simulate payment for UI Testing (Dummy)
     */
    public function simulatePayment($id, Request $request)
    {
        $order = Order::where('user_id', $request->user()->id)->findOrFail($id);

        if ($order->payment_status !== 'UNPAID') {
            return response()->json([
                'status' => 'error',
                'message' => 'Pesanan ini sudah dibayar atau status tidak valid.',
            ], 422);
        }

        $order->update([
            'payment_status' => 'PAID',
            'paid_at' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Simulasi pembayaran berhasil, pesanan telah dilunasi.',
            'data' => $order,
        ]);
    }
}
