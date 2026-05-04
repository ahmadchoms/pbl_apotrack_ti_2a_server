# Analisis Arsitektur Mendalam — Proyek ApoTrack

Dokumen ini menyajikan hasil audit teknis menyeluruh terhadap proyek ApoTrack, sebuah platform manajemen apotek berbasis Laravel (Inertia/React) dan REST API (Sanctum). Analisis difokuskan pada tiga pilar utama: **performa**, **skalabilitas**, dan **maintainability**. Setiap temuan disertai dampak konkret serta rekomendasi implementasi yang dapat langsung dieksekusi.

---

## 1. Arsitektur Service Layer: Fragmentasi dan Duplikasi Logika

### 1.1 Tiga Lapisan AuthService yang Saling Tumpang Tindih

Saat ini terdapat **tiga file AuthService** yang menangani logika autentikasi secara terpisah dan tidak terkoordinasi:

- `App\Services\Auth\AuthService` — menangani login web (session-based), registrasi umum, dan registrasi apotek (`registerWithPharmacy`).
- `App\Services\Api\AuthService` — menangani login API (token-based via Sanctum) dan registrasi customer mobile.

Duplikasi ini terlihat jelas: kedua service sama-sama melakukan `Hash::make()` untuk password, pembuatan user baru, dan validasi kredensial. Ketika kebijakan keamanan berubah — misalnya menambahkan rate-limiting pada login, atau mengubah aturan minimum password — pengembang harus memodifikasi **dua file yang berbeda** dengan risiko salah satu terlewat. Lebih berbahaya lagi, `Auth\AuthService::register()` menggunakan field `password` sebagai input, sementara `Api\AuthService::register()` menggunakan field `password_hash`. Inkonsistensi penamaan ini dapat menyebabkan kebingungan dan bug yang sulit dilacak.

**Dampak:** Risiko inkonsistensi logika keamanan antar platform (web vs. mobile), peningkatan beban maintenance, dan potensi celah keamanan jika salah satu jalur tidak diperbarui bersamaan.

**Rekomendasi:** Konsolidasikan seluruh logika autentikasi ke dalam satu service inti, misalnya `Core\AuthenticationService`, yang menerima parameter abstrak (kredensial, mode output: session atau token). Kedua controller (Web `LoginController` dan API `AuthController`) kemudian hanya bertindak sebagai adapter tipis yang memanggil service inti tersebut. Standarisasi nama field input menjadi `password` secara konsisten di semua endpoint.

### 1.2 ProfileService: Delegasi Tanpa Nilai Tambah

File `Admin\ProfileService` saat ini hanya berisi 6 method yang semuanya merupakan *passthrough* murni ke `Core\AccountService`:

```php
// Admin\ProfileService — setiap method hanya mendelegasikan
public function updateProfile(array $data) {
    return $this->accountService->updateProfile(auth()->user(), $data);
}
```

Lapisan tambahan ini tidak memberikan logika bisnis khusus admin apa pun, sehingga hanya menambah *indirection* tanpa manfaat. Di sisi lain, `Pharmacy\ProfileService` memang memiliki fungsi spesifik (`updatePharmacy`, `updateOperatingHours`) yang memberikan nilai tambah nyata.

**Dampak:** Setiap pemanggilan profil admin melewati dua lapisan service yang tidak perlu, menambah kompleksitas call stack dan membuat *debugging* lebih sulit.

**Rekomendasi:** Hapus `Admin\ProfileService` dan buat `Admin\ProfileController` langsung memanggil `Core\AccountService`. Pertahankan `Pharmacy\ProfileService` karena memang memiliki logika domain spesifik apotek.

### 1.3 Pharmacy\MedicineService vs. Api\MedicineService

Terdapat dua `MedicineService` terpisah — satu di namespace `Pharmacy` untuk dashboard web, dan satu di `Api` untuk endpoint mobile. Meskipun keduanya me-query tabel `medicines` yang sama, mereka memiliki pola eager loading dan filtering yang berbeda:

- `Pharmacy\MedicineService::list()` memuat `with(['category', 'form', 'type', 'unit', 'batches'])` — seluruh relasi tanpa seleksi kolom.
- `Api\MedicineService::listMedicines()` memuat `with(['category:id,name', 'form:id,name', 'pharmacy:id,name'])` — lebih selektif.

**Dampak:** Ketika ada perubahan pada model Medicine (misalnya penambahan relasi baru atau perubahan nama kolom), dua service harus diperbarui secara manual. Pola eager loading yang tidak selektif di sisi web juga membuang bandwidth dan memori.

