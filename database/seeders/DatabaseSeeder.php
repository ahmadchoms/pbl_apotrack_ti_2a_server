<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\UserAddress;
use App\Models\Pharmacy;
use App\Models\PharmacyImage;
use App\Models\PharmacyOperatingHour;
use App\Models\PharmacyStaff;
use App\Models\MedicineCategory;
use App\Models\MedicineForm;
use App\Models\MedicineType;
use App\Models\MedicineUnit;
use App\Models\Medicine;
use App\Models\MedicineImage;
use App\Models\MedicineBatch;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Prescription;
use App\Models\DeliveryTracking;
use App\Models\DeliveryTrackingLog;
use App\Models\Review;
use App\Models\StockMovement;
use Carbon\Carbon;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Konstanta URL Supabase dari User
        $avatarUrl = 'https://rccoezzqqntpdarqqkht.supabase.co/storage/v1/object/public/apotrack-public/avatar/avatar.jpg';
        $pharmacyUrl = 'https://rccoezzqqntpdarqqkht.supabase.co/storage/v1/object/public/apotrack-public/pharmacies/pharmacy.jpg';
        $medicineUrl = 'https://rccoezzqqntpdarqqkht.supabase.co/storage/v1/object/public/apotrack-public/medicines/medicines.jpg';
        $licenseUrl = 'https://rccoezzqqntpdarqqkht.supabase.co/storage/v1/object/public/apotrack-private/licenses/license.jpeg';
        $prescriptionUrl = 'https://rccoezzqqntpdarqqkht.supabase.co/storage/v1/object/public/apotrack-private/prescriptions/resep-dokter.jpg';

        // ==========================================
        // 1. MASTER DATA SEEDS
        // ==========================================
        $categories = ['Antibiotik', 'Analgesik', 'Antipiretik', 'Antihipertensi', 'Antidiabetes', 'Vitamin & Suplemen', 'Antihistamin', 'Antasida & GERD', 'Batuk & Flu', 'P3K & Antiseptik'];
        foreach ($categories as $cat) {
            MedicineCategory::firstOrCreate(['name' => $cat]);
        }

        $forms = ['Tablet', 'Kapsul', 'Sirup', 'Suspensi', 'Tetes (mata/telinga)', 'Salep / Krim', 'Injeksi', 'Botol'];
        foreach ($forms as $form) {
            MedicineForm::firstOrCreate(['name' => $form]);
        }

        $types = ['Obat Bebas', 'Obat Bebas Terbatas', 'Obat Wajib Apotek', 'Obat Keras', 'Alat Kesehatan'];
        foreach ($types as $type) {
            MedicineType::firstOrCreate(['name' => $type]);
        }

        $units = ['Strip', 'Box', 'Botol', 'Tube', 'Pcs'];
        foreach ($units as $unit) {
            MedicineUnit::firstOrCreate(['name' => $unit]);
        }

        // ==========================================
        // 2. USER & ADDRESS SEEDS
        // ==========================================
        $users = [
            ['username' => 'Super Admin', 'email' => 'admin@apotek.id', 'phone' => '081111111111', 'role' => 'SUPER_ADMIN', 'avatar_url' => $avatarUrl, 'is_active' => true],
            ['username' => 'Budi Santoso', 'email' => 'budi@customer.id', 'phone' => '082222222222', 'role' => 'CUSTOMER', 'avatar_url' => $avatarUrl, 'is_active' => true],
            ['username' => 'Siti Rahayu', 'email' => 'siti@customer.id', 'phone' => '083333333333', 'role' => 'CUSTOMER', 'avatar_url' => $avatarUrl, 'is_active' => true],
            ['username' => 'Dr. Prayitno Apoteker', 'email' => 'prayitno@apotek.id', 'phone' => '084444444444', 'role' => 'APOTEKER', 'avatar_url' => $avatarUrl, 'is_active' => true],
            ['username' => 'Rina Staff', 'email' => 'rina@apotek.id', 'phone' => '085555555555', 'role' => 'PHARMACY_STAFF', 'avatar_url' => $avatarUrl, 'is_active' => true],
            ['username' => 'Hanif Nakal', 'email' => 'hanif@banned.id', 'phone' => '086666666666', 'role' => 'CUSTOMER', 'avatar_url' => $avatarUrl, 'is_active' => false],
        ];

        $createdUsers = [];
        foreach ($users as $u) {
            $u['password_hash'] = Hash::make('Test@12345');
            $createdUsers[$u['email']] = User::firstOrCreate(['email' => $u['email']], $u);
        }

        $budi = $createdUsers['budi@customer.id'];
        $addrBudi = UserAddress::firstOrCreate(['user_id' => $budi->id], [
            'label' => 'Rumah Utama',
            'address_detail' => 'Jl. Mawar Merah No. 15, RT 02/RW 04, Jakarta Barat',
            'latitude' => -6.1751,
            'longitude' => 106.8272,
            'is_primary' => true
        ]);

        $siti = $createdUsers['siti@customer.id'];
        $addrSiti = UserAddress::firstOrCreate(['user_id' => $siti->id], [
            'label' => 'Kantor',
            'address_detail' => 'Gedung Cyber, Jl. Kuningan Barat No. 8, Jakarta Selatan',
            'latitude' => -6.2394,
            'longitude' => 106.8312,
            'is_primary' => true
        ]);

        // ==========================================
        // 3. PHARMACY SEEDS
        // ==========================================
        $pharmacies = [
            [
                'name' => 'Apotek Sehat Selalu',
                'address' => 'Jl. Sudirman No. 10, Jakarta Pusat',
                'phone' => '021-12345678',
                'latitude' => -6.2088,
                'longitude' => 106.8456,
                'rating' => 4.8,
                'total_reviews' => 124,
                'license_number' => 'SIA-2024-0001',
                'license_document_url' => $licenseUrl,
                'verification_status' => 'VERIFIED',
                'is_active' => true,
                'is_force_closed' => false
            ],
            [
                'name' => 'Apotek Farma Prima (Tutup Sementara)',
                'address' => 'Jl. Gatot Subroto No. 55, Jakarta Selatan',
                'phone' => '021-98765432',
                'latitude' => -6.2350,
                'longitude' => 106.8200,
                'rating' => 4.5,
                'total_reviews' => 89,
                'license_number' => 'SIA-2024-0055',
                'license_document_url' => $licenseUrl,
                'verification_status' => 'VERIFIED',
                'is_active' => true,
                'is_force_closed' => true
            ],
            [
                'name' => 'Apotek Abal Abal',
                'address' => 'Jl. Gelap Gulita No. 99, Jakarta Timur',
                'phone' => '021-00000000',
                'latitude' => -6.2500,
                'longitude' => 106.8500,
                'rating' => 0,
                'total_reviews' => 0,
                'license_number' => 'SIA-PALSU-123',
                'license_document_url' => $licenseUrl,
                'verification_status' => 'REJECTED',
                'is_active' => false,
                'is_force_closed' => false
            ]
        ];

        $pharmaModels = [];
        foreach ($pharmacies as $p) {
            $pharmaModel = Pharmacy::firstOrCreate(['name' => $p['name']], $p);
            $pharmaModels[] = $pharmaModel;

            PharmacyImage::firstOrCreate(['pharmacy_id' => $pharmaModel->id], [
                'image_url' => $pharmacyUrl,
                'is_primary' => true
            ]);

            for ($i = 0; $i <= 6; $i++) {
                PharmacyOperatingHour::updateOrCreate(
                    ['pharmacy_id' => $pharmaModel->id, 'day_of_week' => $i],
                    ['open_time' => '08:00:00', 'close_time' => '22:00:00']
                );
            }
        }

        PharmacyStaff::firstOrCreate(['pharmacy_id' => $pharmaModels[0]->id, 'user_id' => $createdUsers['prayitno@apotek.id']->id], ['role' => 'APOTEKER']);
        PharmacyStaff::firstOrCreate(['pharmacy_id' => $pharmaModels[0]->id, 'user_id' => $createdUsers['rina@apotek.id']->id], ['role' => 'STAFF']);

        // ==========================================
        // 4. MEDICINE SEEDS
        // ==========================================
        $medicines = [
            ['name' => 'Panadol Extra 500mg', 'generic_name' => 'Paracetamol + Caffeine', 'category' => 'Analgesik', 'form' => 'Tablet', 'type' => 'Obat Bebas', 'unit' => 'Strip', 'manufacturer' => 'GSK', 'price' => 12000, 'weight_in_grams' => 20, 'requires_prescription' => false, 'desc' => 'Meredakan sakit kepala, migrain, dan sakit gigi.', 'dosage' => 'Dewasa: 1 tablet tiap 4-6 jam'],
            ['name' => 'Amoxicillin 500mg', 'generic_name' => 'Amoxicillin Trihydrate', 'category' => 'Antibiotik', 'form' => 'Kapsul', 'type' => 'Obat Keras', 'unit' => 'Strip', 'manufacturer' => 'Kimia Farma', 'price' => 8500, 'weight_in_grams' => 15, 'requires_prescription' => true, 'desc' => 'Antibiotik penisilin untuk infeksi bakteri.', 'dosage' => 'Sesuai petunjuk dokter'],
            ['name' => 'Promag Tablet', 'generic_name' => 'Hydrotalcite, Mg(OH)2', 'category' => 'Antasida & GERD', 'form' => 'Tablet', 'type' => 'Obat Bebas', 'unit' => 'Strip', 'manufacturer' => 'Kalbe Farma', 'price' => 9000, 'weight_in_grams' => 25, 'requires_prescription' => false, 'desc' => 'Mengurangi gejala maag dan asam lambung.', 'dosage' => '1-2 tablet, dikunyah sebelum makan'],
            ['name' => 'Imboost Force', 'generic_name' => 'Echinacea, Zinc', 'category' => 'Vitamin & Suplemen', 'form' => 'Tablet', 'type' => 'Obat Bebas', 'unit' => 'Strip', 'manufacturer' => 'Soho', 'price' => 45000, 'weight_in_grams' => 30, 'requires_prescription' => false, 'desc' => 'Suplemen daya tahan tubuh.', 'dosage' => 'Dewasa: 1 tablet 3x sehari'],
            ['name' => 'Betadine Antiseptic 15ml', 'generic_name' => 'Povidone Iodine', 'category' => 'P3K & Antiseptik', 'form' => 'Botol', 'type' => 'Obat Bebas', 'unit' => 'Botol', 'manufacturer' => 'Mundipharma', 'price' => 15000, 'weight_in_grams' => 50, 'requires_prescription' => false, 'desc' => 'Antiseptik untuk luka potong/gores.', 'dosage' => 'Oleskan pada area luka'],
            ['name' => 'Sanmol Sirup 60ml', 'generic_name' => 'Paracetamol', 'category' => 'Antipiretik', 'form' => 'Sirup', 'type' => 'Obat Bebas', 'unit' => 'Botol', 'manufacturer' => 'Sanbe Farma', 'price' => 22000, 'weight_in_grams' => 120, 'requires_prescription' => false, 'desc' => 'Meredakan demam dan nyeri pada anak.', 'dosage' => 'Anak 1-5 thn: 1 sendok takar 3x sehari'],
        ];

        $insertedMedicines = []; // Array akan berbentuk 2 dimensi

        foreach ($pharmaModels as $pModel) {
            foreach ($medicines as $med) {
                $m = Medicine::firstOrCreate([
                    'pharmacy_id' => $pModel->id,
                    'name' => $med['name']
                ], [
                    'category_id' => MedicineCategory::where('name', $med['category'])->first()->id,
                    'form_id' => MedicineForm::where('name', $med['form'])->first()->id,
                    'type_id' => MedicineType::where('name', $med['type'])->first()->id,
                    'unit_id' => MedicineUnit::where('name', $med['unit'])->first()->id,
                    'generic_name' => $med['generic_name'],
                    'manufacturer' => $med['manufacturer'],
                    'price' => $med['price'],
                    'weight_in_grams' => $med['weight_in_grams'],
                    'requires_prescription' => $med['requires_prescription'],
                    'description' => $med['desc'],
                    'dosage_info' => $med['dosage']
                ]);

                $insertedMedicines[$pModel->id][$med['name']] = $m;

                MedicineImage::firstOrCreate(['medicine_id' => $m->id], [
                    'image_url' => $medicineUrl,
                    'is_primary' => true
                ]);

                $batchCode = 'BCH-2026-' . strtoupper(substr(md5($med['name']), 0, 5));

                $b = MedicineBatch::firstOrCreate([
                    'medicine_id' => $m->id,
                    'batch_number' => $batchCode
                ], [
                    'expired_date' => Carbon::now()->addMonths(24)->format('Y-m-d'),
                    'stock' => 100
                ]);

                StockMovement::firstOrCreate([
                    'medicine_id' => $m->id,
                    'batch_id' => $b->id,
                    'type' => 'IN'
                ], [
                    'quantity' => $b->stock,
                    'created_by' => $createdUsers['admin@apotek.id']->id,
                    'note' => 'Initial stock'
                ]);
            }
        }

        // ==========================================
        // 5. SAMPLE ORDERS & TRACKING
        // ==========================================
        $phar1 = $pharmaModels[0]; // Apotek Sehat Selalu (Aktif)
        $medsPhar1 = $insertedMedicines[$phar1->id];

        // 1. PENDING (Belum Dibayar)
        $o1 = Order::firstOrCreate(['order_number' => 'ORD-2026-PENDING'], [
            'user_id' => $budi->id,
            'pharmacy_id' => $phar1->id,
            'address_id' => $addrBudi->id,
            'service_type' => 'DELIVERY',
            'payment_method' => 'QRIS',
            'order_status' => 'PENDING',
            'payment_status' => 'UNPAID',
            'subtotal_amount' => 12000,
            'shipping_cost' => 15000,
            'grand_total' => 27000,
            'verification_code' => strtoupper(Str::random(10)),
            'expired_at' => Carbon::now()->addHours(24)
        ]);
        OrderItem::firstOrCreate(['order_id' => $o1->id, 'medicine_id' => $medsPhar1['Panadol Extra 500mg']->id], [
            'medicine_name' => 'Panadol Extra 500mg',
            'unit_name' => 'Strip',
            'quantity' => 1,
            'price' => 12000,
            'subtotal' => 12000
        ]);

        // 2. PROCESSING (Sudah dibayar, sedang diracik Apotek)
        $o2 = Order::firstOrCreate(['order_number' => 'ORD-2026-PROCESS'], [
            'user_id' => $siti->id,
            'pharmacy_id' => $phar1->id,
            'address_id' => $addrSiti->id,
            'service_type' => 'DELIVERY',
            'payment_method' => 'VIRTUAL_ACCOUNT',
            'order_status' => 'PROCESSING',
            'payment_status' => 'PAID',
            'subtotal_amount' => 45000,
            'shipping_cost' => 10000,
            'grand_total' => 55000,
            'verification_code' => strtoupper(Str::random(10)),
            'paid_at' => Carbon::now()->subMinutes(30),
            'expired_at' => Carbon::now()->addHours(24)
        ]);
        OrderItem::firstOrCreate(['order_id' => $o2->id, 'medicine_id' => $medsPhar1['Imboost Force']->id], [
            'medicine_name' => 'Imboost Force',
            'unit_name' => 'Strip',
            'quantity' => 1,
            'price' => 45000,
            'subtotal' => 45000
        ]);

        // 3. READY_FOR_PICKUP (Ambil Sendiri di Apotek)
        $o3 = Order::firstOrCreate(['order_number' => 'ORD-2026-READY'], [
            'user_id' => $budi->id,
            'pharmacy_id' => $phar1->id,
            'service_type' => 'PICKUP',
            'payment_method' => 'QRIS',
            'order_status' => 'READY_FOR_PICKUP',
            'payment_status' => 'PAID',
            'subtotal_amount' => 15000,
            'shipping_cost' => 0,
            'grand_total' => 15000, // Pick up ongkir 0
            'verification_code' => strtoupper(Str::random(10)),
            'paid_at' => Carbon::now()->subHours(1),
            'expired_at' => Carbon::now()->addHours(24)
        ]);
        OrderItem::firstOrCreate(['order_id' => $o3->id, 'medicine_id' => $medsPhar1['Betadine Antiseptic 15ml']->id], [
            'medicine_name' => 'Betadine Antiseptic 15ml',
            'unit_name' => 'Botol',
            'quantity' => 1,
            'price' => 15000,
            'subtotal' => 15000
        ]);

        // 4. SHIPPED (Kurir Sedang Mengantar)
        $o4 = Order::firstOrCreate(['order_number' => 'ORD-2026-SHIPPED'], [
            'user_id' => $siti->id,
            'pharmacy_id' => $phar1->id,
            'address_id' => $addrSiti->id,
            'service_type' => 'DELIVERY',
            'payment_method' => 'QRIS',
            'order_status' => 'SHIPPED',
            'payment_status' => 'PAID',
            'subtotal_amount' => 22000,
            'shipping_cost' => 15000,
            'grand_total' => 37000,
            'verification_code' => strtoupper(Str::random(10)),
            'paid_at' => Carbon::now()->subHours(2),
            'expired_at' => Carbon::now()->addHours(24)
        ]);
        OrderItem::firstOrCreate(['order_id' => $o4->id, 'medicine_id' => $medsPhar1['Sanmol Sirup 60ml']->id], [
            'medicine_name' => 'Sanmol Sirup 60ml',
            'unit_name' => 'Botol',
            'quantity' => 1,
            'price' => 22000,
            'subtotal' => 22000
        ]);
        $track4 = DeliveryTracking::firstOrCreate(['order_id' => $o4->id], [
            'biteship_id' => 'bts_shipped_123',
            'courier_name' => 'Grab Express',
            'tracking_number' => 'GRB-99999',
            'status' => 'DROPPING_OFF'
        ]);
        DeliveryTrackingLog::create(['delivery_tracking_id' => $track4->id, 'status' => 'PICKED_UP', 'description' => 'Pesanan dibawa kurir']);

        // 5. DELIVERED (Pesanan Sampai, Belum di Review User)
        $o5 = Order::firstOrCreate(['order_number' => 'ORD-2026-DELIVERED'], [
            'user_id' => $budi->id,
            'pharmacy_id' => $phar1->id,
            'address_id' => $addrBudi->id,
            'service_type' => 'DELIVERY',
            'payment_method' => 'QRIS',
            'order_status' => 'DELIVERED',
            'payment_status' => 'PAID',
            'subtotal_amount' => 9000,
            'shipping_cost' => 12000,
            'grand_total' => 21000,
            'verification_code' => strtoupper(Str::random(10)),
            'paid_at' => Carbon::now()->subDays(1),
            'expired_at' => Carbon::now()->addHours(24)
        ]);
        OrderItem::firstOrCreate(['order_id' => $o5->id, 'medicine_id' => $medsPhar1['Promag Tablet']->id], [
            'medicine_name' => 'Promag Tablet',
            'unit_name' => 'Strip',
            'quantity' => 1,
            'price' => 9000,
            'subtotal' => 9000
        ]);
        DeliveryTracking::firstOrCreate(['order_id' => $o5->id], [
            'biteship_id' => 'bts_deliv_123',
            'courier_name' => 'Gojek Instant',
            'tracking_number' => 'GOJ-11111',
            'status' => 'DELIVERED'
        ]);

        // 6. COMPLETED (Sudah selesai dan di Review)
        $o6 = Order::firstOrCreate(['order_number' => 'ORD-2026-COMPLETED'], [
            'user_id' => $siti->id,
            'pharmacy_id' => $phar1->id,
            'address_id' => $addrSiti->id,
            'service_type' => 'DELIVERY',
            'payment_method' => 'QRIS',
            'order_status' => 'COMPLETED',
            'payment_status' => 'PAID',
            'subtotal_amount' => 12000,
            'shipping_cost' => 15000,
            'grand_total' => 27000,
            'verification_code' => strtoupper(Str::random(10)),
            'paid_at' => Carbon::now()->subDays(3),
            'expired_at' => Carbon::now()->addHours(24)
        ]);
        OrderItem::firstOrCreate(['order_id' => $o6->id, 'medicine_id' => $medsPhar1['Panadol Extra 500mg']->id], [
            'medicine_name' => 'Panadol Extra 500mg',
            'unit_name' => 'Strip',
            'quantity' => 1,
            'price' => 12000,
            'subtotal' => 12000
        ]);
        Review::firstOrCreate(['order_id' => $o6->id], [
            'user_id' => $siti->id,
            'pharmacy_id' => $phar1->id,
            'rating' => 5,
            'comment' => 'Sangat membantu di saat sakit malam-malam!'
        ]);

        // 7. CANCELLED (Dibatalkan beserta alasan)
        $o7 = Order::firstOrCreate(['order_number' => 'ORD-2026-CANCELLED'], [
            'user_id' => $budi->id,
            'pharmacy_id' => $phar1->id,
            'service_type' => 'DELIVERY',
            'payment_method' => 'QRIS',
            'order_status' => 'CANCELLED',
            'payment_status' => 'UNPAID',
            'subtotal_amount' => 45000,
            'shipping_cost' => 20000,
            'grand_total' => 65000,
            'verification_code' => strtoupper(Str::random(10)),
            'cancellation_reason' => 'User tidak melakukan pembayaran hingga batas waktu habis (Expired).',
            'expired_at' => Carbon::now()->subHours(1)
        ]);
        OrderItem::firstOrCreate(['order_id' => $o7->id, 'medicine_id' => $medsPhar1['Imboost Force']->id], [
            'medicine_name' => 'Imboost Force',
            'unit_name' => 'Strip',
            'quantity' => 1,
            'price' => 45000,
            'subtotal' => 45000
        ]);
    }
}
