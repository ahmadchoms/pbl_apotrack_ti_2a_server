<?php

namespace Database\Seeders;

use App\Models\Medicine;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Pharmacy;
use App\Models\User;
use App\Models\UserAddress;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $users     = User::where('role', 'user')->get();
        $addresses = UserAddress::all()->keyBy('user_id');

        // ═══════════════════════════════════════════════════════════════
        // 5 order realistis dengan berbagai status
        // ═══════════════════════════════════════════════════════════════
        $orderDefinitions = [
            // Order 1: Ahmad membeli Paracetamol + Promag → completed
            [
                'user_index'      => 0,
                'pharmacy_index'  => 0, // Apotek Sehat Farma
                'service_type'    => 'delivery',
                'payment_method'  => 'qris',
                'order_status'    => 'completed',
                'payment_status'  => 'paid',
                'verification_code' => strtoupper(Str::random(6)),
                'notes'           => 'Tolong diantar sebelum jam 3 sore ya',
                'items'           => [
                    ['name' => 'Paracetamol 500mg', 'qty' => 3],
                    ['name' => 'Promag Tablet',     'qty' => 2],
                ],
            ],
            // Order 2: Rina membeli Sanmol Sirup + Curcuma → pending
            [
                'user_index'      => 1,
                'pharmacy_index'  => 1, // Apotek Kimia Sehat
                'service_type'    => 'pickup',
                'payment_method'  => 'cash',
                'order_status'    => 'pending',
                'payment_status'  => 'unpaid',
                'verification_code' => strtoupper(Str::random(6)),
                'notes'           => 'Saya ambil sekitar jam 5 sore',
                'items'           => [
                    ['name' => 'Sanmol Sirup 60ml', 'qty' => 1],
                    ['name' => 'Curcuma Plus Sirup', 'qty' => 1],
                ],
            ],
            // Order 3: Hendra membeli Amoxicillin → paid
            [
                'user_index'      => 2,
                'pharmacy_index'  => 0,
                'service_type'    => 'delivery',
                'payment_method'  => 'cash',
                'order_status'    => 'paid',
                'payment_status'  => 'paid',
                'verification_code' => strtoupper(Str::random(6)),
                'notes'           => null,
                'items'           => [
                    ['name' => 'Amoxicillin 500mg', 'qty' => 2],
                    ['name' => 'Decolgen',          'qty' => 3],
                ],
            ],
            // Order 4: Putri membeli vitamin → completed
            [
                'user_index'      => 3,
                'pharmacy_index'  => 2, // Apotek Bunda Medika
                'service_type'    => 'pickup',
                'payment_method'  => 'qris',
                'order_status'    => 'completed',
                'payment_status'  => 'paid',
                'verification_code' => strtoupper(Str::random(6)),
                'notes'           => 'Nanti saya ambil sendiri ke apotek',
                'items'           => [
                    ['name' => 'Blackmores Vitamin C 500mg', 'qty' => 1],
                    ['name' => 'Bioplacenton Gel 15g',       'qty' => 1],
                ],
            ],
            // Order 5: Yoga membeli obat flu → cancelled
            [
                'user_index'      => 4,
                'pharmacy_index'  => 1,
                'service_type'    => 'delivery',
                'payment_method'  => 'qris',
                'order_status'    => 'cancelled',
                'payment_status'  => 'unpaid',
                'verification_code' => null,
                'notes'           => null,
                'items'           => [
                    ['name' => 'Actifed Sirup',       'qty' => 1],
                    ['name' => 'Betadine Solution 15ml', 'qty' => 2],
                ],
            ],
        ];

        $pharmacies = Pharmacy::all();

        foreach ($orderDefinitions as $def) {
            $user     = $users[$def['user_index']];
            $address  = $addresses->get($user->id);
            $pharmacy = $pharmacies[$def['pharmacy_index']];

            // Hitung total harga
            $totalPrice = 0;
            $itemDetails = [];

            foreach ($def['items'] as $item) {
                $medicine = Medicine::where('name', $item['name'])->first();
                if (!$medicine) continue;

                $subtotal = $medicine->price * $item['qty'];
                $totalPrice += $subtotal;

                $itemDetails[] = [
                    'medicine_id' => $medicine->id,
                    'quantity'    => $item['qty'],
                    'price'       => $medicine->price,
                    'subtotal'    => $subtotal,
                ];
            }

            $paidAt = in_array($def['payment_status'], ['paid']) ? now()->subDays(rand(1, 7)) : null;
            $expiredAt = $def['order_status'] === 'cancelled' ? now()->subDays(1) : now()->addDay();

            $order = Order::create([
                'user_id'           => $user->id,
                'pharmacy_id'       => $pharmacy->id,
                'address_id'        => $address->id,
                'service_type'      => $def['service_type'],
                'payment_method'    => $def['payment_method'],
                'order_status'      => $def['order_status'],
                'payment_status'    => $def['payment_status'],
                'total_price'       => $totalPrice,
                'verification_code' => $def['verification_code'],
                'notes'             => $def['notes'],
                'paid_at'           => $paidAt,
                'expired_at'        => $expiredAt,
            ]);

            // Buat order items
            foreach ($itemDetails as $detail) {
                OrderItem::create(array_merge($detail, [
                    'order_id' => $order->id,
                ]));
            }
        }
    }
}
