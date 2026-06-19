<?php

namespace App\Services\Api;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Medicine;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CartService
{
    /**
     * Get the user's cart with calculated totals.
     */
    public function getCart(User $user): array
    {
        $cart = Cart::with(['items.medicine.unit'])
            ->where('user_id', $user->id)
            ->first();

        if (!$cart) {
            return [
                'id' => null,
                'pharmacy_id' => null,
                'items' => [],
                'total_price' => 0,
            ];
        }

        $totalPrice = $cart->items->sum(function ($item) {
            return $item->quantity * ($item->medicine->price ?? 0);
        });

        $items = $cart->items->map(function ($item) {
            return [
                'id' => $item->id,
                'medicine_id' => $item->medicine_id,
                'quantity' => $item->quantity,
                'medicine' => $item->medicine,
                'subtotal' => $item->quantity * ($item->medicine->price ?? 0),
            ];
        });

        return [
            'id' => $cart->id,
            'pharmacy_id' => $cart->pharmacy_id,
            'items' => $items,
            'total_price' => $totalPrice,
        ];
    }

    /**
     * Add or update an item in the cart (ACID Protected & Pessimistic Locking).
     */
    public function addItem(User $user, array $data): void
    {
        DB::transaction(function () use ($user, $data) {
            $medicine = Medicine::findOrFail($data['medicine_id']);

            $totalStock = $medicine->batches()
                ->where('expired_date', '>', now())
                ->where('stock', '>', 0)
                ->lockForUpdate()
                ->sum('stock');

            $cart = Cart::firstOrCreate(
                ['user_id' => $user->id],
                ['pharmacy_id' => $data['pharmacy_id']]
            );

            $cart = Cart::where('id', $cart->id)->lockForUpdate()->first();

            if ($cart->pharmacy_id !== $data['pharmacy_id']) {
                $cart->items()->delete();
                $cart->update(['pharmacy_id' => $data['pharmacy_id']]);
            }

            $cartItem = CartItem::where('cart_id', $cart->id)
                ->where('medicine_id', $medicine->id)
                ->lockForUpdate()
                ->first();

            $newQuantity = $cartItem ? $cartItem->quantity + $data['quantity'] : $data['quantity'];

            if ($totalStock < $newQuantity) {
                throw ValidationException::withMessages([
                    'quantity' => ["Stok obat \"{$medicine->name}\" tidak mencukupi. Tersedia: {$totalStock}."],
                ]);
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
        });
    }

    /**
     * Remove an item from the cart (ACID Protected & Pessimistic Locking).
     */
    public function removeItem(User $user, string $itemId): void
    {
        DB::transaction(function () use ($user, $itemId) {
            $cart = Cart::where('user_id', $user->id)->lockForUpdate()->first();

            if (!$cart) {
                throw new \Exception('Keranjang tidak ditemukan', 404);
            }

            $cartItem = CartItem::where('cart_id', $cart->id)
                ->where('id', $itemId)
                ->lockForUpdate()
                ->first();

            if (!$cartItem) {
                throw new \Exception('Item tidak ditemukan di keranjang', 404);
            }

            $cartItem->delete();
        });
    }
}