**Rekomendasi:** Buat satu `Core\MedicineQueryService` yang menyediakan method `buildBaseQuery()` dengan parameter fleksibel untuk menentukan relasi dan kolom. Kedua service spesifik platform cukup memanggil query builder ini dengan konfigurasi yang sesuai.

---

## 2. Performa Query Database

### 2.1 N+1 Query pada Admin\UserResource

Resource `Admin\UserResource` mengakses relasi berantai `$this->pharmacyStaff->pharmacy->name` dan `$this->pharmacyStaff->role` di dalam method `toArray()`. Ketika resource ini digunakan dalam collection (daftar user), setiap iterasi user akan memicu query terpisah ke tabel `pharmacy_staffs` dan `pharmacies` jika relasi belum di-eager-load.

Meskipun controller Admin\UserController kemungkinan sudah melakukan `with('pharmacyStaff.pharmacy')`, hal ini tidak dijamin karena **Resource tidak memvalidasi apakah relasi sudah di-load**. Pengembang baru yang memanggil `UserResource::collection($users)` tanpa eager loading akan langsung memicu N+1.

**Dampak:** Pada halaman daftar user dengan 100 data, bisa terjadi hingga 200+ query tambahan tanpa eager loading. Hal ini menyebabkan response time membengkak secara drastis.

**Rekomendasi:** Gunakan `$this->whenLoaded('pharmacyStaff')` secara konsisten di dalam Resource, dan pertimbangkan menambahkan scope `scopeWithStaffRelations()` pada model User yang meng-encapsulate pola eager loading ini agar selalu konsisten.

### 2.2 Pharmacy\MedicineService::list() — Eager Loading Berlebihan

Method `list()` pada Pharmacy\MedicineService memuat seluruh relasi **tanpa seleksi kolom**:

```php
->with(['category', 'form', 'type', 'unit', 'batches'])
```

Relasi `batches` khususnya berpotensi besar karena satu obat bisa memiliki puluhan batch. Memuat semua kolom dari setiap batch (termasuk `created_at`, `updated_at`, foreign key) hanya untuk menampilkan daftar obat adalah pemborosan memori. Bandingkan dengan versi API yang lebih optimal: `with(['category:id,name'])`.

**Dampak:** Pada apotek dengan 200 obat × rata-rata 5 batch, query ini mengembalikan ~1000 baris data batch yang sebagian besar tidak ditampilkan di UI. Ini mengkonsumsi memori server dan memperlambat serialisasi JSON.

**Rekomendasi:** Ganti menjadi `with(['category:id,name', 'form:id,name', 'type:id,name', 'unit:id,name'])` dan hilangkan eager loading `batches` karena stok aktif sudah dihitung melalui scope `withTotalActiveStock()`.

### 2.3 getActiveMedicines() — Penggunaan `get()` Tanpa Batas

Method `getActiveMedicines()` di Pharmacy\MedicineService me-return `->get()` tanpa `limit()` atau paginasi. Method ini dipanggil oleh halaman POS yang menampilkan seluruh obat aktif sekaligus:

```php
public function getActiveMedicines(string $pharmacyId)
{
    return Medicine::query()
        ->with(['category', 'form', 'unit'])
        ->withTotalActiveStock()
        ->where('pharmacy_id', $pharmacyId)
        ->where('is_active', true)
        ->whereHas('batches', ...)
        ->get(); // ← Memuat seluruh data tanpa batas
}
```

**Dampak:** Jika apotek memiliki 500+ obat aktif, seluruh data dimuat ke memori server dalam satu request. Selain boros RAM, response JSON-nya juga besar dan memperlambat rendering di sisi client.

**Rekomendasi:** Pertimbangkan penggunaan `simplePaginate()` atau implementasi *virtual scrolling* di frontend. Jika memang membutuhkan semua data sekaligus (untuk pencarian client-side di POS), gunakan `select()` yang ketat dan cache hasilnya per apotek.

### 2.4 OrderService::createPOSOrder() — Query N+1 dalam Loop

Di dalam loop pembuatan order items, setiap item memicu `Medicine::with('unit')->findOrFail($item['id'])` secara individual:

```php
foreach ($data['items'] as $item) {
    $medicine = Medicine::with('unit')->findOrFail($item['id']);
    // ...
    $this->reduceStock($medicine, $item['quantity']);
}
```

Jika order memiliki 10 item, ini menghasilkan 10 query `SELECT * FROM medicines` + 10 query `SELECT * FROM medicine_units`. Ditambah `reduceStock()` yang memuat batches per obat, total bisa mencapai 30+ query untuk satu transaksi.

