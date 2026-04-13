<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1 Super Admin
        User::create([
            'full_name'     => 'Super Admin ApoTrack',
            'phone'         => '081200000001',
            'email'         => 'admin@apotrack.id',
            'password_hash' => Hash::make('admin123'),
            'role'          => 'admin',
            'is_active'     => true,
        ]);

        // 3 Admin Apotek (pemilik apotek)
        $apotekAdmins = [
            ['full_name' => 'Dr. Siti Nurhaliza',   'phone' => '081234567801', 'email' => 'siti.apotek@mail.com'],
            ['full_name' => 'Apt. Budi Santoso',     'phone' => '081234567802', 'email' => 'budi.apotek@mail.com'],
            ['full_name' => 'Apt. Dewi Kartika',     'phone' => '081234567803', 'email' => 'dewi.apotek@mail.com'],
        ];

        foreach ($apotekAdmins as $admin) {
            User::create(array_merge($admin, [
                'password_hash' => Hash::make('apotek123'),
                'role'          => 'apotek',
                'is_active'     => true,
            ]));
        }

        // 5 User biasa (pembeli)
        $users = [
            ['full_name' => 'Ahmad Fauzi',      'phone' => '081311111001', 'email' => 'ahmad.fauzi@mail.com'],
            ['full_name' => 'Rina Wulandari',    'phone' => '081311111002', 'email' => 'rina.wulandari@mail.com'],
            ['full_name' => 'Hendra Wijaya',     'phone' => '081311111003', 'email' => 'hendra.wijaya@mail.com'],
            ['full_name' => 'Putri Amelia',      'phone' => '081311111004', 'email' => 'putri.amelia@mail.com'],
            ['full_name' => 'Yoga Pratama',      'phone' => '081311111005', 'email' => 'yoga.pratama@mail.com'],
        ];

        foreach ($users as $user) {
            User::create(array_merge($user, [
                'password_hash' => Hash::make('user123'),
                'role'          => 'user',
                'is_active'     => true,
            ]));
        }
    }
}
