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
                        'biteship_id' => $biteshipOrder['id'],
                        'courier_name' => $biteshipOrder['courier']['company'],
                        'courier_code' => $this->courierData['courier_code'],
                        'courier_service' => $biteshipOrder['courier']['type'],
                        'tracking_number' => $biteshipOrder['courier']['waybill_id'] ?? null,
                        'tracking_url' => $biteshipOrder['courier']['link'] ?? null,
                        'delivery_fee' => $biteshipOrder['price'],
                        'status' => 'ALLOCATING_COURIER',
                    ]
                );

                $order->update(['order_status' => Order::STATUS_SHIPPED]);

                Log::info("Berhasil membuat order pengiriman Biteship untuk Order ID: {$order->order_number}");
            } catch (\Exception $e) {
                Log::error("Gagal membuat order pengiriman Biteship untuk Order ID {$this->orderId}: " . $e->getMessage());
                throw $e;
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
                    [
                        'status' => 'FAILED_ALLOCATION',
                    ]
                );
            }
        });
    }
}
