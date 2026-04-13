<?php

namespace Database\Seeders;

use App\Models\Medicine;
use App\Models\MedicineCategory;
use App\Models\MedicineForm;
use App\Models\Pharmacy;
use Illuminate\Database\Seeder;

class MedicineSeeder extends Seeder
{
    public function run(): void
    {
        $pharmacies = Pharmacy::all();
        $categories = MedicineCategory::all()->keyBy('name');
        $forms      = MedicineForm::all()->keyBy('name');

        // ═══════════════════════════════════════════════════════════════
        // DEFINISI OBAT — 15 obat realistis Indonesia
        // ═══════════════════════════════════════════════════════════════
        $medicines = [
            // ── Analgesik & Antipiretik ──
            [
                'name'        => 'Paracetamol 500mg',
                'description' => 'Obat pereda nyeri dan penurun demam. Digunakan untuk sakit kepala, nyeri otot, sakit gigi, dan demam.',
                'category'    => 'Analgesik & Antipiretik',
                'form'        => 'Tablet',
                'price'       => 5000,
                'stock'       => 150,
                'unit'        => 'Strip (10 tablet)',
                'pharmacy'    => 0,
            ],
            [
                'name'        => 'Bodrex Extra',
                'description' => 'Kombinasi paracetamol dan ibuprofen untuk mengatasi sakit kepala berat, nyeri haid, dan demam tinggi.',
                'category'    => 'Analgesik & Antipiretik',
                'form'        => 'Tablet',
                'price'       => 8500,
                'stock'       => 80,
                'unit'        => 'Strip (4 kaplet)',
                'pharmacy'    => 0,
            ],
            [
                'name'        => 'Sanmol Sirup 60ml',
                'description' => 'Paracetamol sirup rasa jeruk untuk anak-anak. Menurunkan demam dan meredakan nyeri ringan hingga sedang.',
                'category'    => 'Analgesik & Antipiretik',
                'form'        => 'Sirup',
                'price'       => 18500,
                'stock'       => 35,
                'unit'        => 'Botol',
                'pharmacy'    => 1,
            ],

            // ── Antibiotik ──
            [
                'name'        => 'Amoxicillin 500mg',
                'description' => 'Antibiotik golongan penisilin untuk infeksi saluran pernapasan, saluran kemih, kulit, dan jaringan lunak.',
                'category'    => 'Antibiotik',
                'form'        => 'Kapsul',
                'price'       => 12000,
                'stock'       => 60,
                'unit'        => 'Strip (10 kapsul)',
                'pharmacy'    => 0,
            ],
            [
                'name'        => 'Cefadroxil 500mg',
                'description' => 'Antibiotik sefalosporin generasi pertama untuk infeksi saluran napas, kulit, dan saluran kemih.',
                'category'    => 'Antibiotik',
                'form'        => 'Kapsul',
                'price'       => 15000,
                'stock'       => 40,
                'unit'        => 'Strip (10 kapsul)',
                'pharmacy'    => 1,
            ],

            // ── Vitamin & Suplemen ──
            [
                'name'        => 'Enervon-C',
                'description' => 'Multivitamin mengandung Vitamin C 500mg dan Vitamin B Complex untuk menjaga daya tahan tubuh.',
                'category'    => 'Vitamin & Suplemen',
                'form'        => 'Tablet',
                'price'       => 9500,
                'stock'       => 100,
                'unit'        => 'Strip (4 tablet)',
                'pharmacy'    => 0,
            ],
            [
                'name'        => 'Blackmores Vitamin C 500mg',
                'description' => 'Suplemen vitamin C untuk meningkatkan imunitas, antioksidan, dan menjaga kesehatan kulit.',
                'category'    => 'Vitamin & Suplemen',
                'form'        => 'Tablet',
                'price'       => 85000,
                'stock'       => 25,
                'unit'        => 'Botol (60 tablet)',
                'pharmacy'    => 2,
            ],
            [
                'name'        => 'Curcuma Plus Sirup',
                'description' => 'Suplemen penambah nafsu makan anak dengan ekstrak temulawak dan multivitamin.',
                'category'    => 'Vitamin & Suplemen',
                'form'        => 'Sirup',
                'price'       => 22000,
                'stock'       => 30,
                'unit'        => 'Botol (60ml)',
                'pharmacy'    => 1,
            ],

            // ── Obat Batuk & Flu ──
            [
                'name'        => 'Decolgen',
                'description' => 'Obat flu yang mengandung paracetamol, phenylpropanolamine, dan chlorpheniramine maleate untuk meredakan gejala flu.',
                'category'    => 'Obat Batuk & Flu',
                'form'        => 'Tablet',
                'price'       => 7000,
                'stock'       => 90,
                'unit'        => 'Strip (4 kaplet)',
                'pharmacy'    => 0,
            ],
            [
                'name'        => 'Vicks Formula 44 Anak',
                'description' => 'Obat batuk sirup untuk anak dengan rasa strawberry, meredakan batuk kering dan batuk berdahak.',
                'category'    => 'Obat Batuk & Flu',
                'form'        => 'Sirup',
                'price'       => 25000,
                'stock'       => 20,
                'unit'        => 'Botol (54ml)',
                'pharmacy'    => 2,
            ],
            [
                'name'        => 'Actifed Sirup',
                'description' => 'Obat batuk dan pilek yang mengandung triprolidine dan pseudoephedrine untuk meredakan hidung tersumbat.',
                'category'    => 'Obat Batuk & Flu',
                'form'        => 'Sirup',
                'price'       => 35000,
                'stock'       => 15,
                'unit'        => 'Botol (60ml)',
                'pharmacy'    => 1,
            ],

            // ── Obat Saluran Cerna ──
            [
                'name'        => 'Promag Tablet',
                'description' => 'Antasida untuk meredakan gejala maag seperti nyeri lambung, kembung, mual, dan rasa penuh pada perut.',
                'category'    => 'Obat Saluran Cerna',
                'form'        => 'Tablet',
                'price'       => 3500,
                'stock'       => 120,
                'unit'        => 'Strip (6 tablet)',
                'pharmacy'    => 0,
            ],
            [
                'name'        => 'Mylanta Sirup 150ml',
                'description' => 'Antasida dan anti-gas cair untuk mengatasi asam lambung berlebih, perut kembung, dan refluks.',
                'category'    => 'Obat Saluran Cerna',
                'form'        => 'Sirup',
                'price'       => 42000,
                'stock'       => 18,
                'unit'        => 'Botol',
                'pharmacy'    => 2,
            ],

            // ── Antiseptik & Luka ──
            [
                'name'        => 'Betadine Solution 15ml',
                'description' => 'Antiseptik povidone iodine 10% untuk mencegah infeksi pada luka gores, luka bakar ringan, dan luka sayat.',
                'category'    => 'Antiseptik & Luka',
                'form'        => 'Tetes',
                'price'       => 18000,
                'stock'       => 45,
                'unit'        => 'Botol',
                'pharmacy'    => 1,
            ],
            [
                'name'        => 'Bioplacenton Gel 15g',
                'description' => 'Gel untuk luka bakar dan luka kronis. Mengandung plasenta extract dan neomycin sulfate.',
                'category'    => 'Antiseptik & Luka',
                'form'        => 'Salep',
                'price'       => 28000,
                'stock'       => 22,
                'unit'        => 'Tube',
                'pharmacy'    => 2,
            ],
        ];

        foreach ($medicines as $med) {
            Medicine::create([
                'pharmacy_id' => $pharmacies[$med['pharmacy']]->id,
                'category_id' => $categories[$med['category']]->id,
                'form_id'     => $forms[$med['form']]->id,
                'name'        => $med['name'],
                'description' => $med['description'],
                'price'       => $med['price'],
                'stock'       => $med['stock'],
                'unit'        => $med['unit'],
                'image_url'   => null,
                'is_active'   => true,
            ]);
        }
    }
}
