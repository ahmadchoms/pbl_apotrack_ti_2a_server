<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Medicine;
use Illuminate\Http\Request;

class CartController extends Controller
{
    /**
     * Get the current user's cart.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $cart = Cart::with(['items.medicine.unit'])
            ->where('user_id', $user->id)
            ->first();

        if (!$cart) {
            return response()->json([
                'status' => 'success',
                'message' => 'Keranjang kosong',
                'data' => [
                    'items' => [],
                    'total_price' => 0,
                ],
            ]);
        }

        $totalPrice = $cart->items->sum(function ($item) {
            return $item->quantity * ($item->medicine->price ?? 0);
        });

        // Map items for consistent API response
        $items = $cart->items->map(function ($item) {
            return [
                'id' => $item->id,
                'medicine_id' => $item->medicine_id,
                'quantity' => $item->quantity,
                'medicine' => $item->medicine,
                'subtotal' => $item->quantity * ($item->medicine->price ?? 0),
            ];
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Data keranjang berhasil diambil',
            'data' => [
                'id' => $cart->id,
                'pharmacy_id' => $cart->pharmacy_id,
                'items' => $items,
                'total_price' => $totalPrice,
            ],
        ]);
    }

    /**
     * Add or update an item in the cart.
     */
    public function store(Request $request)
    {
        $request->validate([
            'pharmacy_id' => 'required|exists:pharmacies,id',
            'medicine_id' => 'required|exists:medicines,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $user = $request->user();
        $medicine = Medicine::findOrFail($request->medicine_id);

        // Check total available stock across all active batches
        $totalStock = $medicine->batches()
            ->where('expired_date', '>', now())
            ->where('stock', '>', 0)
            ->sum('stock');

        // Get or create cart for the user
        $cart = Cart::firstOrCreate(
            ['user_id' => $user->id],
            ['pharmacy_id' => $request->pharmacy_id]
        );

        // Reset cart if pharmacy changes
        if ($cart->pharmacy_id !== $request->pharmacy_id) {
            $cart->items()->delete();
            $cart->update(['pharmacy_id' => $request->pharmacy_id]);
        }

        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('medicine_id', $medicine->id)
            ->first();

        $newQuantity = $cartItem ? $cartItem->quantity + $request->quantity : $request->quantity;

        // Validasi stok
        if ($totalStock < $newQuantity) {
            return response()->json([
                'status' => 'error',
                'message' => "Stok obat \"{$medicine->name}\" tidak mencukupi. Tersedia: {$totalStock}.",
            ], 422);
        }

        if ($cartItem) {
            $cartItem->update(['quantity' => $newQuantity]);
        } else {
            CartItem::create([
                'cart_id' => $cart->id,
                'medicine_id' => $medicine->id,
                'quantity' => $newQuantity,
            ]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Item berhasil ditambahkan ke keranjang',
        ]);
    }

    /**
     * Remove an item from the cart.
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();

        $cart = Cart::where('user_id', $user->id)->first();

        if (!$cart) {
            return response()->json([
                'status' => 'error',
                'message' => 'Keranjang tidak ditemukan',
            ], 404);
        }

        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('id', $id)
            ->first();

        if (!$cartItem) {
            return response()->json([
                'status' => 'error',
                'message' => 'Item tidak ditemukan di keranjang',
            ], 404);
        }

        $cartItem->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Item berhasil dihapus dari keranjang',
        ]);
    }
}
