<?php

namespace App\Listeners;

use App\Events\OrderStatusChangedEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class SendOrderStatusNotificationListener implements ShouldQueue
{
    use InteractsWithQueue;

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
     * Handle the event.
     */
    public function handle(OrderStatusChangedEvent $event): void
    {
        $order = $event->order;
        $user = $order->user;

        if (!$user) {
            return;
        }

        Log::info("Mengirim notifikasi latar belakang untuk Order {$order->order_number}: Status berubah dari {$event->oldStatus} menjadi {$event->newStatus}");

        $messages = [
            'PENDING'            => "Pesananmu udah dibuat, nih! Sekarang lagi nunggu konfirmasi dari apotek ya, mohon ditunggu sebentar~",
            'PROCESSING'         => "Obatmu lagi disiapin dan dibungkus dengan aman sama apotek. Bentar lagi siap, kok!",
            'READY_FOR_PICKUP'   => "Hore, pesananmu udah jadi! Yuk, bisa langsung diambil ke apotek.",
            'COMPLETED'          => "Pesanan selesai! Terima kasih ya udah mempercayakan kebutuhan kesehatanmu di ApoTrack. Sehat-sehat selalu!",
            'CANCELLED'          => "Yah, maaf banget... Pesananmu terpaksa dibatalkan. Kalau ada kendala, jangan ragu buat pesan lagi, ya.",
        ];

        $message = $messages[$event->newStatus] ?? "Status pesanan Anda #{$order->order_number} diperbarui menjadi {$event->newStatus}.";

        $user->notifications()->create([
            'title'          => "Status Pesanan Diperbarui",
            'message'        => $message,
            'type'           => 'ORDER_STATUS',
            'reference_type' => 'ORDER',
            'reference_id'   => $order->id,
            'is_read'        => false,
        ]);

        if ($event->newStatus === 'PENDING') {
            $staffUsers = \App\Models\User::whereHas('pharmacyStaff', function ($query) use ($order) {
                $query->where('pharmacy_id', $order->pharmacy_id)
                    ->where('is_active', true);
            })->get();

            foreach ($staffUsers as $staff) {
                $staff->notifications()->create([
                    'title'          => "Pesanan Baru Masuk",
                    'message'        => "Ada pesanan baru #{$order->order_number} dari pelanggan. Harap segera periksa dan konfirmasi.",
                    'type'           => 'NEW_ORDER',
                    'reference_type' => 'ORDER',
                    'reference_id'   => $order->id,
                    'is_read'        => false,
                ]);
            }
        }

        Log::info("Notifikasi berhasil disimpan untuk User ID: {$user->id}");
    }

    /**
     * Handle a job failure.
     */
    public function failed(OrderStatusChangedEvent $event, \Throwable $exception): void
    {
        Log::error("Gagal mengirim notifikasi untuk Order {$event->order->order_number}: " . $exception->getMessage());
    }
}
