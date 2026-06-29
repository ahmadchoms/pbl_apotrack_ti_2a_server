<?php

namespace Database\Seeders;

use App\Models\AuditLog;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\UserAddress;
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
use App\Models\Prescription;

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
        // Konstanta URL Assets Lokal (Menggunakan URL dinamis agar kompatibel dengan ngrok/localhost)
        $avatarUrl = url('assets/avatar/avatar.jpg');
        $pharmacyUrl = url('assets/pharmacies/pharmacy.jpg');
        $medicineUrl = url('assets/medicines/panadol.jpg'); // Default fallback
        $licenseUrl = url('assets/licenses/license.jpeg');
        $prescriptionUrl = url('assets/prescriptions/resep-dokter.jpg');

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

            // User Tembalang
            ['username' => 'Budi Hartono', 'email' => 'budi.hartono@apotek.id', 'phone' => '087111111111', 'role' => 'USER', 'avatar_url' => $avatarUrl, 'is_active' => true],
            ['username' => 'Dewi Sartika', 'email' => 'dewi@apotek.id', 'phone' => '087222222222', 'role' => 'USER', 'avatar_url' => $avatarUrl, 'is_active' => true],
            ['username' => 'Dr. Agus Widodo', 'email' => 'agus@apotek.id', 'phone' => '087333333333', 'role' => 'USER', 'avatar_url' => $avatarUrl, 'is_active' => true],
            ['username' => 'Rina Marlina', 'email' => 'rina.marlina@apotek.id', 'phone' => '087444444444', 'role' => 'USER', 'avatar_url' => $avatarUrl, 'is_active' => true],
            ['username' => 'Bambang Staff', 'email' => 'bambang@apotek.id', 'phone' => '087555555555', 'role' => 'USER', 'avatar_url' => $avatarUrl, 'is_active' => true],

            // User Staff Apotek Baru Tembalang
            ['username' => 'Dr. Hadi Apoteker', 'email' => 'hadi@apotek.id', 'phone' => '088111111111', 'role' => 'USER', 'avatar_url' => $avatarUrl, 'is_active' => true],
            ['username' => 'Siska Staff', 'email' => 'siska@apotek.id', 'phone' => '088222222222', 'role' => 'USER', 'avatar_url' => $avatarUrl, 'is_active' => true],
            ['username' => 'Dr. Maya Sari', 'email' => 'maya@apotek.id', 'phone' => '088333333333', 'role' => 'USER', 'avatar_url' => $avatarUrl, 'is_active' => true],
            ['username' => 'Rudi Staff', 'email' => 'rudi@apotek.id', 'phone' => '088444444444', 'role' => 'USER', 'avatar_url' => $avatarUrl, 'is_active' => true],
            ['username' => 'Dr. Farida Dewi', 'email' => 'farida@apotek.id', 'phone' => '088555555555', 'role' => 'USER', 'avatar_url' => $avatarUrl, 'is_active' => true],
            ['username' => 'Dr. Yoga Pratama', 'email' => 'yoga@apotek.id', 'phone' => '088666666666', 'role' => 'USER', 'avatar_url' => $avatarUrl, 'is_active' => true],
            ['username' => 'Nina Staff', 'email' => 'nina@apotek.id', 'phone' => '088777777777', 'role' => 'USER', 'avatar_url' => $avatarUrl, 'is_active' => true],
            ['username' => 'Dr. Indah Lestari', 'email' => 'indah@apotek.id', 'phone' => '088888888888', 'role' => 'USER', 'avatar_url' => $avatarUrl, 'is_active' => true],

            ['username' => 'Dr. Eko Prasetyo', 'email' => 'eko@apotekgenuk.id', 'phone' => '089111222333', 'role' => 'USER', 'avatar_url' => $avatarUrl, 'is_active' => true],
            ['username' => 'Siti Aminah', 'email' => 'siti.staff@apotekgenuk.id', 'phone' => '089111222334', 'role' => 'USER', 'avatar_url' => $avatarUrl, 'is_active' => true],
            ['username' => 'Dr. Mega Utami', 'email' => 'mega@apotekgenuk.id', 'phone' => '089111222335', 'role' => 'USER', 'avatar_url' => $avatarUrl, 'is_active' => true],
            ['username' => 'Fahmi Staff', 'email' => 'fahmi@apotekgenuk.id', 'phone' => '089111222336', 'role' => 'USER', 'avatar_url' => $avatarUrl, 'is_active' => true],
            ['username' => 'Dr. Rizky Amelia', 'email' => 'rizky@apotekgenuk.id', 'phone' => '089111222337', 'role' => 'USER', 'avatar_url' => $avatarUrl, 'is_active' => true],
            ['username' => 'Dr. Faisal Anwar', 'email' => 'faisal@apotekgenuk.id', 'phone' => '089111222338', 'role' => 'USER', 'avatar_url' => $avatarUrl, 'is_active' => true],
            ['username' => 'Dian Staff', 'email' => 'dian@apotekgenuk.id', 'phone' => '089111222339', 'role' => 'USER', 'avatar_url' => $avatarUrl, 'is_active' => true],
            ['username' => 'Dr. Indah Permata', 'email' => 'indah.p@apotekgenuk.id', 'phone' => '089111222340', 'role' => 'USER', 'avatar_url' => $avatarUrl, 'is_active' => true],
            ['username' => 'Dr. Dimas Argo', 'email' => 'dimas@apotekgenuk.id', 'phone' => '089111222341', 'role' => 'USER', 'avatar_url' => $avatarUrl, 'is_active' => true],
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
                'logo_url' => $pharmacyUrl,
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
                'logo_url' => $pharmacyUrl,
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
                'logo_url' => $pharmacyUrl,
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
                'logo_url' => $pharmacyUrl,
                'verification_status' => 'PENDING',
                'is_active' => false,
                'is_force_closed' => false,
                'verified_by' => null,
                'verified_at' => null
            ],

            // Apotek Tembalang
            [
                'name' => 'Apotek Tembalang',
                'address' => 'Jl. Adipati Unus / Prof. Sudarto No.35, Tembalang, Kec. Tembalang, Kota Semarang',
                'phone' => '(024) 7475442',
                'latitude' => -7.0596,
                'longitude' => 110.4391,
                'rating' => 4.5,
                'total_reviews' => 56,
                'sia_number' => 'SIA-2024-1001',
                'logo_url' => $pharmacyUrl,
                'verification_status' => 'VERIFIED',
                'is_active' => true,
                'is_force_closed' => false,
                'verified_by' => $superAdmin->id,
                'verified_at' => Carbon::now()->subMonths(3)
            ],
            [
                'name' => 'Apotek KeluargaKu Banjarsari',
                'address' => 'Jl. Banjarsari Raya No.58H, Tembalang, Kec. Tembalang, Kota Semarang',
                'phone' => '0812-1409-6959',
                'latitude' => -7.0580,
                'longitude' => 110.4410,
                'rating' => 4.3,
                'total_reviews' => 34,
                'sia_number' => 'SIA-2024-1002',
                'logo_url' => $pharmacyUrl,
                'verification_status' => 'VERIFIED',
                'is_active' => true,
                'is_force_closed' => false,
                'verified_by' => $superAdmin->id,
                'verified_at' => Carbon::now()->subMonths(2)
            ],
            [
                'name' => 'Kimia Farma Bulusan',
                'address' => 'Jl. Timoho Raya No.287, Bulusan, Kec. Tembalang, Kota Semarang',
                'phone' => '(024) 1234567',
                'latitude' => -7.0604,
                'longitude' => 110.4436,
                'rating' => 4.6,
                'total_reviews' => 78,
                'sia_number' => 'SIA-2024-1003',
                'logo_url' => $pharmacyUrl,
                'verification_status' => 'VERIFIED',
                'is_active' => true,
                'is_force_closed' => false,
                'verified_by' => $superAdmin->id,
                'verified_at' => Carbon::now()->subMonths(4)
            ],

            // ══════════════════════════════════════════════
            // APOTEK BARU — Sekitar Tembalang (Radius 20 km)
            // ══════════════════════════════════════════════
            [
                'name' => 'Apotek K-24 Kedungmundu',
                'address' => 'Jl. Kedungmundu No.137, Tandang, Kec. Tembalang, Kota Semarang',
                'phone' => '(024) 76738208',
                'latitude' => -7.0380,
                'longitude' => 110.4350,
                'rating' => 4.2,
                'total_reviews' => 45,
                'sia_number' => 'SIA-2024-2001',
                'logo_url' => $pharmacyUrl,
                'verification_status' => 'VERIFIED',
                'is_active' => true,
                'is_force_closed' => false,
                'verified_by' => $superAdmin->id,
                'verified_at' => Carbon::now()->subMonths(3)
            ],
            [
                'name' => 'Kimia Farma Sendang Mulyo',
                'address' => 'Jl. Fatmawati No.42, Sendangmulyo, Kec. Tembalang, Kota Semarang',
                'phone' => '0811-2922-310',
                'latitude' => -7.0520,
                'longitude' => 110.4420,
                'rating' => 4.4,
                'total_reviews' => 62,
                'sia_number' => 'SIA-2024-2002',
                'logo_url' => $pharmacyUrl,
                'verification_status' => 'VERIFIED',
                'is_active' => true,
                'is_force_closed' => false,
                'verified_by' => $superAdmin->id,
                'verified_at' => Carbon::now()->subMonths(2)
            ],
            [
                'name' => 'Apotek Sehit',
                'address' => 'Jl. Bougenvile Raya No.30, Sendangmulyo, Kec. Tembalang, Kota Semarang',
                'phone' => '(024) 76419235',
                'latitude' => -7.0500,
                'longitude' => 110.4450,
                'rating' => 4.1,
                'total_reviews' => 28,
                'sia_number' => 'SIA-2024-2003',
                'logo_url' => $pharmacyUrl,
                'verification_status' => 'VERIFIED',
                'is_active' => true,
                'is_force_closed' => false,
                'verified_by' => $superAdmin->id,
                'verified_at' => Carbon::now()->subMonths(1)
            ],
            [
                'name' => 'Apotek Subur Sehat',
                'address' => 'Jl. Klipang Golf Raya No. A I/1, Sendangmulyo, Kec. Tembalang, Kota Semarang',
                'phone' => '(024) 74712345',
                'latitude' => -7.0470,
                'longitude' => 110.4490,
                'rating' => 4.0,
                'total_reviews' => 19,
                'sia_number' => 'SIA-2024-2004',
                'logo_url' => $pharmacyUrl,
                'verification_status' => 'VERIFIED',
                'is_active' => true,
                'is_force_closed' => false,
                'verified_by' => $superAdmin->id,
                'verified_at' => Carbon::now()->subMonths(2)
            ],
            [
                'name' => 'Apotek Surya Sehat',
                'address' => 'Ruko Pandanaran Hills Blok AC-05, Mangunharjo, Kec. Tembalang, Kota Semarang',
                'phone' => '(024) 76456789',
                'latitude' => -7.0620,
                'longitude' => 110.4320,
                'rating' => 4.3,
                'total_reviews' => 37,
                'sia_number' => 'SIA-2024-2005',
                'logo_url' => $pharmacyUrl,
                'verification_status' => 'VERIFIED',
                'is_active' => true,
                'is_force_closed' => false,
                'verified_by' => $superAdmin->id,
                'verified_at' => Carbon::now()->subMonths(1)
            ],
            [
                'name' => 'Apotek K-24 Genuk Indah',
                'address' => 'Jl. Genuk Indah Raya No.12, Jatingaleh, Kec. Genuk, Kota Semarang',
                'phone' => '(024) 6584321',
                'latitude' => -6.9612,
                'longitude' => 110.4740,
                'rating' => 4.6,
                'total_reviews' => 84,
                'sia_number' => 'SIA-2024-3001',
                'logo_url' => $pharmacyUrl,
                'verification_status' => 'VERIFIED',
                'is_active' => true,
                'is_force_closed' => false,
                'verified_by' => $superAdmin->id,
                'verified_at' => Carbon::now()->subMonths(4)
            ],
            [
                'name' => 'Kimia Farma Kaligawe',
                'address' => 'Jl. Raya Kaligawe KM.5 No.38, Muktiharjo Lor, Kec. Genuk, Kota Semarang',
                'phone' => '(024) 6590112',
                'latitude' => -6.9585,
                'longitude' => 110.4635,
                'rating' => 4.5,
                'total_reviews' => 112,
                'sia_number' => 'SIA-2024-3002',
                'logo_url' => $pharmacyUrl,
                'verification_status' => 'VERIFIED',
                'is_active' => true,
                'is_force_closed' => false,
                'verified_by' => $superAdmin->id,
                'verified_at' => Carbon::now()->subMonths(5)
            ],
            [
                'name' => 'Apotek Genuk Sehat',
                'address' => 'Jl. Wolter Monginsidi No.88, Genuk, Kec. Genuk, Kota Semarang',
                'phone' => '0813-9000-4321',
                'latitude' => -6.9650,
                'longitude' => 110.4795,
                'rating' => 4.2,
                'total_reviews' => 29,
                'sia_number' => 'SIA-2024-3003',
                'logo_url' => $pharmacyUrl,
                'verification_status' => 'VERIFIED',
                'is_active' => true,
                'is_force_closed' => false,
                'verified_by' => $superAdmin->id,
                'verified_at' => Carbon::now()->subMonths(2)
            ],
            [
                'name' => 'Apotek Cetra Medika Wolter',
                'address' => 'Jl. Wolter Monginsidi No.145, Bangetayu Kulon, Kec. Genuk, Kota Semarang',
                'phone' => '(024) 76924415',
                'latitude' => -6.9732,
                'longitude' => 110.4821,
                'rating' => 4.4,
                'total_reviews' => 43,
                'sia_number' => 'SIA-2024-3004',
                'logo_url' => $pharmacyUrl,
                'verification_status' => 'VERIFIED',
                'is_active' => true,
                'is_force_closed' => false,
                'verified_by' => $superAdmin->id,
                'verified_at' => Carbon::now()->subMonths(3)
            ],
            [
                'name' => 'Apotek Bangetayu Farma',
                'address' => 'Jl. Stasiun Bangetayu No.10, Bangetayu Wetan, Kec. Genuk, Kota Semarang',
                'phone' => '(024) 6512399',
                'latitude' => -6.9765,
                'longitude' => 110.4860,
                'rating' => 4.3,
                'total_reviews' => 51,
                'sia_number' => 'SIA-2024-3005',
                'logo_url' => $pharmacyUrl,
                'verification_status' => 'VERIFIED',
                'is_active' => true,
                'is_force_closed' => false,
                'verified_by' => $superAdmin->id,
                'verified_at' => Carbon::now()->subMonths(1)
            ],
            [
                'name' => 'Apotek Muktiharjo Prima',
                'address' => 'Jl. Muktiharjo Raya No.17, Muktiharjo Kidul, Kec. Pedurungan, Kota Semarang', // Batas luar radius ke arah selatan genuk
                'phone' => '0878-3321-4455',
                'latitude' => -6.9780,
                'longitude' => 110.4650,
                'rating' => 4.1,
                'total_reviews' => 18,
                'sia_number' => 'SIA-2024-3006',
                'logo_url' => $pharmacyUrl,
                'verification_status' => 'VERIFIED',
                'is_active' => true,
                'is_force_closed' => false,
                'verified_by' => $superAdmin->id,
                'verified_at' => Carbon::now()->subMonths(2)
            ],
            [
                'name' => 'Apotek Sembada Kaligawe',
                'address' => 'Jl. Kaligawe Raya KM.4, Terboyo Kulon, Kec. Genuk, Kota Semarang',
                'phone' => '(024) 6581122',
                'latitude' => -6.9560,
                'longitude' => 110.4570,
                'rating' => 4.0,
                'total_reviews' => 32,
                'sia_number' => 'SIA-2024-3007',
                'logo_url' => $pharmacyUrl,
                'verification_status' => 'VERIFIED',
                'is_active' => true,
                'is_force_closed' => false,
                'verified_by' => $superAdmin->id,
                'verified_at' => Carbon::now()->subMonths(6)
            ],
            [
                'name' => 'Apotek Bugen Utama',
                'address' => 'Jl. Bugen Utara No.5A, Bangetayu Kulon, Kec. Genuk, Kota Semarang',
                'phone' => '0821-4455-6677',
                'latitude' => -6.9695,
                'longitude' => 110.4755,
                'rating' => 4.5,
                'total_reviews' => 22,
                'sia_number' => 'SIA-2024-3008',
                'logo_url' => $pharmacyUrl,
                'verification_status' => 'VERIFIED',
                'is_active' => true,
                'is_force_closed' => false,
                'verified_by' => $superAdmin->id,
                'verified_at' => Carbon::now()->subDays(15)
            ],
            [
                'name' => 'Apotek Terboyo Asri',
                'address' => 'Kawasan Industri Terboyo Blok G No.3, Terboyo Wetan, Kec. Genuk, Kota Semarang',
                'phone' => '(024) 6594433',
                'latitude' => -6.9490,
                'longitude' => 110.4710,
                'rating' => 4.2,
                'total_reviews' => 15,
                'sia_number' => 'SIA-2024-3009',
                'logo_url' => $pharmacyUrl,
                'verification_status' => 'VERIFIED',
                'is_active' => true,
                'is_force_closed' => false,
                'verified_by' => $superAdmin->id,
                'verified_at' => Carbon::now()->subMonths(3)
            ]
        ];

        $pharmacyImages = [
            'Apotek Sehat Selalu' => 'apotek_sehat_selalu.jpg',
            'Apotek Farma Prima (Tutup Sementara)' => 'apotek_farma_prima.jpg',
            'Apotek Tembalang' => 'apotek_tembalang.jpg',
            'Apotek KeluargaKu Banjarsari' => 'apotek_keluargaku.jpg',
            'Kimia Farma Bulusan' => 'kimia_farma_bulusan.jpg',
            'Apotek K-24 Kedungmundu' => 'apotek_k24_kedungmundu.jpg',
            'Kimia Farma Sendang Mulyo' => 'kimia_farma_sendang_mulyo.jpg',
            'Apotek Sehit' => 'apotek_sehit.jpg',
            'Apotek Subur Sehat' => 'apotek_subur_sehat.jpg',
            'Apotek Surya Sehat' => 'apotek_surya_sehat.jpg',
            'Apotek K-24 Genuk Indah' => 'apotek_k24_kedungmundu.jpg',
            'Kimia Farma Kaligawe' => 'kimia_farma_bulusan.jpg',
            'Apotek Genuk Sehat' => 'apotek_sehat_selalu.jpg',
            'Apotek Cetra Medika Wolter' => 'apotek_surya_sehat.jpg',
            'Apotek Bangetayu Farma' => 'apotek_subur_sehat.jpg',
            'Apotek Muktiharjo Prima' => 'apotek_surya_sehat.jpg',
            'Apotek Sembada Kaligawe' => 'apotek_sehat_selalu.jpg',
            'Apotek Bugen Utama' => 'apotek_subur_sehat.jpg',
            'Apotek Terboyo Asri' => 'apotek_sehit.jpg',
        ];

        $pharmaModels = [];
        foreach ($pharmacies as $p) {
            $pharmacyData = collect($p)->except('sia_number')->toArray();
            if (isset($pharmacyImages[$p['name']])) {
                $pharmacyData['logo_url'] = url('assets/pharmacies/' . $pharmacyImages[$p['name']]);
            } else {
                $pharmacyData['logo_url'] = $pharmacyUrl;
            }
            $pharmaModel = Pharmacy::firstOrCreate(['name' => $p['name']], $pharmacyData);
            $pharmaModels[] = $pharmaModel;

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

        // Staff Tembalang
        PharmacyStaff::firstOrCreate(['pharmacy_id' => $pharmaModels[4]->id, 'user_id' => $createdUsers['budi.hartono@apotek.id']->id], ['role' => 'APOTEKER']);
        PharmacyStaff::firstOrCreate(['pharmacy_id' => $pharmaModels[4]->id, 'user_id' => $createdUsers['dewi@apotek.id']->id], ['role' => 'STAFF']);
        PharmacyStaff::firstOrCreate(['pharmacy_id' => $pharmaModels[5]->id, 'user_id' => $createdUsers['agus@apotek.id']->id], ['role' => 'APOTEKER']);
        PharmacyStaff::firstOrCreate(['pharmacy_id' => $pharmaModels[6]->id, 'user_id' => $createdUsers['rina.marlina@apotek.id']->id], ['role' => 'APOTEKER']);
        PharmacyStaff::firstOrCreate(['pharmacy_id' => $pharmaModels[6]->id, 'user_id' => $createdUsers['bambang@apotek.id']->id], ['role' => 'STAFF']);

        // Staff Apotek Baru Tembalang
        // K-24 Kedungmundu (index 7)
        PharmacyStaff::firstOrCreate(['pharmacy_id' => $pharmaModels[7]->id, 'user_id' => $createdUsers['hadi@apotek.id']->id], ['role' => 'APOTEKER']);
        PharmacyStaff::firstOrCreate(['pharmacy_id' => $pharmaModels[7]->id, 'user_id' => $createdUsers['siska@apotek.id']->id], ['role' => 'STAFF']);
        // Kimia Farma Sendang Mulyo (index 8)
        PharmacyStaff::firstOrCreate(['pharmacy_id' => $pharmaModels[8]->id, 'user_id' => $createdUsers['maya@apotek.id']->id], ['role' => 'APOTEKER']);
        PharmacyStaff::firstOrCreate(['pharmacy_id' => $pharmaModels[8]->id, 'user_id' => $createdUsers['rudi@apotek.id']->id], ['role' => 'STAFF']);
        // Apotek Sehit (index 9)
        PharmacyStaff::firstOrCreate(['pharmacy_id' => $pharmaModels[9]->id, 'user_id' => $createdUsers['farida@apotek.id']->id], ['role' => 'APOTEKER']);
        // Apotek Subur Sehat (index 10)
        PharmacyStaff::firstOrCreate(['pharmacy_id' => $pharmaModels[10]->id, 'user_id' => $createdUsers['yoga@apotek.id']->id], ['role' => 'APOTEKER']);
        PharmacyStaff::firstOrCreate(['pharmacy_id' => $pharmaModels[10]->id, 'user_id' => $createdUsers['nina@apotek.id']->id], ['role' => 'STAFF']);
        // Apotek Surya Sehat (index 11)
        PharmacyStaff::firstOrCreate(['pharmacy_id' => $pharmaModels[11]->id, 'user_id' => $createdUsers['indah@apotek.id']->id], ['role' => 'APOTEKER']);

        PharmacyStaff::firstOrCreate(['pharmacy_id' => $pharmaModels[12]->id, 'user_id' => $createdUsers['eko@apotekgenuk.id']->id], ['role' => 'APOTEKER']);
        PharmacyStaff::firstOrCreate(['pharmacy_id' => $pharmaModels[12]->id, 'user_id' => $createdUsers['siti.staff@apotekgenuk.id']->id], ['role' => 'STAFF']);

        // Index 13: Kimia Farma Kaligawe
        PharmacyStaff::firstOrCreate(['pharmacy_id' => $pharmaModels[13]->id, 'user_id' => $createdUsers['mega@apotekgenuk.id']->id], ['role' => 'APOTEKER']);
        PharmacyStaff::firstOrCreate(['pharmacy_id' => $pharmaModels[13]->id, 'user_id' => $createdUsers['fahmi@apotekgenuk.id']->id], ['role' => 'STAFF']);

        // Index 14: Apotek Genuk Sehat
        PharmacyStaff::firstOrCreate(['pharmacy_id' => $pharmaModels[14]->id, 'user_id' => $createdUsers['rizky@apotekgenuk.id']->id], ['role' => 'APOTEKER']);

        // Index 15: Apotek Cetra Medika Wolter
        PharmacyStaff::firstOrCreate(['pharmacy_id' => $pharmaModels[15]->id, 'user_id' => $createdUsers['faisal@apotekgenuk.id']->id], ['role' => 'APOTEKER']);
        PharmacyStaff::firstOrCreate(['pharmacy_id' => $pharmaModels[15]->id, 'user_id' => $createdUsers['dian@apotekgenuk.id']->id], ['role' => 'STAFF']);

        // Index 16: Apotek Bangetayu Farma
        PharmacyStaff::firstOrCreate(['pharmacy_id' => $pharmaModels[16]->id, 'user_id' => $createdUsers['indah.p@apotekgenuk.id']->id], ['role' => 'APOTEKER']);

        // Index 17: Apotek Muktiharjo Prima
        PharmacyStaff::firstOrCreate(['pharmacy_id' => $pharmaModels[17]->id, 'user_id' => $createdUsers['dimas@apotekgenuk.id']->id], ['role' => 'APOTEKER']);

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

            // Obat tambahan Tembalang
            ['name' => 'Bodrex', 'generic_name' => 'Paracetamol, Phenylpropanolamine', 'category' => 'Analgesik', 'form' => 'Tablet', 'type' => 'Obat Bebas', 'unit' => 'Strip', 'manufacturer' => 'Sanbe Farma', 'price' => 5500, 'weight_in_grams' => 10, 'requires_prescription' => false, 'desc' => 'Obat sakit kepala dan demam.', 'dosage' => 'Dewasa: 1 tablet 3x sehari'],
            ['name' => 'Diapet', 'generic_name' => 'Attapulgite', 'category' => 'Antasida & GERD', 'form' => 'Kapsul', 'type' => 'Obat Bebas', 'unit' => 'Strip', 'manufacturer' => 'Meprofarm', 'price' => 7000, 'weight_in_grams' => 8, 'requires_prescription' => false, 'desc' => 'Mengatasi diare.', 'dosage' => '2 kapsul setiap kali buang air'],
            ['name' => 'Antangin JRG', 'generic_name' => 'Herbal Extract', 'category' => 'Batuk & Flu', 'form' => 'Sachet', 'type' => 'Herbal', 'unit' => 'Box', 'manufacturer' => 'Sido Muncul', 'price' => 3500, 'weight_in_grams' => 15, 'requires_prescription' => false, 'desc' => 'Meredakan masuk angin.', 'dosage' => '1 sachet 3x sehari'],
            ['name' => 'Mylanta', 'generic_name' => 'Aluminium Hydroxide, Magnesium Hydroxide, Simethicone', 'category' => 'Antasida & GERD', 'form' => 'Suspensi', 'type' => 'Obat Bebas', 'unit' => 'Botol', 'manufacturer' => 'Johnson & Johnson', 'price' => 25000, 'weight_in_grams' => 150, 'requires_prescription' => false, 'desc' => 'Obat maag dan kembung.', 'dosage' => '1-2 sendok teh 3x sehari'],
            ['name' => 'Enervon-C', 'generic_name' => 'Vitamin C, Vitamin B Kompleks', 'category' => 'Vitamin & Suplemen', 'form' => 'Tablet', 'type' => 'Obat Bebas', 'unit' => 'Strip', 'manufacturer' => 'Sanbe Farma', 'price' => 8500, 'weight_in_grams' => 10, 'requires_prescription' => false, 'desc' => 'Suplemen vitamin C dan B.', 'dosage' => '1 tablet 1x sehari'],
        ];

        // ── Mapping Obat per Apotek (Berdasarkan Kategori Fokus) ──
        // Apotek lama (lengkap) tetap mendapat semua obat.
        // Apotek baru mendapat subset sesuai kategori fokus.
        $allMedicineNames = array_map(fn($m) => $m['name'], $medicines);
        $medicinesByName = [];
        foreach ($medicines as $m) {
            $medicinesByName[$m['name']] = $m;
        }

        $pharmacyMedicineMap = [
            'Apotek Sehat Selalu'            => $allMedicineNames,
            'Apotek Farma Prima (Tutup Sementara)' => $allMedicineNames,
            'Apotek Tembalang'               => $allMedicineNames,
            'Apotek KeluargaKu Banjarsari'   => $allMedicineNames,
            'Kimia Farma Bulusan'            => $allMedicineNames,

            // K-24 Kedungmundu → OTC: Batuk & Flu, Vitamin, Antasida
            'Apotek K-24 Kedungmundu'        => ['Tolak Angin Cair', 'Antangin JRG', 'Promag Tablet', 'Mylanta', 'Imboost Force', 'Enervon-C', 'Panadol Extra 500mg', 'Sanmol Sirup 60ml'],

            // Kimia Farma Sendang Mulyo → Obat Keras: Antibiotik, Antihipertensi, Antidiabetes
            'Kimia Farma Sendang Mulyo'      => ['Amoxicillin 500mg', 'Amlodipine 5mg', 'Metformin 500mg', 'Betadine Antiseptic 15ml', 'Insto Regular 7.5ml', 'Panadol Extra 500mg'],

            // Apotek Sehit → P3K, Analgesik, Antipiretik
            'Apotek Sehit'                   => ['Panadol Extra 500mg', 'Betadine Antiseptic 15ml', 'Sanmol Sirup 60ml', 'Bodrex', 'Diapet', 'Promag Tablet'],

            // Apotek Subur Sehat → Kesehatan Mata, Vitamin, P3K
            'Apotek Subur Sehat'             => ['Insto Regular 7.5ml', 'Enervon-C', 'Imboost Force', 'Betadine Antiseptic 15ml', 'Sanmol Sirup 60ml', 'Bodrex'],

            // Apotek Surya Sehat → Herbal, Vitamin, Antasida
            'Apotek Surya Sehat'             => ['Tolak Angin Cair', 'Antangin JRG', 'Promag Tablet', 'Mylanta', 'Imboost Force', 'Enervon-C', 'Panadol Extra 500mg'],
            'Apotek K-24 Genuk Indah'     => $allMedicineNames,
            'Kimia Farma Kaligawe'        => $allMedicineNames,
            'Apotek Genuk Sehat'          => ['Panadol Extra 500mg', 'Promag Tablet', 'Sanmol Sirup 60ml', 'Bodrex', 'Mylanta', 'Tolak Angin Cair'],
            'Apotek Cetra Medika Wolter'  => ['Amoxicillin 500mg', 'Amlodipine 5mg', 'Metformin 500mg', 'Panadol Extra 500mg'],
            'Apotek Bangetayu Farma'      => ['Panadol Extra 500mg', 'Betadine Antiseptic 15ml', 'Sanmol Sirup 60ml', 'Enervon-C'],
            'Apotek Muktiharjo Prima'     => ['Insto Regular 7.5ml', 'Enervon-C', 'Imboost Force', 'Promag Tablet'],
            'Apotek Sembada Kaligawe'     => ['Tolak Angin Cair', 'Antangin JRG', 'Mylanta', 'Imboost Force'],
            'Apotek Bugen Utama'          => ['Panadol Extra 500mg', 'Bodrex', 'Diapet', 'Sanmol Sirup 60ml'],
            'Apotek Terboyo Asri'         => ['Panadol Extra 500mg', 'Promag Tablet', 'Betadine Antiseptic 15ml', 'Amoxicillin 500mg'],
        ];

        $insertedMedicines = [];

        foreach ($pharmaModels as $pModel) {
            if ($pModel->verification_status !== 'VERIFIED') continue;

            $assignedMeds = $pharmacyMedicineMap[$pModel->name] ?? [];

            foreach ($assignedMeds as $medName) {
                $med = $medicinesByName[$medName] ?? null;
                if (!$med) continue;

                $isActive = (rand(1, 10) > 1); // 90% obat aktif

                $medicineImages = [
                    'Panadol Extra 500mg' => 'panadol.jpg',
                    'Amoxicillin 500mg' => 'amoxicillin.jpg',
                    'Promag Tablet' => 'promag.jpg',
                    'Imboost Force' => 'imboost.jpg',
                    'Betadine Antiseptic 15ml' => 'betadine.jpg',
                    'Sanmol Sirup 60ml' => 'sanmol.jpg',
                    'Insto Regular 7.5ml' => 'insto.jpg',
                    'Tolak Angin Cair' => 'tolak_angin.jpg',
                    'Amlodipine 5mg' => 'amlodipine.jpg',
                    'Metformin 500mg' => 'metformin.jpg',
                    'Bodrex' => 'bodrex.jpg',
                    'Diapet' => 'diapet.jpg',
                    'Antangin JRG' => 'antangin.jpg',
                    'Mylanta' => 'mylanta.jpg',
                    'Enervon-C' => 'enervon.jpg',
                ];

                $medImageUrl = isset($medicineImages[$med['name']])
                    ? url('assets/medicines/' . $medicineImages[$med['name']])
                    : $medicineUrl;

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
                    'image_url' => $medImageUrl,
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
            'service_type' => 'PICKUP',
            'payment_method' => 'QRIS',
            'order_status' => 'PENDING',
            'payment_status' => 'UNPAID',
            'subtotal_amount' => 12000,
            'grand_total' => 12000,
            'verification_code' => strtoupper(Str::random(10)),
            'expired_at' => Carbon::now()->addHours(24)
        ]);
        OrderItem::firstOrCreate(['order_id' => $o1->id, 'medicine_id' => $medsPhar1['Panadol Extra 500mg']->id], ['medicine_name' => 'Panadol Extra 500mg', 'unit_name' => 'Strip', 'quantity' => 1, 'price' => 12000, 'subtotal' => 12000]);

        // 2. PROCESSING (Sudah dibayar, sedang diracik)
        $o2 = Order::firstOrCreate(['order_number' => 'ORD-2026-PROCESS'], [
            'user_id' => $siti->id,
            'pharmacy_id' => $phar1->id,
            'service_type' => 'PICKUP',
            'payment_method' => 'QRIS',
            'order_status' => 'PROCESSING',
            'payment_status' => 'PAID',
            'subtotal_amount' => 45000,
            'grand_total' => 45000,
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
            'grand_total' => 15000,
            'verification_code' => strtoupper(Str::random(10)),
            'paid_at' => Carbon::now()->subHours(1),
            'expired_at' => Carbon::now()->addHours(24)
        ]);
        OrderItem::firstOrCreate(['order_id' => $o3->id, 'medicine_id' => $medsPhar1['Betadine Antiseptic 15ml']->id], ['medicine_name' => 'Betadine Antiseptic 15ml', 'unit_name' => 'Botol', 'quantity' => 1, 'price' => 15000, 'subtotal' => 15000]);

        // 4. COMPLETED - Pickup order (verifikasi kode)
        $o4 = Order::firstOrCreate(['order_number' => 'ORD-2026-COMPLETED-2'], [
            'user_id' => $siti->id,
            'pharmacy_id' => $phar1->id,
            'service_type' => 'PICKUP',
            'payment_method' => 'CASH',
            'order_status' => 'COMPLETED',
            'payment_status' => 'PAID',
            'subtotal_amount' => 22000,
            'grand_total' => 22000,
            'verification_code' => strtoupper(Str::random(10)),
            'paid_at' => Carbon::now()->subHours(2),
            'expired_at' => Carbon::now()->addHours(24)
        ]);
        OrderItem::firstOrCreate(['order_id' => $o4->id, 'medicine_id' => $medsPhar1['Sanmol Sirup 60ml']->id], ['medicine_name' => 'Sanmol Sirup 60ml', 'unit_name' => 'Botol', 'quantity' => 1, 'price' => 22000, 'subtotal' => 22000]);

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

        $o5 = Order::firstOrCreate(['order_number' => 'ORD-2026-COMPLETED-WITH-PRESC'], [
            'user_id' => $budi->id,
            'pharmacy_id' => $phar1->id,
            'prescription_id' => $presc1->id, // Hubungkan dengan resep
            'service_type' => 'PICKUP',
            'payment_method' => 'CASH',
            'order_status' => 'COMPLETED',
            'payment_status' => 'PAID',
            'is_reviewed' => true,
            'subtotal_amount' => 17000, // 8500 (Amoxicillin) + 8500 (Amoxicillin)
            'grand_total' => 17000,
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
            'grand_total' => 35000,
            'verification_code' => strtoupper(Str::random(10)),
            'cancellation_reason' => 'Dibatalkan oleh sistem (Expired).',
            'expired_at' => Carbon::now()->subHours(5)
        ]);
        OrderItem::firstOrCreate(['order_id' => $o6->id, 'medicine_id' => $medsPhar1['Tolak Angin Cair']->id], ['medicine_name' => 'Tolak Angin Cair', 'unit_name' => 'Box', 'quantity' => 1, 'price' => 35000, 'subtotal' => 35000]);

        // 7. READY_FOR_PICKUP ORDER
        $o7 = Order::firstOrCreate(['order_number' => 'ORD-2026-READY-2'], [
            'user_id' => $budi->id,
            'pharmacy_id' => $phar1->id,
            'service_type' => 'PICKUP',
            'payment_method' => 'QRIS',
            'order_status' => 'READY_FOR_PICKUP',
            'payment_status' => 'PAID',
            'subtotal_amount' => 24000,
            'grand_total' => 24000,
            'verification_code' => strtoupper(Str::random(10)),
            'paid_at' => Carbon::now()->subHours(1),
            'expired_at' => Carbon::now()->addHours(24)
        ]);
        OrderItem::firstOrCreate(['order_id' => $o7->id, 'medicine_id' => $medsPhar1['Panadol Extra 500mg']->id], ['medicine_name' => 'Panadol Extra 500mg', 'unit_name' => 'Strip', 'quantity' => 2, 'price' => 12000, 'subtotal' => 24000]);

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
            // Notifikasi Order (Siti - COMPLETED)
            [
                'user_id' => $siti->id,
                'title' => 'Pesanan Selesai',
                'message' => 'Pesanan Anda (' . $o4->order_number . ') telah selesai dan obat berhasil diambil.',
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
                'metadata' => ['pharmacy_id' => $phar1->id, 'pharmacy_name' => $phar1->name],
                'status' => 'SUCCESS',
                'created_at' => Carbon::now()->subMonths(6)
            ],
            // Super Admin menolak apotek
            [
                'user_id' => $superAdmin->id,
                'action' => 'PHARMACY_REJECTED',
                'description' => 'Menolak verifikasi Apotek Abal Abal karena dokumen tidak valid.',
                'metadata' => ['pharmacy_name' => 'Apotek Abal Abal'],
                'status' => 'SUCCESS',
                'created_at' => Carbon::now()->subDays(5)
            ],
            // Dr. Prayitno (Apoteker) login
            [
                'user_id' => $createdUsers['prayitno@apotek.id']->id,
                'action' => 'LOGIN',
                'description' => 'User berhasil login ke sistem manajemen apotek.',
                'metadata' => ['device' => 'Desktop'],
                'status' => 'SUCCESS',
                'created_at' => Carbon::now()->subHours(8)
            ],
            // Hanif Nakal gagal login karena dibanned
            [
                'user_id' => $createdUsers['hanif@banned.id']->id,
                'action' => 'LOGIN',
                'description' => 'Gagal login karena status akun tidak aktif (banned).',
                'metadata' => ['reason' => 'account_inactive'],
                'status' => 'FAILED',
                'created_at' => Carbon::now()->subHours(2)
            ],
            // Order creation oleh Budi
            [
                'user_id' => $budi->id,
                'action' => 'ORDER_CREATED',
                'description' => 'Membuat pesanan baru dengan nomor ' . $o1->order_number,
                'metadata' => ['order_id' => $o1->id, 'total' => 27000],
                'status' => 'SUCCESS',
                'created_at' => Carbon::now()->subMinutes(10)
            ],
        ];

        foreach ($auditLogs as $log) {
            AuditLog::create($log);
        }
    }
}
