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
            'total' => 'required|numeric',
            'payment_method' => 'required|string|in:CASH,TRANSFER,E-WALLET',
        ]);

        try {
            $data = $request->all();
            $data['user_id'] = $request->user()->id;

            $order = $this->orderService->createPOSOrder($request->pharmacy_id, $data);

            return response()->json([
                'status' => 'success',
                'message' => 'Pesanan berhasil dibuat',
                'data' => $order->load('items'),
            ], 201);
        } catch (InsufficientStockException $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat memproses pesanan: ' . $e->getMessage(),
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
}
