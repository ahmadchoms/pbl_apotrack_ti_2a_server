<?php

namespace App\Enums;

enum OrderStatus: string
{
    case PENDING          = 'PENDING';
    case PROCESSING       = 'PROCESSING';
    case READY_FOR_PICKUP = 'READY_FOR_PICKUP';
    case SHIPPED          = 'SHIPPED';
    case DELIVERED        = 'DELIVERED';
    case COMPLETED        = 'COMPLETED';
    case CANCELLED        = 'CANCELLED';

    public function label(): string
    {
        return match($this) {
            self::PENDING          => 'Menunggu',
            self::PROCESSING       => 'Diproses',
            self::READY_FOR_PICKUP => 'Siap Diambil',
            self::SHIPPED          => 'Dikirim',
            self::DELIVERED        => 'Terkirim',
            self::COMPLETED        => 'Selesai',
            self::CANCELLED        => 'Dibatalkan',
        };
    }
}
