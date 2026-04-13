<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // 1. Users terlebih dahulu (akar dari semua relasi)
            UserSeeder::class,

            // 2. Alamat user (bergantung pada users)
            UserAddressSeeder::class,

            // 3. Apotek dan jam operasional (bergantung pada users.role=apotek)
            PharmacySeeder::class,
            PharmacyOperatingHourSeeder::class,

            // 4. Kategori dan bentuk obat (independen, tapi harus sebelum medicines)
            MedicineCategorySeeder::class,
            MedicineFormSeeder::class,

            // 5. Obat (bergantung pada pharmacies, categories, forms)
            MedicineSeeder::class,

            // 6. Order dan items (bergantung pada users, pharmacies, addresses, medicines)
            OrderSeeder::class,
        ]);
    }
}
