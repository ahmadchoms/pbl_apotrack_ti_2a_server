<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Medicine;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderService
{
    public function createOrder($user, $data)
    {
        return DB::transaction(function () use ($user, $data) {

            $total = 0;
            $orderItems = [];

            foreach ($data['items'] as $item) {

                $medicine = Medicine::lockForUpdate()->findOrFail($item['medicine_id']);

                if ($medicine->stock < $item['quantity']) {
                    throw new \Exception('Stock tidak cukup untuk ' . $medicine->name);
                }

                $medicine->decrement('stock', $item['quantity']);

                $subtotal = $medicine->price * $item['quantity'];
                $total += $subtotal;

                $orderItems[] = [
                    'medicine_id' => $medicine->id,
                    'quantity'    => $item['quantity'],
                    'price'       => $medicine->price,
                    'subtotal'    => $subtotal,
                ];
            }

            $order = Order::create([
                'user_id'           => $user->id,
                'pharmacy_id'       => $data['pharmacy_id'],
                'address_id'        => $data['address_id'],
                'service_type'      => $data['service_type'] ?? 'delivery',
                'payment_method'    => $data['payment_method'] ?? 'qris',
                'total_price'       => $total,
                'order_status'      => 'pending',
                'payment_status'    => 'unpaid',
                'verification_code' => strtoupper(Str::random(6)),
                'notes'             => $data['notes'] ?? null,
                'expired_at'        => now()->addHours(24),
            ]);

            foreach ($orderItems as $item) {
                OrderItem::create(array_merge($item, [
                    'order_id' => $order->id,
                ]));
            }

            return $order->load('items');
        });
    }
}
