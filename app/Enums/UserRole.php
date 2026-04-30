<?php

namespace App\Enums;

enum UserRole: string
{
    case CUSTOMER       = 'CUSTOMER';
    case PHARMACY_STAFF = 'PHARMACY_STAFF';
    case APOTEKER       = 'APOTEKER';
    case SUPER_ADMIN    = 'SUPER_ADMIN';

    public function label(): string
    {
        return match($this) {
            self::CUSTOMER       => 'Pengguna',
            self::PHARMACY_STAFF => 'Staff Apotek',
            self::APOTEKER       => 'Apoteker',
            self::SUPER_ADMIN    => 'Super Admin',
        };
    }
}
