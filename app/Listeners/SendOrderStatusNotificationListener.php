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
            'PENDING' => "Pesananmu udah dibuat, nih! Sekarang lagi nunggu konfirmasi dari apotek ya, mohon ditunggu sebentar~",
            'PROCESSING' => "Obatmu lagi disiapin dan dibungkus dengan aman sama apotek. Bentar lagi siap kirim, kok!",
            'READY_FOR_PICKUP' => "Hore, pesananmu udah jadi! Yuk, bisa langsung diambil ke apotek atau siap-siap tunggu dijemput kurir.",
            'SHIPPED' => "Asyik, obatmu udah dibawa kurir dan lagi otw ke tempatmu! Jangan lupa aktifin HP kamu, ya.",
            'DELIVERED' => "Tok tok tok! Pesananmu udah sampai di tujuan dengan selamat, nih. Jangan lupa langsung dicek ya!",
            'COMPLETED' => "Pesanan selesai! Terima kasih ya udah mempercayakan kebutuhan kesehatanmu di ApoTrack. Sehat-sehat selalu!",
            'CANCELLED' => "Yah, maaf banget... Pesananmu terpaksa dibatalkan. Kalau ada kendala, jangan ragu buat pesan lagi, ya.",
            'confirmed'         => "Apotek udah konfirmasi pesananmu, nih! Sekarang kami lagi mencarikan kurir terbaik buat anter obatmu.",
    'allocated'         => "Asyik, udah dapet kurir nih! Siap-siap ya, kurir akan segera menjemput pesananmu.",
    'picking_up'        => "Kurir lagi otw menuju apotek buat ambil obatmu. Tunggu kabari selanjutnya, ya!",
    'picked'            => "Paket obatmu udah aman di tangan kurir! Tinggal tunggu kurir meluncur ke lokasi kamu.",
    'dropping_off'      => "Sstt... kurir udah dekat banget dan lagi mengarah ke rumahmu. Siap-siap denger ketukan pintu, ya!",
    'rejected'          => "Waduh, kurir sebelumnya berhalangan menjemput paketmu. Tenang, sistem lagi otomatis nyariin kurir pengganti ya~",
    'on_hold'           => "Eh, perjalanan kurir agak tertunda sebentar karena kendala di jalan (misal: hujan lebat). Mohon pengertiannya, ya!",
    'courier_not_found' => "Aduh, kami kesulitan nemuin kurir saat ini. Jangan khawatir, tim kami sedang mengusahakan opsi pengiriman lain.",
    'return_in_transit' => "Hmm, karena suatu kendala di lokasi tujuan, kurir lagi membawa paket obatmu kembali ke apotek terlebih dahulu.",
    'returned'          => "Paketmu sudah aman kembali di apotek asal. Kamu bisa cek detailnya atau hubungi CS kami buat info lebih lanjut, ya.",
        ];

        $message = $messages[$event->newStatus] ?? "Status pesanan Anda #{$order->order_number} diperbarui menjadi {$event->newStatus}.";

        $user->notifications()->create([
            'title' => "Status Pesanan Diperbarui",
            'message' => $message,
            'type' => 'ORDER_STATUS',
            'reference_type' => 'ORDER',
            'reference_id' => $order->id,
            'is_read' => false,
        ]);

        if ($event->newStatus === 'PENDING') {
            $staffUsers = \App\Models\User::whereHas('pharmacyStaff', function ($query) use ($order) {
                $query->where('pharmacy_id', $order->pharmacy_id)
                    ->where('is_active', true);
            })->get();

            foreach ($staffUsers as $staff) {
                $staff->notifications()->create([
                    'title' => "Pesanan Baru Masuk",
                    'message' => "Ada pesanan baru #{$order->order_number} dari pelanggan. Harap segera periksa dan konfirmasi.",
                    'type' => 'NEW_ORDER',
                    'reference_type' => 'ORDER',
                    'reference_id' => $order->id,
                    'is_read' => false,
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
