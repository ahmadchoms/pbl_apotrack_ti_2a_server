<?php

namespace App\Jobs;

use App\Services\Api\BiteshipWebhookService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessBiteshipWebhookJob implements ShouldQueue
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
        public array $payload
    ) {}

    /**
     * Execute the job.
     */
    public function handle(BiteshipWebhookService $webhookService): void
    {
        Log::info("Memproses Biteship Webhook Job di latar belakang untuk Order ID: " . ($this->payload['order_id'] ?? 'UNKNOWN'));

        try {
            $webhookService->handleWebhook($this->payload);
        } catch (\Exception $e) {
            Log::error("Gagal memproses Biteship Webhook Job: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error("ProcessBiteshipWebhookJob gagal permanen: " . $exception->getMessage());
    }
}
