<?php

namespace App\Http\Controllers\Pharmacy;

use App\Http\Controllers\Controller;
use App\Models\Medicine;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a master-detail view of orders.
     */
    public function index()
    {
        $orders = Order::with([
            'user:id,username,email,phone',
            'prescription:id,image_url,doctor_name,patient_name,status,issued_date',
            'items:id,order_id,medicine_id,medicine_name,unit_name,requires_prescription,quantity,price,subtotal',
            'tracking:id,order_id,biteship_id,courier_name,courier_service,tracking_number,status,notes'
        ])
            ->select([
                'id',
                'user_id',
                'order_number',
                'service_type',
                'payment_method',
                'order_status',
                'payment_status',
                'grand_total',
                'created_at',
                'notes'
            ])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        $orders->getCollection()->transform(function ($order) {
            $order->buyer = $order->user;
            unset($order->user);
            return $order;
        });

        $pendingCount = Order::where('order_status', 'PENDING')->count();

        return Inertia::render('pharmacy/orders/index', [
            'orders' => $orders,
            'pendingCount' => $pendingCount
        ]);
    }

    /**
     * Display a tabbed list view of orders.
     */
    public function list(Request $request)
    {
        $status = strtoupper($request->query('status', 'ALL'));

        $query = Order::with(['user:id,username,email,phone'])
            ->select([
                'id',
                'user_id',
                'order_number',
                'service_type',
                'payment_method',
                'order_status',
                'payment_status',
                'grand_total',
                'created_at'
            ]);

        if ($status !== 'ALL') {
            $query->where('order_status', $status);
        }

        $orders = $query->orderBy('created_at', 'desc')->paginate(20);

        $orders->getCollection()->transform(function ($order) {
            $order->buyer = $order->user;
            unset($order->user);
            return $order;
        });

        return Inertia::render('pharmacy/orders/list', [
            'orders' => $orders,
            'currentStatus' => $status
        ]);
    }

    /**
     * Display the POS system (Create Order).
     */
    public function pos()
    {
        $medicines = DB::table('medicines as m')
            ->join('medicine_categories as mc', 'm.category_id', '=', 'mc.id')
            ->join('medicine_forms as mf', 'm.form_id', '=', 'mf.id')
            ->join('medicine_units as mu', 'm.unit_id', '=', 'mu.id')
            ->where('m.is_active', true)
            ->select([
                'm.id',
                'm.name',
                'm.price',
                'm.description',
                'm.generic_name',
                'm.is_active',
                'm.requires_prescription',
                'mc.name as category',
                'mf.name as form',
                'mu.name as unit',

                DB::raw("(
                    SELECT mi.image_url 
                    FROM medicine_images mi 
                    WHERE mi.medicine_id = m.id AND mi.is_primary = true 
                    LIMIT 1
                ) as image_url"),

                DB::raw("(
                    SELECT COALESCE(SUM(mb.stock), 0) 
                    FROM medicine_batches mb 
                    WHERE mb.medicine_id = m.id AND mb.expired_date > CURRENT_DATE
                ) as total_stock")
            ])
            ->whereRaw("(
                SELECT COALESCE(SUM(mb.stock), 0) 
                FROM medicine_batches mb 
                WHERE mb.medicine_id = m.id AND mb.expired_date > CURRENT_DATE
            ) > 0")
            ->get();

        return Inertia::render('pharmacy/orders/pos', [
            'medicines' => $medicines,
        ]);
    }
}
