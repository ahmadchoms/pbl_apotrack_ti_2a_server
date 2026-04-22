<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Pharmacy;
use App\Models\PharmacyOperatingHour;
use App\Models\PharmacyStaff;
use App\Models\MedicineCategory;
use App\Models\MedicineForm;
use App\Models\MedicineType;
use App\Models\MedicineUnit;
use App\Models\Medicine;
use App\Models\MedicineBatch;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Review;
use App\Models\StockMovement;
use Illuminate\Support\Str;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. MASTER DATA SEEDS
        $categories = [
            'Antibiotik',
            'Analgesik',
            'Antipiretik',
            'Antihipertensi',
            'Antidiabetes',
            'Vitamin & Suplemen',
            'Antihistamin',
            'Antasida & GERD',
            'Batuk & Flu',
            'Diare & Pencernaan',
            'Mata & Telinga',
            'Kulit & Topikal',
            'Kardiovaskular',
            'Neurologi',
            'Psikiatri',
            'Hormon & Endokrin',
            'Onkologi',
            'Kontrasepsi',
            'Herbal & Jamu',
            'Lainnya'
        ];
        foreach ($categories as $cat) {
            MedicineCategory::firstOrCreate(['name' => $cat]);
        }

        $forms = ['Tablet', 'Kapsul', 'Sirup', 'Suspensi', 'Tetes (mata/telinga/hidung)', 'Salep / Krim', 'Injeksi', 'Suppositoria', 'Patch / Plester', 'Inhaler'];
        foreach ($forms as $form) {
            MedicineForm::firstOrCreate(['name' => $form]);
        }

        $types = ['Obat Bebas', 'Obat Bebas Terbatas', 'Obat Wajib Apotek', 'Obat Keras', 'Narkotika & Psikotropika'];
        foreach ($types as $type) {
            MedicineType::firstOrCreate(['name' => $type]);
        }

        $units = ['Tablet', 'Kapsul', 'Strip', 'Box', 'Botol', 'Tube', 'Sachet', 'Ampul', 'Vial', 'Pcs'];
        foreach ($units as $unit) {
            MedicineUnit::firstOrCreate(['name' => $unit]);
        }

        // 2. USER SEEDS
        $users = [
            ['full_name' => 'Super Admin', 'email' => 'admin@apotek.id', 'password_hash' => Hash::make('Admin@12345'), 'role' => 'SUPER_ADMIN'],
            ['full_name' => 'Budi Santoso', 'email' => 'customer1@test.id', 'password_hash' => Hash::make('Test@12345'), 'role' => 'CUSTOMER'],
            ['full_name' => 'Siti Rahayu', 'email' => 'customer2@test.id', 'password_hash' => Hash::make('Test@12345'), 'role' => 'CUSTOMER'],
            ['full_name' => 'Dr. Ahmad Apoteker', 'email' => 'apoteker1@apotek.id', 'password_hash' => Hash::make('Staff@12345'), 'role' => 'PHARMACY_STAFF'],
            ['full_name' => 'Rina Staff', 'email' => 'staff1@apotek.id', 'password_hash' => Hash::make('Staff@12345'), 'role' => 'PHARMACY_STAFF'],
        ];

        $createdUsers = [];
        foreach ($users as $u) {
            $createdUsers[$u['email']] = User::firstOrCreate(['email' => $u['email']], $u);
        }

        // 3. PHARMACY SEEDS
        $pharmacies = [
            [
                'name' => 'Apotek Sehat Selalu',
                'address' => 'Jl. Sudirman No. 10, Jakarta Pusat',
                'phone' => '021-12345678',
                'latitude' => -6.2088,
                'longitude' => 106.8456,
                'is_active' => true,
                'is_force_closed' => false,
                'operating_hours' => 'Senin-Sabtu 08:00-21:00, Minggu 09:00-18:00'
            ],
            [
                'name' => 'Apotek Farma Prima',
                'address' => 'Jl. Gatot Subroto No. 55, Jakarta Selatan',
                'phone' => '021-98765432',
                'latitude' => -6.2350,
                'longitude' => 106.8200,
                'is_active' => true,
                'is_force_closed' => false,
                'operating_hours' => '24 Jam'
            ],
            [
                'name' => 'Apotek Medika Mandiri',
                'address' => 'Jl. Pemuda No. 22, Surabaya',
                'phone' => '031-55554444',
                'latitude' => -7.2575,
                'longitude' => 112.7521,
                'is_active' => true,
                'is_force_closed' => false,
                'operating_hours' => 'Senin-Minggu 07:00-23:00'
            ]
        ];

        $pharmaModels = [];
        foreach ($pharmacies as $p) {
            $pharmaModel = Pharmacy::firstOrCreate(['name' => $p['name']], collect($p)->except('operating_hours')->toArray());
            $pharmaModels[] = $pharmaModel;

            // Generate hours (dummy representation)
            for ($i = 0; $i <= 6; $i++) {
                PharmacyOperatingHour::updateOrCreate(
                    ['pharmacy_id' => $pharmaModel->id, 'day_of_week' => $i],
                    ['open_time' => '08:00:00', 'close_time' => '21:00:00']
                );
            }
        }

        // Attach staffs to first pharmacy
        PharmacyStaff::firstOrCreate([
            'pharmacy_id' => $pharmaModels[0]->id,
            'user_id' => $createdUsers['apoteker1@apotek.id']->id,
        ], ['role' => 'APOTEKER']);

        PharmacyStaff::firstOrCreate([
            'pharmacy_id' => $pharmaModels[0]->id,
            'user_id' => $createdUsers['staff1@apotek.id']->id,
        ], ['role' => 'STAFF']);


        // 4. MEDICINE SEEDS
        $medicines = [
            ['name' => 'Paracetamol 500mg', 'generic_name' => 'Paracetamol', 'category' => 'Analgesik', 'form' => 'Tablet', 'type' => 'Obat Bebas', 'unit' => 'Strip', 'manufacturer' => 'Kimia Farma', 'price' => 3500, 'requires_prescription' => false, 'batches' => [['batch_number' => 'PCM-2024-001', 'expired_date' => '2026-12-31', 'stock' => 100]]],
            ['name' => 'Amoxicillin 500mg', 'generic_name' => 'Amoxicillin Trihydrate', 'category' => 'Antibiotik', 'form' => 'Kapsul', 'type' => 'Obat Keras', 'unit' => 'Strip', 'manufacturer' => 'Hexpharm Jaya', 'price' => 8500, 'requires_prescription' => true, 'batches' => [['batch_number' => 'AMX-2024-001', 'expired_date' => '2025-10-31', 'stock' => 50]]],
            ['name' => 'Omeprazole 20mg', 'generic_name' => 'Omeprazole', 'category' => 'Antasida & GERD', 'form' => 'Kapsul', 'type' => 'Obat Wajib Apotek', 'unit' => 'Strip', 'manufacturer' => 'Dexa Medica', 'price' => 12000, 'requires_prescription' => false, 'batches' => [['batch_number' => 'OMP-2024-001', 'expired_date' => '2026-06-30', 'stock' => 75]]],
            ['name' => 'Cetirizine 10mg', 'generic_name' => 'Cetirizine HCl', 'category' => 'Antihistamin', 'form' => 'Tablet', 'type' => 'Obat Bebas Terbatas', 'unit' => 'Strip', 'manufacturer' => 'Novell Pharmaceutical', 'price' => 5000, 'requires_prescription' => false, 'batches' => [['batch_number' => 'CTZ-2024-001', 'expired_date' => '2026-03-31', 'stock' => 80]]],
            ['name' => 'Vitamin C 1000mg', 'generic_name' => 'Ascorbic Acid', 'category' => 'Vitamin & Suplemen', 'form' => 'Tablet', 'type' => 'Obat Bebas', 'unit' => 'Box', 'manufacturer' => 'Sido Muncul', 'price' => 45000, 'requires_prescription' => false, 'batches' => [['batch_number' => 'VTC-2024-001', 'expired_date' => '2027-01-31', 'stock' => 200]]]
        ];

        foreach ($pharmaModels as $pModel) {
            foreach ($medicines as $med) {
                $cat = MedicineCategory::where('name', $med['category'])->first()->id;
                $form = MedicineForm::where('name', $med['form'])->first()->id;
                $type = MedicineType::where('name', $med['type'])->first()->id;
                $unit = MedicineUnit::where('name', $med['unit'])->first()->id;

                $m = Medicine::firstOrCreate([
                    'pharmacy_id' => $pModel->id,
                    'name' => $med['name']
                ], [
                    'category_id' => $cat,
                    'form_id' => $form,
                    'type_id' => $type,
                    'unit_id' => $unit,
                    'generic_name' => $med['generic_name'],
                    'manufacturer' => $med['manufacturer'],
                    'price' => $med['price'],
                    'requires_prescription' => $med['requires_prescription']
                ]);

                foreach ($med['batches'] as $batch) {
                    $b = MedicineBatch::firstOrCreate([
                        'medicine_id' => $m->id,
                        'batch_number' => $batch['batch_number'] . '-' . substr($pModel->id, 0, 4)
                    ], [
                        'expired_date' => $batch['expired_date'],
                        'stock' => $batch['stock']
                    ]);

                    StockMovement::firstOrCreate([
                        'medicine_id' => $m->id,
                        'batch_id' => $b->id,
                        'type' => 'IN'
                    ], [
                        'quantity' => $batch['stock'],
                        'created_by' => $createdUsers['admin@apotek.id']->id,
                        'note' => 'Initial seed'
                    ]);
                }
            }
        }

        // 6. SAMPLE ORDERS
        $cust1 = $createdUsers['customer1@test.id'];
        $phar1 = $pharmaModels[0];
        $m1 = $phar1->medicines()->first();

        // COMPLETED Order
        $o1 = Order::firstOrCreate(['order_number' => 'ORD-20240115-00001'], [
            'user_id' => $cust1->id,
            'pharmacy_id' => $phar1->id,
            'service_type' => 'PICKUP',
            'payment_method' => 'QRIS',
            'order_status' => 'COMPLETED',
            'payment_status' => 'PAID',
            'subtotal_amount' => 45000,
            'grand_total' => 45000,
            'expired_at' => now()->addHour(),
            'created_at' => now()->subDays(2)
        ]);
        OrderItem::firstOrCreate(['order_id' => $o1->id, 'medicine_id' => $m1->id], [
            'medicine_name' => $m1->name,
            'unit_name' => 'Box',
            'quantity' => 1,
            'price' => 45000,
            'subtotal' => 45000
        ]);
        Review::firstOrCreate(['order_id' => $o1->id], [
            'user_id' => $cust1->id,
            'pharmacy_id' => $phar1->id,
            'rating' => 5,
            'comment' => 'Bagus sekali layanannya'
        ]);

        // PENDING Order
        $o2 = Order::firstOrCreate(['order_number' => 'ORD-20240115-00002'], [
            'user_id' => $cust1->id,
            'pharmacy_id' => $phar1->id,
            'service_type' => 'DELIVERY',
            'payment_method' => 'COD',
            'order_status' => 'PENDING',
            'payment_status' => 'UNPAID',
            'subtotal_amount' => 12000,
            'shipping_cost' => 15000,
            'grand_total' => 27000,
            'expired_at' => now()->addHour()
        ]);

        // CANCELLED Order
        $o3 = Order::firstOrCreate(['order_number' => 'ORD-20240115-00003'], [
            'user_id' => $cust1->id,
            'pharmacy_id' => $phar1->id,
            'service_type' => 'PICKUP',
            'payment_method' => 'QRIS',
            'order_status' => 'CANCELLED',
            'payment_status' => 'FAILED',
            'subtotal_amount' => 3500,
            'grand_total' => 3500,
            'cancellation_reason' => 'Batal beli',
            'expired_at' => now()->subDay()
        ]);
    }
}