**Dampak:** Setiap pembuatan order POS menjalankan O(3n) query di mana n = jumlah item. Ini memperlambat transaksi dan meningkatkan risiko timeout pada database connection pool.

**Rekomendasi:** Lakukan batch-loading di awal transaksi:
```php
$medicineIds = collect($data['items'])->pluck('id');
$medicines = Medicine::with(['unit', 'batches' => fn($q) => $q->where(...)])->whereIn('id', $medicineIds)->get()->keyBy('id');
```
Kemudian akses via `$medicines[$item['id']]` di dalam loop.

### 2.5 Dashboard Service — 4 Query Terpisah untuk KPI

`PharmacyDashboardService::getKpiStats()` menjalankan **4 query COUNT/SUM terpisah** ke database:

```php
$totalRevenueMonth = Order::where(...)->sum('grand_total');
$activeOrdersCount = Order::where(...)->count();
$totalMedicinesCount = Medicine::where(...)->count();
$totalStaffCount = PharmacyStaff::where(...)->count();
```

Meskipun masing-masing query ringan, mengirim 4 round-trip ke database (terutama Supabase yang remote) menambah latensi kumulatif yang signifikan.

**Dampak:** Pada koneksi dengan latensi 50ms ke Supabase, 4 query berarti minimum 200ms hanya untuk KPI. Ditambah query chart dan widget, total bisa mencapai 500ms+.

**Rekomendasi:** Gabungkan query revenue dan active orders ke dalam satu raw SQL menggunakan `CASE WHEN`:
```sql
SELECT 
  SUM(CASE WHEN order_status = 'COMPLETED' AND ... THEN grand_total ELSE 0 END) as revenue,
  COUNT(CASE WHEN order_status IN ('PENDING','PROCESSING') THEN 1 END) as active_count
FROM orders WHERE pharmacy_id = ?
```

---

## 3. Inkonsistensi Arsitektural API

### 3.1 API Staff\OrderController Tidak Menggunakan Service Pattern

Sementara API controllers lain (Auth, Medicine, Pharmacy) telah direfaktor ke Service Pattern, `Api\Staff\OrderController` masih melakukan query Eloquent langsung di dalam controller:

```php
$query = Order::with(['items', 'user'])
    ->where('pharmacy_id', $staff->pharmacy_id);
```

Padahal sudah ada `Pharmacy\OrderService::list()` yang menyediakan fungsi identik dengan eager loading yang lebih lengkap. Controller ini juga **memanggil `$this->orderService->updateStatus()` dengan parameter `string`** alih-alih `OrderStatus` enum:

```php
$updatedOrder = $this->orderService->updateStatus($order->id, $request->status, $request->note);
```

Sementara signature method sebenarnya mengharapkan `OrderStatus` enum. Ini akan menyebabkan **runtime error** karena type mismatch.

**Dampak:** Bug runtime yang tersembunyi pada endpoint mobile staff, duplikasi query logic, dan inkonsistensi pola arsitektur.

**Rekomendasi:** Refaktor `Api\Staff\OrderController` agar sepenuhnya menggunakan `Pharmacy\OrderService`. Tambahkan konversi `OrderStatus::from($request->status)` sebelum memanggil service.

### 3.2 Api\OrderController Tidak Memanfaatkan Service

`Api\OrderController::index()` dan `show()` melakukan query Eloquent langsung tanpa melalui service:

```php
$orders = Order::with(['items.medicine', 'pharmacy'])
    ->where('user_id', $request->user()->id)
    ->latest()
    ->paginate(10);
```

Tidak ada seleksi kolom, tidak ada optimasi eager loading. Response mengembalikan seluruh kolom dari tabel `orders`, `order_items`, `medicines`, dan `pharmacies` — termasuk kolom sensitif atau tidak relevan.

**Dampak:** Response JSON berukuran besar yang memakan bandwidth mobile. Kolom seperti `cancellation_reason`, `distance_km`, atau `verification_code` tidak perlu dikirim ke client saat listing.

**Rekomendasi:** Buat `Api\OrderService` yang menyediakan method `getUserOrders()` dan `getUserOrderDetail()` dengan selective columns dan API Resource formatting.

### 3.3 NotificationController Tanpa Service Layer

`Api\NotificationController` menjalankan query langsung dan bahkan menjalankan **2 query terpisah dalam satu request** pada method `index()`:

```php
$notifications = $request->user()->notifications()->latest()->paginate(20);
// ...
'unread_count' => $request->user()->notifications()->where('is_read', false)->count(),
```

