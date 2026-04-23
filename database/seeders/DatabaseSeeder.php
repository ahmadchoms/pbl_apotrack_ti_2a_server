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
            ['username' => 'Super Admin', 'email' => 'admin@apotek.id', 'role' => 'SUPER_ADMIN', 'avatar_url' => $avatarUrl],
            ['username' => 'Budi Santoso', 'email' => 'budi@customer.id', 'role' => 'CUSTOMER', 'avatar_url' => $avatarUrl],
            ['username' => 'Siti Rahayu', 'email' => 'siti@customer.id', 'role' => 'CUSTOMER', 'avatar_url' => $avatarUrl],
            ['username' => 'Dr. Ahmad Apoteker', 'email' => 'ahmad@apotek.id', 'role' => 'APOTEKER', 'avatar_url' => $avatarUrl],
            ['username' => 'Rina Staff', 'email' => 'rina@apotek.id', 'role' => 'PHARMACY_STAFF', 'avatar_url' => $avatarUrl],
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
                'verification_status' => 'VERIFIED'
            ],
            [
                'name' => 'Apotek Farma Prima',
                'address' => 'Jl. Gatot Subroto No. 55, Jakarta Selatan',
                'phone' => '021-98765432',
                'latitude' => -6.2350,
                'longitude' => 106.8200,
                'rating' => 4.5,
                'total_reviews' => 89,
                'license_number' => 'SIA-2024-0055',
                'license_document_url' => $licenseUrl,
                'verification_status' => 'VERIFIED'
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

        PharmacyStaff::firstOrCreate(['pharmacy_id' => $pharmaModels[0]->id, 'user_id' => $createdUsers['ahmad@apotek.id']->id], ['role' => 'APOTEKER']);
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

        $insertedMedicines = [];

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
                $insertedMedicines[$med['name']] = $m;

                MedicineImage::firstOrCreate(['medicine_id' => $m->id], [
                    'image_url' => $medicineUrl,
                    'is_primary' => true
                ]);

                $b = MedicineBatch::firstOrCreate([
                    'medicine_id' => $m->id,
                    'batch_number' => 'BCH-' . date('Ym') . '-' . rand(100, 999)
                ], [
                    'expired_date' => Carbon::now()->addMonths(rand(12, 36))->format('Y-m-d'),
                    'stock' => rand(50, 200)
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
        $phar1 = $pharmaModels[0];

        $o1 = Order::firstOrCreate(['order_number' => 'ORD-' . date('Ymd') . '-001'], [
            'user_id' => $budi->id,
            'pharmacy_id' => $phar1->id,
            'address_id' => $addrBudi->id,
            'service_type' => 'DELIVERY',
            'payment_method' => 'QRIS',
            'order_status' => 'DELIVERED',
            'payment_status' => 'PAID',
            'subtotal_amount' => 45000,
            'shipping_cost' => 15000,
            'grand_total' => 60000,
            'paid_at' => Carbon::now()->subDays(2),
            'expired_at' => Carbon::now()->addHour()
        ]);
        OrderItem::firstOrCreate(['order_id' => $o1->id, 'medicine_id' => $insertedMedicines['Imboost Force']->id], [
            'medicine_name' => 'Imboost Force',
            'unit_name' => 'Strip',
            'quantity' => 1,
            'price' => 45000,
            'subtotal' => 45000
        ]);

        $track1 = DeliveryTracking::firstOrCreate(['order_id' => $o1->id], [
            'biteship_id' => 'bts_' . Str::random(10),
            'courier_name' => 'Grab Express',
            'tracking_number' => 'GRB-' . rand(100000, 999999),
            'status' => 'DELIVERED'
        ]);
        DeliveryTrackingLog::create(['delivery_tracking_id' => $track1->id, 'status' => 'ALLOCATING', 'description' => 'Mencari kurir Grab']);
        DeliveryTrackingLog::create(['delivery_tracking_id' => $track1->id, 'status' => 'PICKED_UP', 'description' => 'Kurir membawa pesanan']);
        DeliveryTrackingLog::create(['delivery_tracking_id' => $track1->id, 'status' => 'DELIVERED', 'description' => 'Pesanan diterima oleh Budi']);

        Review::firstOrCreate(['order_id' => $o1->id], [
            'user_id' => $budi->id,
            'pharmacy_id' => $phar1->id,
            'rating' => 5,
            'comment' => 'Pengiriman super cepat dan packing aman.'
        ]);


        $o2 = Order::firstOrCreate(['order_number' => 'ORD-' . date('Ymd') . '-002'], [
            'user_id' => $siti->id,
            'pharmacy_id' => $phar1->id,
            'address_id' => $addrSiti->id,
            'service_type' => 'DELIVERY',
            'payment_method' => 'COD',
            'order_status' => 'SHIPPED',
            'payment_status' => 'UNPAID',
            'subtotal_amount' => 24000,
            'shipping_cost' => 12000,
            'grand_total' => 36000,
            'expired_at' => Carbon::now()->addHour()
        ]);
        OrderItem::firstOrCreate(['order_id' => $o2->id, 'medicine_id' => $insertedMedicines['Panadol Extra 500mg']->id], [
            'medicine_name' => 'Panadol Extra 500mg',
            'unit_name' => 'Strip',
            'quantity' => 2,
            'price' => 12000,
            'subtotal' => 24000
        ]);

        $track2 = DeliveryTracking::firstOrCreate(['order_id' => $o2->id], [
            'biteship_id' => 'bts_' . Str::random(10),
            'courier_name' => 'Gojek Instant',
            'tracking_number' => 'GOJ-' . rand(100000, 999999),
            'status' => 'DROPPING_OFF'
        ]);
        DeliveryTrackingLog::create(['delivery_tracking_id' => $track2->id, 'status' => 'PICKED_UP', 'description' => 'Apotek telah menyerahkan obat ke Kurir Gojek']);


        $presc = Prescription::firstOrCreate(['image_url' => $prescriptionUrl], [
            'user_id' => $budi->id,
            'doctor_name' => 'Dr. Cipto Mangunkusumo',
            'patient_name' => 'Budi Santoso',
            'status' => 'VERIFIED',
            'verified_by' => $createdUsers['ahmad@apotek.id']->id,
            'verified_at' => Carbon::now()
        ]);

        $o3 = Order::firstOrCreate(['order_number' => 'ORD-' . date('Ymd') . '-003'], [
            'user_id' => $budi->id,
            'pharmacy_id' => $phar1->id,
            'prescription_id' => $presc->id,
            'service_type' => 'PICKUP',
            'payment_method' => 'QRIS',
            'order_status' => 'PENDING',
            'payment_status' => 'UNPAID',
            'subtotal_amount' => 8500,
            'grand_total' => 8500,
            'expired_at' => Carbon::now()->addHours(24)
        ]);

        $presc->update(['order_id' => $o3->id]);

        OrderItem::firstOrCreate(['order_id' => $o3->id, 'medicine_id' => $insertedMedicines['Amoxicillin 500mg']->id], [
            'medicine_name' => 'Amoxicillin 500mg',
            'unit_name' => 'Strip',
            'quantity' => 1,
            'price' => 8500,
            'subtotal' => 8500,
            'requires_prescription' => true
        ]);
    }
}
