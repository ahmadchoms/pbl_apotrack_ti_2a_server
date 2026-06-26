<?php

namespace App\Enums;

enum OrderStatus: string
{
    case PENDING          = 'PENDING';
    case PROCESSING       = 'PROCESSING';
    case READY_FOR_PICKUP = 'READY_FOR_PICKUP';
    case COMPLETED        = 'COMPLETED';
    case CANCELLED        = 'CANCELLED';
    case CANCEL_REQUESTED = 'CANCEL_REQUESTED';

    public function label(): string
    {
        return match ($this) {
            self::PENDING          => 'Menunggu',
            self::PROCESSING       => 'Diproses',
            self::READY_FOR_PICKUP => 'Siap Diambil',
            self::COMPLETED        => 'Selesai',
            self::CANCELLED        => 'Dibatalkan',
            self::CANCEL_REQUESTED => 'Minta Batal',
        };
    }

    public function logDescription(?string $oldLabel = null): string
    {
        return match ($this) {
            self::PENDING          => "Pesanan baru berhasil dibuat dan sedang menunggu konfirmasi.",
            self::PROCESSING       => "Pesanan telah disetujui dan saat ini sedang diproses oleh apotek.",
            self::READY_FOR_PICKUP => "Obat telah selesai disiapkan dan siap untuk diambil atau dikirim.",
            self::COMPLETED        => "Transaksi selesai. Obat telah diterima dengan baik oleh pasien.",
            self::CANCELLED        => $oldLabel
                ? "Pesanan dibatalkan (Status sebelumnya: {$oldLabel})."
                : "Pesanan telah dibatalkan.",
            self::CANCEL_REQUESTED => "Customer mengajukan permohonan pembatalan pesanan.",
        };
    }
}
