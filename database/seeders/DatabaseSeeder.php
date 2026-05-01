<?php

namespace Database\Seeders;

use App\Models\AuditLog;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\UserAddress;
use App\Models\Pharmacy;
use App\Models\PharmacyImage;
use App\Models\PharmacyDocument; // <-- Model Baru
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
use App\Models\Prescription;
use App\Models\DeliveryTracking;
use App\Models\DeliveryTrackingLog;
use App\Models\Notification;
use App\Models\PharmacyLegality;
use App\Models\Review;
use App\Models\StockMovement;
use Carbon\Carbon;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Konstanta URL Supabase (Tetap)
        $avatarUrl = 'https://rccoezzqqntpdarqqkht.supabase.co/storage/v1/object/public/apotrack-public/avatar/avatar.jpg';
        $pharmacyUrl = 'https://rccoezzqqntpdarqqkht.supabase.co/storage/v1/object/public/apotrack-public/pharmacies/pharmacy.jpg';
        $medicineUrl = 'https://rccoezzqqntpdarqqkht.supabase.co/storage/v1/object/public/apotrack-public/medicines/medicines.jpg';
        $licenseUrl = 'https://rccoezzqqntpdarqqkht.supabase.co/storage/v1/object/public/apotrack-private/licenses/license.jpeg';
        $prescriptionUrl = 'https://rccoezzqqntpdarqqkht.supabase.co/storage/v1/object/public/apotrack-private/prescriptions/resep-dokter.jpg';

        // ==========================================
        // 1. MASTER DATA SEEDS
        // ==========================================
        $categories = ['Antibiotik', 'Analgesik', 'Antipiretik', 'Antihipertensi', 'Antidiabetes', 'Vitamin & Suplemen', 'Antihistamin', 'Antasida & GERD', 'Batuk & Flu', 'P3K & Antiseptik', 'Kesehatan Mata', 'Ibu & Bayi'];
        foreach ($categories as $cat) {
            MedicineCategory::firstOrCreate(['name' => $cat]);
        }

        $forms = ['Tablet', 'Kapsul', 'Sirup', 'Suspensi', 'Tetes (mata/telinga)', 'Salep / Krim', 'Injeksi', 'Botol', 'Sachet'];
        foreach ($forms as $form) {
            MedicineForm::firstOrCreate(['name' => $form]);
        }

        $types = ['Obat Bebas', 'Obat Bebas Terbatas', 'Obat Wajib Apotek', 'Obat Keras', 'Alat Kesehatan', 'Herbal'];
        foreach ($types as $type) {
            MedicineType::firstOrCreate(['name' => $type]);
        }

        $units = ['Strip', 'Box', 'Botol', 'Tube', 'Pcs', 'Sachet'];
        foreach ($units as $unit) {
            MedicineUnit::firstOrCreate(['name' => $unit]);
        }

        // ==========================================
        // 2. USER & ADDRESS SEEDS (REVISED)
        // ==========================================
        // Semua user selain admin adalah 'USER'. Peran di apotek diatur di PharmacyStaff.
        $users = [
            ['username' => 'Super Admin', 'email' => 'admin@apotek.id', 'phone' => '081111111111', 'role' => 'SUPER_ADMIN', 'avatar_url' => $avatarUrl, 'is_active' => true],
            ['username' => 'Budi Santoso', 'email' => 'budi@customer.id', 'phone' => '082222222222', 'role' => 'USER', 'avatar_url' => $avatarUrl, 'is_active' => true],
            ['username' => 'Siti Rahayu', 'email' => 'siti@customer.id', 'phone' => '083333333333', 'role' => 'USER', 'avatar_url' => $avatarUrl, 'is_active' => true],
            ['username' => 'Dr. Prayitno Apoteker', 'email' => 'prayitno@apotek.id', 'phone' => '084444444444', 'role' => 'USER', 'avatar_url' => $avatarUrl, 'is_active' => true],
            ['username' => 'Rina Staff', 'email' => 'rina@apotek.id', 'phone' => '085555555555', 'role' => 'USER', 'avatar_url' => $avatarUrl, 'is_active' => true],
            ['username' => 'Dr. Andi Apoteker', 'email' => 'andi@apotek2.id', 'phone' => '087777777777', 'role' => 'USER', 'avatar_url' => $avatarUrl, 'is_active' => true], // Apoteker cabang lain
            ['username' => 'Hanif Nakal', 'email' => 'hanif@banned.id', 'phone' => '086666666666', 'role' => 'USER', 'avatar_url' => $avatarUrl, 'is_active' => false],
        ];

        $createdUsers = [];
        $superAdmin = null;

        foreach ($users as $u) {
            $u['password_hash'] = Hash::make('Test@12345');
            $userModel = User::firstOrCreate(['email' => $u['email']], $u);
            $createdUsers[$u['email']] = $userModel;

            if ($u['role'] === 'SUPER_ADMIN') {
                $superAdmin = $userModel;
            }
        }

        // Addresses
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
        // 3. PHARMACY SEEDS (REVISED)
        // ==========================================
        // Menghapus 'license_document_url' dan menambahkan data dokumen ke tabel terpisah
        $pharmacies = [
            [
                'name' => 'Apotek Sehat Selalu',
                'address' => 'Jl. Sudirman No. 10, Jakarta Pusat',
                'phone' => '021-12345678',
                'latitude' => -6.2088,
                'longitude' => 106.8456,
                'rating' => 4.8,
                'total_reviews' => 124,
                'sia_number' => 'SIA-2024-0001',
                'verification_status' => 'VERIFIED',
                'is_active' => true,
                'is_force_closed' => false,
                'verified_by' => $superAdmin->id,
                'verified_at' => Carbon::now()->subMonths(6)
            ],
            [
                'name' => 'Apotek Farma Prima (Tutup Sementara)',
                'address' => 'Jl. Gatot Subroto No. 55, Jakarta Selatan',
                'phone' => '021-98765432',
                'latitude' => -6.2350,
                'longitude' => 106.8200,
                'rating' => 4.5,
                'total_reviews' => 89,
                'sia_number' => 'SIA-2024-0055',
                'verification_status' => 'VERIFIED',
                'is_active' => true,
                'is_force_closed' => true,
                'verified_by' => $superAdmin->id,
                'verified_at' => Carbon::now()->subMonths(2)
            ],
            [
                'name' => 'Apotek Abal Abal',
                'address' => 'Jl. Gelap Gulita No. 99, Jakarta Timur',
                'phone' => '021-00000000',
                'latitude' => -6.2500,
                'longitude' => 106.8500,
                'rating' => 0,
                'total_reviews' => 0,
                'sia_number' => 'SIA-PALSU-123',
                'verification_status' => 'REJECTED',
                'is_active' => false,
                'is_force_closed' => false,
                'verified_by' => $superAdmin->id,
                'verified_at' => Carbon::now()->subDays(5),
                'rejection_reason' => 'Dokumen SIA buram dan SIPA sudah kadaluarsa.' // Kolom baru
            ],
            [
                'name' => 'Apotek Baru Buka',
                'address' => 'Jl. Merdeka No. 1, Jakarta Utara',
                'phone' => '021-88889999',
                'latitude' => -6.1500,
                'longitude' => 106.9000,
                'rating' => 0,
                'total_reviews' => 0,
                'sia_number' => 'SIA-2024-0099',
                'verification_status' => 'PENDING',
                'is_active' => false,
                'is_force_closed' => false,
                'verified_by' => null,
                'verified_at' => null
            ]
        ];

        $pharmaModels = [];
        foreach ($pharmacies as $p) {
            $pharmacyData = collect($p)->except('sia_number')->toArray();
            $pharmaModel = Pharmacy::firstOrCreate(['name' => $p['name']], $pharmacyData);
            $pharmaModels[] = $pharmaModel;

            PharmacyImage::firstOrCreate(['pharmacy_id' => $pharmaModel->id], [
                'image_url' => $pharmacyUrl,
                'is_primary' => true
            ]);

            // Seeding Pharmacy Documents (Implementasi Tabel Baru)
            $documents = ['SIA', 'SIPA', 'KTP_PEMILIK'];
            foreach ($documents as $docType) {
                PharmacyLegality::firstOrCreate([
                    'pharmacy_id' => $pharmaModel->id,
                ], [
                    'sia_number'       => $p['sia_number'] ?? 'SIA-000-111',
                    'sipa_number'      => 'SIPA-' . rand(1000, 9999),
                    'stra_number'      => 'STRA-' . rand(1000, 9999),
                    'apoteker_nik'     => '317' . rand(1000000000000, 9999999999999),
                    'sia_document_url' => $licenseUrl,
                ]);
            }

            for ($i = 0; $i <= 6; $i++) {
                PharmacyOperatingHour::updateOrCreate(
                    ['pharmacy_id' => $pharmaModel->id, 'day_of_week' => $i],
                    ['open_time' => '08:00:00', 'close_time' => '22:00:00']
                );
            }
        }

        // Staff Assignments (Local Role Isolation)
        PharmacyStaff::firstOrCreate(['pharmacy_id' => $pharmaModels[0]->id, 'user_id' => $createdUsers['prayitno@apotek.id']->id], ['role' => 'APOTEKER']);
        PharmacyStaff::firstOrCreate(['pharmacy_id' => $pharmaModels[0]->id, 'user_id' => $createdUsers['rina@apotek.id']->id], ['role' => 'STAFF']);

        // Dokter Andi adalah Apoteker di cabang 'Apotek Farma Prima'
        PharmacyStaff::firstOrCreate(['pharmacy_id' => $pharmaModels[1]->id, 'user_id' => $createdUsers['andi@apotek2.id']->id], ['role' => 'APOTEKER']);

        // ==========================================
        // 4. MEDICINE SEEDS (EXPANDED)
        // ==========================================
        $medicines = [
            ['name' => 'Panadol Extra 500mg', 'generic_name' => 'Paracetamol + Caffeine', 'category' => 'Analgesik', 'form' => 'Tablet', 'type' => 'Obat Bebas', 'unit' => 'Strip', 'manufacturer' => 'GSK', 'price' => 12000, 'weight_in_grams' => 20, 'requires_prescription' => false, 'desc' => 'Meredakan sakit kepala.', 'dosage' => 'Dewasa: 1 tablet'],
            ['name' => 'Amoxicillin 500mg', 'generic_name' => 'Amoxicillin Trihydrate', 'category' => 'Antibiotik', 'form' => 'Kapsul', 'type' => 'Obat Keras', 'unit' => 'Strip', 'manufacturer' => 'Kimia Farma', 'price' => 8500, 'weight_in_grams' => 15, 'requires_prescription' => true, 'desc' => 'Antibiotik penisilin.', 'dosage' => 'Sesuai petunjuk dokter'],
            ['name' => 'Promag Tablet', 'generic_name' => 'Hydrotalcite, Mg(OH)2', 'category' => 'Antasida & GERD', 'form' => 'Tablet', 'type' => 'Obat Bebas', 'unit' => 'Strip', 'manufacturer' => 'Kalbe Farma', 'price' => 9000, 'weight_in_grams' => 25, 'requires_prescription' => false, 'desc' => 'Mengurangi gejala maag.', 'dosage' => '1-2 tablet, dikunyah'],
            ['name' => 'Imboost Force', 'generic_name' => 'Echinacea, Zinc', 'category' => 'Vitamin & Suplemen', 'form' => 'Tablet', 'type' => 'Obat Bebas', 'unit' => 'Strip', 'manufacturer' => 'Soho', 'price' => 45000, 'weight_in_grams' => 30, 'requires_prescription' => false, 'desc' => 'Suplemen daya tahan tubuh.', 'dosage' => 'Dewasa: 1 tablet 3x sehari'],
            ['name' => 'Betadine Antiseptic 15ml', 'generic_name' => 'Povidone Iodine', 'category' => 'P3K & Antiseptik', 'form' => 'Botol', 'type' => 'Obat Bebas', 'unit' => 'Botol', 'manufacturer' => 'Mundipharma', 'price' => 15000, 'weight_in_grams' => 50, 'requires_prescription' => false, 'desc' => 'Antiseptik untuk luka.', 'dosage' => 'Oleskan pada luka'],
            ['name' => 'Sanmol Sirup 60ml', 'generic_name' => 'Paracetamol', 'category' => 'Antipiretik', 'form' => 'Sirup', 'type' => 'Obat Bebas', 'unit' => 'Botol', 'manufacturer' => 'Sanbe Farma', 'price' => 22000, 'weight_in_grams' => 120, 'requires_prescription' => false, 'desc' => 'Meredakan demam anak.', 'dosage' => 'Sesuai umur anak'],
            // Tambahan
            ['name' => 'Insto Regular 7.5ml', 'generic_name' => 'Tetrahydrozoline', 'category' => 'Kesehatan Mata', 'form' => 'Tetes (mata/telinga)', 'type' => 'Obat Bebas Terbatas', 'unit' => 'Botol', 'manufacturer' => 'Pharma', 'price' => 14000, 'weight_in_grams' => 20, 'requires_prescription' => false, 'desc' => 'Meredakan mata merah.', 'dosage' => '1-2 tetes'],
            ['name' => 'Tolak Angin Cair', 'generic_name' => 'Herbal Extract', 'category' => 'Batuk & Flu', 'form' => 'Sachet', 'type' => 'Herbal', 'unit' => 'Box', 'manufacturer' => 'Sido Muncul', 'price' => 35000, 'weight_in_grams' => 150, 'requires_prescription' => false, 'desc' => 'Mengatasi masuk angin.', 'dosage' => '1 sachet jika perlu'],
            ['name' => 'Amlodipine 5mg', 'generic_name' => 'Amlodipine Besylate', 'category' => 'Antihipertensi', 'form' => 'Tablet', 'type' => 'Obat Keras', 'unit' => 'Strip', 'manufacturer' => 'Dexa Medica', 'price' => 6000, 'weight_in_grams' => 10, 'requires_prescription' => true, 'desc' => 'Obat penurun darah tinggi.', 'dosage' => 'Sesuai petunjuk dokter'],
            ['name' => 'Metformin 500mg', 'generic_name' => 'Metformin HCl', 'category' => 'Antidiabetes', 'form' => 'Tablet', 'type' => 'Obat Keras', 'unit' => 'Strip', 'manufacturer' => 'Bernofarm', 'price' => 5000, 'weight_in_grams' => 10, 'requires_prescription' => true, 'desc' => 'Obat diabetes melitus tipe 2.', 'dosage' => 'Sesuai petunjuk dokter'],
        ];

        $insertedMedicines = [];

        foreach ($pharmaModels as $pModel) {
            // Hanya seed obat ke apotek yang Verified (index 0 dan 1)
            if ($pModel->verification_status !== 'VERIFIED') continue;

            foreach ($medicines as $med) {
                // Variasikan stok dan status aktif untuk testing
                $isActive = (rand(1, 10) > 1); // 90% obat aktif

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
                    'dosage_info' => $med['dosage'],
                    'image_url' => $medicineUrl,
                    'is_active' => $isActive
                ]);

                $insertedMedicines[$pModel->id][$med['name']] = $m;



                // Buat 2 batch untuk setiap obat (untuk test expired date & pergerakan stok)
                $batchCode1 = 'BCH1-' . strtoupper(substr(md5($med['name'] . '1'), 0, 5));
                $batchCode2 = 'BCH2-' . strtoupper(substr(md5($med['name'] . '2'), 0, 5));

                $stock1 = rand(10, 50);
                $stock2 = rand(0, 30); // Berpotensi 0 untuk test out-of-stock

                $b1 = MedicineBatch::firstOrCreate([
                    'medicine_id' => $m->id,
                    'batch_number' => $batchCode1
                ], [
                    'expired_date' => Carbon::now()->addMonths(6)->format('Y-m-d'), // Hampir expired
                    'stock' => $stock1
                ]);

                $b2 = MedicineBatch::firstOrCreate([
                    'medicine_id' => $m->id,
                    'batch_number' => $batchCode2
                ], [
                    'expired_date' => Carbon::now()->addMonths(24)->format('Y-m-d'), // Masih lama
                    'stock' => $stock2
                ]);

                // Update total active stock (simulasi dari observer/trigger)
                $m->update(['total_active_stock' => $stock1 + $stock2]);

                StockMovement::firstOrCreate([
                    'medicine_id' => $m->id,
                    'batch_id' => $b1->id,
                    'type' => 'IN'
                ], [
                    'quantity' => $stock1,
                    'created_by' => $superAdmin->id,
                    'note' => 'Initial stock Batch 1'
                ]);
            }
        }

        // ==========================================
        // 5. SAMPLE ORDERS & TRACKING (EXPANDED)
        // ==========================================
        $phar1 = $pharmaModels[0];
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
        OrderItem::firstOrCreate(['order_id' => $o1->id, 'medicine_id' => $medsPhar1['Panadol Extra 500mg']->id], ['medicine_name' => 'Panadol Extra 500mg', 'unit_name' => 'Strip', 'quantity' => 1, 'price' => 12000, 'subtotal' => 12000]);

        // 2. PROCESSING (Sudah dibayar, sedang diracik)
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
        OrderItem::firstOrCreate(['order_id' => $o2->id, 'medicine_id' => $medsPhar1['Imboost Force']->id], ['medicine_name' => 'Imboost Force', 'unit_name' => 'Strip', 'quantity' => 1, 'price' => 45000, 'subtotal' => 45000]);

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
            'grand_total' => 15000,
            'verification_code' => strtoupper(Str::random(10)),
            'paid_at' => Carbon::now()->subHours(1),
            'expired_at' => Carbon::now()->addHours(24)
        ]);
        OrderItem::firstOrCreate(['order_id' => $o3->id, 'medicine_id' => $medsPhar1['Betadine Antiseptic 15ml']->id], ['medicine_name' => 'Betadine Antiseptic 15ml', 'unit_name' => 'Botol', 'quantity' => 1, 'price' => 15000, 'subtotal' => 15000]);

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
        OrderItem::firstOrCreate(['order_id' => $o4->id, 'medicine_id' => $medsPhar1['Sanmol Sirup 60ml']->id], ['medicine_name' => 'Sanmol Sirup 60ml', 'unit_name' => 'Botol', 'quantity' => 1, 'price' => 22000, 'subtotal' => 22000]);
        $track4 = DeliveryTracking::firstOrCreate(['order_id' => $o4->id], ['biteship_id' => 'bts_shipped_123', 'courier_name' => 'Grab Express', 'tracking_number' => 'GRB-99999', 'status' => 'DROPPING_OFF']);
        DeliveryTrackingLog::create(['delivery_tracking_id' => $track4->id, 'status' => 'PICKED_UP', 'description' => 'Pesanan dibawa kurir']);

        // 5. COMPLETED (Dengan Resep)
        // Membuat data Prescription terlebih dahulu
        $presc1 = Prescription::firstOrCreate(['image_url' => $prescriptionUrl], [
            'user_id' => $budi->id,
            'doctor_name' => 'Dr. Cipto Mangunkusumo',
            'patient_name' => 'Budi Santoso',
            'issued_date' => Carbon::now()->subDays(2),
            'status' => 'VERIFIED',
            'verified_by' => $createdUsers['prayitno@apotek.id']->id,
            'verified_at' => Carbon::now()->subDays(2)
        ]);

        $o5 = Order::firstOrCreate(['order_number' => 'ORD-2026-PRESCRIPTION'], [
            'user_id' => $budi->id,
            'pharmacy_id' => $phar1->id,
            'address_id' => $addrBudi->id,
            'prescription_id' => $presc1->id, // Hubungkan dengan resep
            'service_type' => 'DELIVERY',
            'payment_method' => 'BANK_TRANSFER',
            'order_status' => 'COMPLETED',
            'payment_status' => 'PAID',
            'subtotal_amount' => 17000, // 8500 (Amoxicillin) + 8500 (Amoxicillin)
            'shipping_cost' => 12000,
            'grand_total' => 29000,
            'verification_code' => strtoupper(Str::random(10)),
            'paid_at' => Carbon::now()->subDays(1),
            'expired_at' => Carbon::now()->addHours(24)
        ]);

        // Update ID order di tabel resep
        $presc1->update(['order_id' => $o5->id]);

        OrderItem::firstOrCreate(['order_id' => $o5->id, 'medicine_id' => $medsPhar1['Amoxicillin 500mg']->id], ['medicine_name' => 'Amoxicillin 500mg', 'unit_name' => 'Strip', 'requires_prescription' => true, 'quantity' => 2, 'price' => 8500, 'subtotal' => 17000]);

        Review::firstOrCreate(['order_id' => $o5->id], [
            'user_id' => $budi->id,
            'pharmacy_id' => $phar1->id,
            'rating' => 4,
            'comment' => 'Proses verifikasi resep cepat.'
        ]);

        // 6. CANCELLED (Dibatalkan)
        $o6 = Order::firstOrCreate(['order_number' => 'ORD-2026-CANCELLED'], [
            'user_id' => $siti->id,
            'pharmacy_id' => $phar1->id,
            'service_type' => 'PICKUP',
            'payment_method' => 'QRIS',
            'order_status' => 'CANCELLED',
            'payment_status' => 'UNPAID',
            'subtotal_amount' => 35000,
            'shipping_cost' => 0,
            'grand_total' => 35000,
            'verification_code' => strtoupper(Str::random(10)),
            'cancellation_reason' => 'Dibatalkan oleh sistem (Expired).',
            'expired_at' => Carbon::now()->subHours(5)
        ]);
        OrderItem::firstOrCreate(['order_id' => $o6->id, 'medicine_id' => $medsPhar1['Tolak Angin Cair']->id], ['medicine_name' => 'Tolak Angin Cair', 'unit_name' => 'Box', 'quantity' => 1, 'price' => 35000, 'subtotal' => 35000]);

        // ==========================================
        // 6. NOTIFICATION SEEDS
        // ==========================================
        $notifications = [
            // Notifikasi Sistem (Budi)
            [
                'user_id' => $budi->id,
                'title' => 'Selamat Datang di ApoTrack!',
                'message' => 'Terima kasih telah mendaftar. Nikmati kemudahan tebus resep dan beli obat langsung dari rumah.',
                'type' => 'SYSTEM',
                'is_read' => true,
                'read_at' => Carbon::now()->subDays(5),
                'created_at' => Carbon::now()->subDays(5)
            ],
            // Notifikasi Order (Siti - PROCESSING)
            [
                'user_id' => $siti->id,
                'title' => 'Pesanan Diproses',
                'message' => 'Pesanan Anda (' . $o2->order_number . ') sedang disiapkan oleh apotek.',
                'type' => 'ORDER_UPDATE',
                'reference_type' => 'Order',
                'reference_id' => $o2->id,
                'is_read' => false,
                'read_at' => null,
                'created_at' => Carbon::now()->subMinutes(30)
            ],
            // Notifikasi Order (Siti - SHIPPED)
            [
                'user_id' => $siti->id,
                'title' => 'Pesanan Sedang Dikirim',
                'message' => 'Pesanan Anda (' . $o4->order_number . ') sedang dalam perjalanan oleh kurir.',
                'type' => 'ORDER_UPDATE',
                'reference_type' => 'Order',
                'reference_id' => $o4->id,
                'is_read' => false,
                'read_at' => null,
                'created_at' => Carbon::now()->subHours(2)
            ],
            // Notifikasi Resep (Budi - COMPLETED)
            [
                'user_id' => $budi->id,
                'title' => 'Resep Diverifikasi',
                'message' => 'Resep Anda telah diverifikasi oleh Apoteker. Pesanan Anda sudah selesai.',
                'type' => 'PRESCRIPTION_UPDATE',
                'reference_type' => 'Order',
                'reference_id' => $o5->id,
                'is_read' => true,
                'read_at' => Carbon::now()->subHours(12),
                'created_at' => Carbon::now()->subDays(1)
            ],
        ];

        foreach ($notifications as $notif) {
            Notification::create($notif);
        }

        // ==========================================
        // 7. AUDIT LOGS SEEDS
        // ==========================================
        $auditLogs = [
            // Super Admin memverifikasi apotek
            [
                'user_id' => $superAdmin->id,
                'action' => 'PHARMACY_VERIFIED',
                'description' => 'Memverifikasi Apotek Sehat Selalu berdasarkan dokumen SIA dan SIPA yang valid.',
                'ip_address' => '192.168.1.100',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
                'metadata' => json_encode(['pharmacy_id' => $phar1->id, 'pharmacy_name' => $phar1->name]),
                'status' => 'SUCCESS',
                'created_at' => Carbon::now()->subMonths(6)
            ],
            // Super Admin menolak apotek
            [
                'user_id' => $superAdmin->id,
                'action' => 'PHARMACY_REJECTED',
                'description' => 'Menolak verifikasi Apotek Abal Abal karena dokumen tidak valid.',
                'ip_address' => '192.168.1.100',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
                'metadata' => json_encode(['pharmacy_name' => 'Apotek Abal Abal']),
                'status' => 'SUCCESS',
                'created_at' => Carbon::now()->subDays(5)
            ],
            // Dr. Prayitno (Apoteker) login
            [
                'user_id' => $createdUsers['prayitno@apotek.id']->id,
                'action' => 'LOGIN',
                'description' => 'User berhasil login ke sistem manajemen apotek.',
                'ip_address' => '114.122.10.55',
                'user_agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
                'metadata' => json_encode(['device' => 'Desktop']),
                'status' => 'SUCCESS',
                'created_at' => Carbon::now()->subHours(8)
            ],
            // Hanif Nakal gagal login karena dibanned
            [
                'user_id' => $createdUsers['hanif@banned.id']->id,
                'action' => 'LOGIN',
                'description' => 'Gagal login karena status akun tidak aktif (banned).',
                'ip_address' => '202.10.15.10',
                'user_agent' => 'Mozilla/5.0 (Linux; Android 13; SM-S918B) Chrome/119.0.0.0',
                'metadata' => json_encode(['reason' => 'account_inactive']),
                'status' => 'FAILED',
                'created_at' => Carbon::now()->subHours(2)
            ],
            // Order creation oleh Budi
            [
                'user_id' => $budi->id,
                'action' => 'ORDER_CREATED',
                'description' => 'Membuat pesanan baru dengan nomor ' . $o1->order_number,
                'ip_address' => '180.252.11.20',
                'user_agent' => 'ApoTrack Mobile App / v1.0.0 (Android)',
                'metadata' => json_encode(['order_id' => $o1->id, 'total' => 27000]),
                'status' => 'SUCCESS',
                'created_at' => Carbon::now()->subMinutes(10)
            ],
        ];

        foreach ($auditLogs as $log) {
            AuditLog::create($log);
        }
    }
}