Query kedua (`count()`) bisa digabungkan atau di-cache.

**Dampak:** Dua round-trip ke database untuk setiap request notifikasi. Pada penggunaan intensif (polling setiap 30 detik), ini menambah beban signifikan ke database.

**Rekomendasi:** Gunakan `withCount` atau hitung unread dari data yang sudah di-paginate jika berada di halaman pertama. Pertimbangkan caching jumlah unread per user dengan invalidation saat notifikasi baru dibuat.

---

## 4. Keamanan dan Integritas Data

### 4.1 Model Order Menggunakan `$guarded = []`

Model `Order` menggunakan `protected $guarded = []`, yang berarti **seluruh kolom** dapat di-mass-assign, termasuk kolom sensitif seperti `order_status`, `payment_status`, `grand_total`, dan `verification_code`.

Meskipun validasi dilakukan di tingkat controller/service, ini melanggar prinsip *defense in depth*. Jika ada celah di validasi atau service baru yang kurang hati-hati, data kritis bisa dimanipulasi.

**Dampak:** Risiko keamanan pada mass-assignment attack. Kolom `grand_total` atau `payment_status` bisa diubah melalui request yang tidak terfilter dengan benar.

**Rekomendasi:** Ganti ke `$fillable` eksplisit dan cantumkan hanya kolom yang memang boleh diubah melalui mass-assignment. Kolom seperti `order_number`, `verification_code`, dan `grand_total` sebaiknya diatur hanya melalui logic internal.

### 4.2 Duplikasi Definisi Status Order

Status order didefinisikan di **dua tempat** sekaligus:

1. `App\Enums\OrderStatus` — sebagai PHP Enum (pendekatan modern).
2. `App\Models\Order` — sebagai konstanta string (`const STATUS_PENDING = 'PENDING'`).

Ini menciptakan ambiguitas: controller Pharmacy menggunakan Enum, sementara model dan seeder menggunakan konstanta string.

**Dampak:** Perubahan pada satu definisi tidak otomatis merefleksikan ke yang lain. Developer baru bisa bingung harus merujuk ke mana.

**Rekomendasi:** Hapus konstanta di model `Order` dan gunakan `OrderStatus` Enum secara eksklusif di seluruh codebase. Tambahkan cast `'order_status' => OrderStatus::class` pada model.

### 4.3 AuditLog Dibuat Secara Manual di Banyak Tempat

Pencatatan audit log dilakukan dengan `AuditLog::create()` secara manual di berbagai service:

- `Core\AccountService::logAction()` — helper internal.
- `Pharmacy\ProfileService::updatePharmacy()` — membuat AuditLog secara langsung.
- `Admin\PharmacyService::verifyLegality()` — membuat AuditLog secara langsung.
- `Admin\PharmacyService::toggleSuspend()` — membuat AuditLog secara langsung.

Format data, field yang diisi, dan cara pembuatan log **berbeda-beda** antar lokasi. Beberapa mengisi `created_at` secara manual (padahal model sudah handle via boot), beberapa tidak.

**Dampak:** Inkonsistensi format log, risiko log terlewat, dan kesulitan audit trail yang komprehensif.

**Rekomendasi:** Pindahkan seluruh logika pembuatan audit log ke dalam satu service/helper terpusat (misalnya `AuditService::log()`), atau gunakan Laravel Observer/Event pattern untuk menangkap perubahan secara otomatis.

---

## 5. Desain Komponen Frontend

### 5.1 Dialog Konfirmasi Hapus yang Tidak Terstandarisasi

Halaman `pharmacy/medicine/index.jsx` membangun dialog konfirmasi hapus secara manual (~40 baris JSX) menggunakan komponen `Dialog` dasar, padahal sudah tersedia komponen `AlertDialog` dari library UI yang dirancang khusus untuk use case konfirmasi destruktif. Pola serupa kemungkinan diulang di halaman `staff/index.jsx` dan halaman admin lainnya.

**Dampak:** Ukuran bundle JavaScript membengkak karena kode duplikat. Perubahan desain dialog konfirmasi (misalnya menambahkan animasi atau mengubah warna) harus dilakukan di setiap halaman secara manual.

**Rekomendasi:** Buat komponen `DeleteConfirmationDialog` di `components/shared/` yang menerima props `open`, `onConfirm`, `onCancel`, `title`, dan `description`. Refaktor seluruh halaman untuk menggunakan komponen ini.

### 5.2 Tidak Ada Standardisasi Response Envelope di API

