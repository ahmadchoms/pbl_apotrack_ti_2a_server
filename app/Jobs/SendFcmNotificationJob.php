<?php

namespace App\Jobs;

use App\Models\Notification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SendFcmNotificationJob implements ShouldQueue
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
     * @var int
     */
    public $backoff = 10;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Notification $notification
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $supabaseUrl = env('SUPABASE_URL');
        $endpoint = rtrim($supabaseUrl, '/') . '/functions/v1/notify-user';

        Log::info("Mengirim push notification ke Supabase Edge Function untuk Notification ID: {$this->notification->id}");

        try {
            $response = Http::timeout(10)->post($endpoint, [
                'record' => [
                    'id' => $this->notification->id,
                    'user_id' => $this->notification->user_id,
                    'title' => $this->notification->title,
                    'message' => $this->notification->message,
                    'type' => $this->notification->type,
                    'reference_type' => $this->notification->reference_type,
                    'reference_id' => $this->notification->reference_id,
                    'is_read' => $this->notification->is_read,
                ]
            ]);

            if ($response->failed()) {
                Log::error("Gagal memanggil Supabase Edge Function: " . $response->body());
                
                // Do not crash the parent request if running synchronously
                if (config('queue.default') !== 'sync') {
                    throw new \Exception("Supabase Edge Function returned status " . $response->status());
                }
            } else {
                Log::info("Push notification berhasil dikirim untuk User ID: {$this->notification->user_id}. Response: " . $response->body());
            }
        } catch (\Exception $e) {
            Log::error("Error saat mengirim push notification ke Supabase Edge Function: " . $e->getMessage());
            
            // Do not crash the parent request if running synchronously
            if (config('queue.default') !== 'sync') {
                throw $e;
            }
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error("SendFcmNotificationJob gagal secara permanen untuk Notification ID {$this->notification->id}: " . $exception->getMessage());
    }
}
