<?php

namespace Database\Seeders;

use App\Models\Pharmacy;
use App\Models\User;
use Illuminate\Database\Seeder;

class PharmacySeeder extends Seeder
{
    public function run(): void
    {
        $apotekAdmins = User::where('role', 'apotek')->get();

        $pharmacies = [
            [
                'name'      => 'Apotek Sehat Farma',
                'address'   => 'Jl. Gajah Mada No. 52, Semarang Tengah, Semarang',
                'latitude'  => -6.9783,
                'longitude' => 110.4199,
                'rating'    => 4.5,
                'is_open'   => true,
                'is_active' => true,
            ],
            [
                'name'      => 'Apotek Kimia Sehat',
                'address'   => 'Jl. MT. Haryono No. 938, Lamper Tengah, Semarang Selatan',
                'latitude'  => -7.0032,
                'longitude' => 110.4267,
                'rating'    => 4.2,
                'is_open'   => true,
                'is_active' => true,
            ],
            [
                'name'      => 'Apotek Bunda Medika',
                'address'   => 'Jl. Sultan Agung No. 101, Gajahmungkur, Semarang',
                'latitude'  => -7.0149,
                'longitude' => 110.4152,
                'rating'    => 4.7,
                'is_open'   => false,
                'is_active' => true,
            ],
        ];

        foreach ($apotekAdmins as $index => $admin) {
            Pharmacy::create(array_merge($pharmacies[$index], [
                'admin_id' => $admin->id,
            ]));
        }
    }
}
