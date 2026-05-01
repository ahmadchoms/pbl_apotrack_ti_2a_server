<?php

namespace App\Enums;

enum UserRole: string
{
    case USER       = 'USER';
    case PHARMACY_STAFF = 'PHARMACY_STAFF';
    case APOTEKER       = 'APOTEKER';
    case STAFF          = 'STAFF';
    case SUPER_ADMIN    = 'SUPER_ADMIN';

    public function label(): string
    {
        return match ($this) {
            self::USER       => 'Pengguna',
            self::PHARMACY_STAFF => 'Staff Apotek',
            self::APOTEKER       => 'Apoteker',
            self::STAFF          => 'Staff',
            self::SUPER_ADMIN    => 'Super Admin',
        };
    }
}
