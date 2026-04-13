<?php

namespace Database\Seeders;

use App\Models\MedicineForm;
use Illuminate\Database\Seeder;

class MedicineFormSeeder extends Seeder
{
    public function run(): void
    {
        $forms = [
            'Tablet',
            'Kapsul',
            'Sirup',
            'Salep',
            'Tetes',
        ];

        foreach ($forms as $name) {
            MedicineForm::create(['name' => $name]);
        }
    }
}
