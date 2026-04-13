<?php

namespace Database\Seeders;

use App\Models\MedicineCategory;
use Illuminate\Database\Seeder;

class MedicineCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Analgesik & Antipiretik',
            'Antibiotik',
            'Vitamin & Suplemen',
            'Obat Batuk & Flu',
            'Obat Saluran Cerna',
            'Antiseptik & Luka',
        ];

        foreach ($categories as $name) {
            MedicineCategory::create(['name' => $name]);
        }
    }
}
