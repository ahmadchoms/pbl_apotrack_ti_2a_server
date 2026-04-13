<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserAddress;
use Illuminate\Database\Seeder;

class UserAddressSeeder extends Seeder
{
    public function run(): void
    {
        $regularUsers = User::where('role', 'user')->get();

        $addresses = [
            [
                'label'          => 'Rumah',
                'address_detail' => 'Jl. Pandanaran No. 45, Kel. Pekunden, Kec. Semarang Tengah, Semarang 50134',
                'latitude'       => -6.9847,
                'longitude'      => 110.4103,
                'is_primary'     => true,
            ],
            [
                'label'          => 'Kost',
                'address_detail' => 'Jl. Tembalang Raya No. 12, Kel. Tembalang, Kec. Tembalang, Semarang 50275',
                'latitude'       => -7.0498,
                'longitude'      => 110.4381,
                'is_primary'     => true,
            ],
            [
                'label'          => 'Rumah',
                'address_detail' => 'Jl. Siliwangi No. 78, Kel. Krapyak, Kec. Semarang Barat, Semarang 50186',
                'latitude'       => -6.9732,
                'longitude'      => 110.3856,
                'is_primary'     => true,
            ],
            [
                'label'          => 'Kantor',
                'address_detail' => 'Jl. Pemuda No. 150, Kel. Sekayu, Kec. Semarang Tengah, Semarang 50132',
                'latitude'       => -6.9820,
                'longitude'      => 110.4192,
                'is_primary'     => true,
            ],
            [
                'label'          => 'Rumah',
                'address_detail' => 'Jl. Banyumanik Raya No. 33, Kel. Banyumanik, Kec. Banyumanik, Semarang 50264',
                'latitude'       => -7.0426,
                'longitude'      => 110.4169,
                'is_primary'     => true,
            ],
        ];

        foreach ($regularUsers as $index => $user) {
            UserAddress::create(array_merge($addresses[$index], [
                'user_id' => $user->id,
            ]));
        }

        // Alamat tambahan untuk user pertama
        UserAddress::create([
            'user_id'        => $regularUsers[0]->id,
            'label'          => 'Kantor',
            'address_detail' => 'Jl. Gajah Mada No. 100, Kel. Kembangsari, Kec. Semarang Tengah, Semarang 50133',
            'latitude'       => -6.9775,
            'longitude'      => 110.4227,
            'is_primary'     => false,
        ]);
    }
}
