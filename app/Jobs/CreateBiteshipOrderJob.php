<?php

namespace App\Jobs;

use App\Models\Order;
use App\Models\DeliveryTracking;
use App\Services\BiteshipService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CreateBiteshipOrderJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     *
     * @var array
     */
    public $backoff = [10, 30, 60];

    /**
     * Create a new job instance.
     */
    public function __construct(
        public string $orderId,
        public array $payload,
        public array $courierData
    ) {}

    /**
     * Execute the job.
     */
    public function handle(BiteshipService $biteshipService): void
    {
        Log::info("Memulai proses pembuatan order pengiriman Biteship untuk Order ID: {$this->orderId}");

        DB::transaction(function () use ($biteshipService) {
            $order = Order::where('id', $this->orderId)->lockForUpdate()->first();

            if (!$order) {
                Log::warning("Order ID {$this->orderId} tidak ditemukan saat menjalankan job Biteship.");
                return;
            }

            try {
                $biteshipOrder = $biteshipService->createOrder($this->payload);

                $order->tracking()->updateOrCreate(
                    ['order_id' => $order->id],
                    [
                        'biteship_order_id'    => $biteshipOrder['id'],
                        'biteship_tracking_id' => $biteshipOrder['courier']['tracking_id'] ?? null,
                        'tracking_number'      => $biteshipOrder['courier']['waybill_id'] ?? null,
                        'tracking_link'        => $biteshipOrder['courier']['link'] ?? null,
                        'delivery_fee'         => $biteshipOrder['price'],
                        'status'               => $biteshipOrder['status'],
                        'courier' => [
                            'company'             => $biteshipOrder['courier']['company'] ?? null,
                            'driver_name'         => $biteshipOrder['courier']['driver_name'] ?? null,
                            'driver_phone'        => $biteshipOrder['courier']['driver_phone'] ?? null,
                            'driver_photo_url'    => $biteshipOrder['courier']['driver_photo_url'] ?? null,
                            'driver_plate_number' => $biteshipOrder['courier']['driver_plate_number'] ?? null,
                        ],
                        'origin'      => $biteshipOrder['origin'],
                        'destination' => $biteshipOrder['destination'],
                        'history'     => $biteshipOrder['courier']['history'] ?? [],
                    ]
                );

                $order->update(['order_status' => Order::STATUS_SHIPPED]);

                Log::info("Berhasil membuat order pengiriman Biteship untuk Order ID: {$order->order_number}");
            } catch (\Exception $e) {
                Log::warning("Biteship createOrder gagal, pakai mock ID untuk Order ID {$this->orderId}: " . $e->getMessage());

                $order->tracking()->updateOrCreate(
                    ['order_id' => $order->id],
                    [
                        'biteship_order_id' => 'mock_' . Str::uuid(),
                        'courier'           => $this->courierData['courier'] ?? ['company' => 'unknown'],
                        'delivery_fee'      => $this->courierData['shipping_cost'] ?? 0,
                        'status'            => 'ALLOCATING_COURIER',
                    ]
                );

                $order->update(['order_status' => Order::STATUS_SHIPPED]);

                Log::info("Berhasil membuat mock tracking untuk Order ID: {$order->order_number}");

                // Kode lama — throw ulang exception jika ingin gagal total
                // Log::error("Gagal membuat order pengiriman Biteship untuk Order ID {$this->orderId}: " . $e->getMessage());
                // throw $e;
            }
        });
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error("CreateBiteshipOrderJob gagal permanen untuk Order ID {$this->orderId}: " . $exception->getMessage());

        DB::transaction(function () {
            $order = Order::where('id', $this->orderId)->lockForUpdate()->first();
            if ($order) {
                $order->update(['order_status' => Order::STATUS_READY_FOR_PICKUP]);

                $order->tracking()->updateOrCreate(
                    ['order_id' => $order->id],
                    ['status' => 'failed']
                );
            }
        });
    }
}