Setiap endpoint API mengkonstruksi response JSON secara manual dengan format:
```json
{ "status": "success", "message": "...", "data": {...}, "meta": {...} }
```

Kode ini diulang di setiap method di setiap controller, menghasilkan puluhan blok `response()->json([...])` yang identik strukturnya. Hal ini meningkatkan risiko inkonsistensi — misalnya beberapa endpoint menggunakan `$orders->items()` sementara yang lain menggunakan `Resource::collection()`.

**Dampak:** Setiap perubahan format response (misalnya menambahkan field `timestamp`) harus diubah di puluhan method secara manual.

**Rekomendasi:** Buat trait `ApiResponseTrait` atau base class `ApiController` yang menyediakan helper method seperti `successResponse($data, $message, $meta)` dan `errorResponse($message, $code)`.

---

## 6. Struktur Folder dan Konvensi

### 6.1 PharmacyResource Terduplikasi

Terdapat dua file `PharmacyResource` di lokasi berbeda:
- `App\Http\Resources\Admin\PharmacyResource`
- `App\Http\Resources\PharmacyResource` (root, digunakan oleh API PharmacyController)

Kedua file ini memformat data dari model `Pharmacy` yang sama namun tidak saling tahu keberadaan masing-masing. Ini melanggar prinsip DRY (Don't Repeat Yourself).

**Rekomendasi:** Buat satu `PharmacyResource` tunggal yang cukup fleksibel menggunakan `$this->whenLoaded()` untuk menangani kebutuhan berbagai konteks (admin detail vs. API listing).

### 6.2 Model Tanpa Relasi yang Terdefinisi — PaymentProof, RefreshToken, Report

Model `Order` mendefinisikan relasi `paymentProof()` ke model `PaymentProof`, namun model `PaymentProof` tersebut kemungkinan tidak memiliki migrasi atau tabel yang sesuai (tidak ditemukan dalam migration files). Hal yang sama berlaku untuk `RefreshToken` dan `Report` yang didefinisikan sebagai model namun tidak terpakai dalam service atau controller mana pun.

**Dampak:** Dead code yang membingungkan dan memberikan kesan fungsionalitas yang sebenarnya tidak ada.

**Rekomendasi:** Audit seluruh model dan hapus yang tidak memiliki tabel atau tidak digunakan. Hapus relasi `paymentProof()` dari model Order jika fitur tersebut belum diimplementasikan.

---

## 7. Testing dan Observability

### 7.1 Cakupan Test Masih Sangat Minim

Saat ini hanya terdapat test untuk `OrderService`. Tidak ada test untuk Auth flow, Address CRUD, atau integrasi API mobile. Dengan banyaknya perubahan arsitektur yang telah dilakukan, risiko regresi sangat tinggi.

**Rekomendasi:** Prioritaskan pembuatan Feature Test untuk:
1. Auth flow (login, register, logout) — web dan API.
2. Medicine CRUD dengan validasi stok.
3. Notification read/unread flow.

### 7.2 Tidak Ada Logging/Monitoring pada API Endpoints

Controller API tidak memiliki mekanisme logging untuk request yang gagal atau performa yang lambat. Ketika terjadi error di produksi, satu-satunya informasi yang tersedia adalah response 500 generik.

**Rekomendasi:** Tambahkan middleware API logging yang mencatat request time, status code, dan error detail ke channel log terpisah (`api.log`).

---

## Ringkasan Prioritas Eksekusi

| Prioritas | Area | Tindakan |
|-----------|------|----------|
| 🔴 Kritis | Bug Runtime | Fix type mismatch di `Api\Staff\OrderController::updateStatus()` (string vs OrderStatus enum) |
| 🔴 Kritis | Keamanan | Ganti `$guarded = []` di model Order ke `$fillable` eksplisit |
| 🟠 Tinggi | Performa | Eliminasi N+1 di `OrderService::createPOSOrder()` dengan batch-loading |
| 🟠 Tinggi | Arsitektur | Konsolidasi AuthService (web + API) ke satu service inti |
| 🟡 Sedang | Performa | Optimasi eager loading di `Pharmacy\MedicineService::list()` |
| 🟡 Sedang | Arsitektur | Hapus `Admin\ProfileService`, pindahkan panggilan langsung ke `AccountService` |
| 🟢 Rendah | Maintainability | Standardisasi API response envelope via trait/base class |
| 🟢 Rendah | Maintainability | Buat `DeleteConfirmationDialog` reusable untuk frontend |
| 🟢 Rendah | Cleanup | Hapus dead code: model tanpa tabel, duplikasi status constants |
