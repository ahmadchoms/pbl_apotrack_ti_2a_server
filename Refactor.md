# Analisis & Evaluasi Mendalam Platform ApoTrack

---

## RINGKASAN EKSEKUTIF

ApoTrack memiliki fondasi arsitektur yang solid — Laravel + Inertia + React dengan pemisahan feature-based yang cukup baik. Namun setelah analisis menyeluruh, ditemukan sejumlah isu struktural yang jika dibiarkan akan menghambat skalabilitas dan maintainability jangka panjang.

---

## BAGIAN 1: ISU KRITIS (Prioritas Tinggi)

### 1.1 N+1 Query Problem di Resources

**Lokasi:** `PharmacyDetailResource.php`, `PharmacyResource.php`

```php
// ❌ MASALAH: Query di dalam loop resource
// PharmacyDetailResource.php
$monthlyOrders = $this->orders()  // Setiap pharmacy trigger query baru
    ->whereMonth('created_at', now()->month)
    ->count();

// Jika ada 12 pharmacy cards di halaman index,
// itu berarti 12 query tambahan hanya untuk orders_count
```

**Solusi:**

```php
// ✅ Di PharmacyService::list() - gunakan withCount + withAggregate
public function list($filters)
{
    return Pharmacy::query()
        ->with([...])
        ->withCount(['orders', 'medicines'])
        ->withCount([
            'orders as monthly_orders_count' => fn($q) => $q
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
        ])
        ->paginate(12);
}

// ✅ Di Resource - akses dari pre-loaded attribute
'monthly_orders' => $this->monthly_orders_count ?? 0,
```

**Risiko jika tidak diperbaiki:** Pada 50+ pharmacy, halaman index bisa memicu 200+ query per request. Response time akan degradasi secara eksponensial.

---

### 1.2 ProfileService Hardcode Admin ID

**Lokasi:** `ProfileService.php`

```php
// ❌ SANGAT BERBAHAYA
protected string $adminId = '019db9a6-8991-7103-b685-bf0ed93fe9fb';

public function getProfileData()
{
    // Selalu return data admin yang sama, bukan user yang login
    return [
        'id' => $this->adminId,
        'username' => 'Super Admin',
        // ...
    ];
}
```

**Solusi:**

```php
// ✅ Gunakan auth context
class ProfileService
{
    public function getProfileData(): array
    {
        $user = auth()->user();
        
        return [
            'id'         => $user->id,
            'username'   => $user->username,
            'email'      => $user->email,
            'phone'      => $user->phone,
            'role'       => $user->role,
            'avatar_url' => $user->avatar_url,
            'is_active'  => $user->is_active,
            'created_at' => $user->created_at->format('d M Y'),
        ];
    }

    public function getRecentLogs(int $limit = 4)
    {
        return AuditLog::where('user_id', auth()->id())
            ->latest()
            ->take($limit)
            ->get();
    }
}
```

**Risiko jika tidak diperbaiki:** Semua admin yang login akan melihat data admin yang sama. Ini adalah security bug dan data bug sekaligus.

---

### 1.3 Missing Staff CRUD Routes

**Lokasi:** `routes/web.php`

```php
// ❌ Route staff hanya GET, tidak ada POST/PUT/DELETE
Route::get('/staff', [StaffController::class, 'index'])
    ->middleware('role:APOTEKER')
    ->name('staff');

// Tapi StaffController punya method store(), update(), destroy()
// yang tidak bisa diakses karena route-nya tidak ada!
```

**Solusi:**

```php
// ✅ Tambahkan resource routes untuk staff
Route::prefix('staff')
    ->name('staff.')
    ->middleware('role:APOTEKER')
    ->controller(StaffController::class)
    ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        Route::put('/{staff}', 'update')->name('update');
        Route::delete('/{staff}', 'destroy')->name('destroy');
    });
```

---

### 1.4 Missing Error Handling di Frontend

**Lokasi:** Hampir semua form submissions

```jsx
// ❌ Tidak ada error state management yang konsisten
const handleSubmit = (e) => {
    e.preventDefault();
    post(route("admin.pharmacies.store")); 
    // Tidak ada onError handler
    // User tidak tahu jika terjadi error
};

// ❌ Di useStaff.js - router calls tanpa error handling
router.delete(`/pharmacy/staff/${dialog.selected.id}`, {
    onSuccess: () => { ... }
    // onError tidak ada!
});
```

**Solusi:**

```jsx
// ✅ Consistent error handling pattern
import { toast } from 'sonner';

const handleSubmit = (e) => {
    e.preventDefault();
    post(route("admin.pharmacies.store"), {
        onSuccess: () => {
            toast.success('Apotek berhasil ditambahkan');
        },
        onError: (errors) => {
            const firstError = Object.values(errors)[0];
            toast.error('Gagal menyimpan', { description: firstError });
        },
        onFinish: () => setLoading(false),
    });
};
```

---

## BAGIAN 2: ISU ARSITEKTUR (Prioritas Tinggi-Menengah)

### 2.1 Duplikasi Service Layer

Terdapat dua service untuk hal yang sama:

```
app/Services/AdminService.php       ← Legacy/unused
app/Services/Admin/DashboardService.php  ← Yang dipakai

app/Services/PharmacyService.php    ← Legacy/unused  
app/Services/Pharmacy/PharmacyDashboardService.php ← Yang dipakai
app/Services/OrderService.php       ← Legacy
app/Services/Pharmacy/OrderService.php  ← Yang dipakai
```

**Solusi:** Hapus file legacy di root `Services/`. Tambahkan `@deprecated` comment sementara, lakukan audit usage, lalu delete.

```bash
# File yang aman dihapus setelah verifikasi:
app/Services/AdminService.php
app/Services/PharmacyService.php
app/Services/OrderService.php
```

---

### 2.2 WaitingRoomController dengan Mock Data

**Lokasi:** `WaitingRoomController.php`

```php
// ❌ Data mock di production controller
public function index(Request $request)
{
    $mockRegistration = [
        'pharmacyName' => 'Apotek Sehat Selalu', // Hardcoded!
        'email' => 'prayitno@apotek.id',
        // ...
    ];

    // Real implementation dicomment
    // $pharmacy = Pharmacy::whereHas(...)...
}
```

**Solusi:** Implementasikan logic yang sudah dicomment, atau buat feature flag:

```php
public function index(Request $request)
{
    $user = $request->user();
    
    $pharmacyStaff = $user->pharmacyStaff()->with('pharmacy')->first();
    
    if (!$pharmacyStaff || !$pharmacyStaff->pharmacy) {
        return redirect()->route('home');
    }
    
    $pharmacy = $pharmacyStaff->pharmacy;
    
    if ($pharmacy->verification_status === 'VERIFIED') {
        return redirect()->route('pharmacy.dashboard');
    }

    return Inertia::render('waiting-room', [
        'registration' => [
            'pharmacyName'   => $pharmacy->name,
            'pharmacistName' => $user->username,
            'email'          => $user->email,
            'phone'          => $pharmacy->phone ?? $user->phone,
            'address'        => $pharmacy->address,
            'licenseNumber'  => $pharmacy->license_number,
            'status'         => $pharmacy->verification_status,
            'submissionDate' => $pharmacy->created_at->format('d M Y'),
            'isRejected'     => $pharmacy->verification_status === 'REJECTED',
        ]
    ]);
}
```

---

### 2.3 Tidak Ada BaseModel / Traits

Setiap model memiliki scope yang sama ditulis ulang:

```php
// ❌ Pattern ini ada di User, Pharmacy, Medicine, PharmacyStaff:
public function scopeSearch($query, $search) { ... }
public function scopeFilterStatus($query, $status) { ... }
```

**Solusi:** Buat reusable traits:

```php
// app/Models/Traits/HasSearchScope.php
trait HasSearchScope
{
    public function scopeSearch($query, ?string $search, array $columns = ['name'])
    {
        return $query->when($search, function ($q) use ($search, $columns) {
            $q->where(function ($sq) use ($search, $columns) {
                foreach ($columns as $i => $col) {
                    $method = $i === 0 ? 'where' : 'orWhere';
                    $sq->$method($col, 'ilike', "%{$search}%");
                }
            });
        });
    }
}

// app/Models/Traits/HasStatusScope.php
trait HasStatusScope
{
    public function scopeFilterStatus($query, ?string $status, string $column = 'is_active')
    {
        return $query->when($status && $status !== 'all', function ($q) use ($status, $column) {
            $q->where($column, $status === 'active');
        });
    }
}

// Penggunaan di model
class User extends Authenticatable
{
    use HasSearchScope, HasStatusScope;
    
    protected array $searchColumns = ['username', 'email'];
}
```

---

### 2.4 Pharmacy Order Service Logic Leak

**Lokasi:** `OrderService.php` (legacy di root Services)

```php
// ❌ Masih decrement stock langsung dari Medicine model
// padahal schema sudah pakai MedicineBatch
$medicine->decrement('stock', $item['quantity']);
```

Schema terbaru menggunakan `medicine_batches` untuk tracking stok, tapi service lama masih update field `stock` di tabel `medicines` yang bahkan sudah tidak ada di migration terbaru.

---

## BAGIAN 3: PERFORMA (Prioritas Menengah)

### 3.1 Missing Database Indexes

Dari analisis migration, beberapa query yang sering dijalankan tidak memiliki index:

```sql
-- ❌ Tidak ada index di pharmacy_staffs untuk lookup by user_id
-- Query di HandleInertiaRequests:
$user->pharmacyStaff  -- SELECT * FROM pharmacy_staffs WHERE user_id = ?

-- ❌ Tidak ada index untuk AuditLog queries
-- Padahal sering difilter by action + user_id + created_at
```

**Solusi:** Tambahkan migration untuk indexes:

```php
// database/migrations/xxxx_add_performance_indexes.php
Schema::table('pharmacy_staffs', function (Blueprint $table) {
    $table->index('user_id');     // Untuk auth middleware lookup
    $table->index(['pharmacy_id', 'is_active']); // Untuk staff listing
});

Schema::table('audit_logs', function (Blueprint $table) {
    $table->index(['user_id', 'created_at']); // Untuk profile audit history
    $table->index(['action', 'status']);       // Untuk filter queries
});

Schema::table('orders', function (Blueprint $table) {
    $table->index(['pharmacy_id', 'order_status', 'created_at']);
});

Schema::table('medicines', function (Blueprint $table) {
    $table->index(['pharmacy_id', 'is_active', 'deleted_at']);
});
```

---

### 3.2 Expensive Shared Data di Setiap Request

**Lokasi:** `HandleInertiaRequests.php`

```php
// ❌ Setiap request (termasuk partial Inertia) trigger query ini:
'auth' => [
    'user' => $request->user() ? [
        // ...
        'pharmacy_staff' => $request->user()->pharmacyStaff ? [
            // Ini adalah additional query per-request!
            'role' => $request->user()->pharmacyStaff->role,
            'pharmacy_id' => $request->user()->pharmacyStaff->pharmacy_id,
        ] : null,
    ] : null,
],
```

**Solusi:** Eager load dan cache di session:

```php
public function share(Request $request): array
{
    $user = $request->user();
    
    // Eager load relasi sekaligus
    if ($user && !$user->relationLoaded('pharmacyStaff')) {
        $user->load('pharmacyStaff');
    }

    return [
        ...parent::share($request),
        'auth' => [
            'user' => $user ? $this->formatUser($user) : null,
        ],
        'ziggy' => fn() => [
            ...(new Ziggy)->toArray(),
            'location' => $request->url(),
        ],
        // Flash messages untuk feedback
        'flash' => [
            'success' => $request->session()->get('success'),
            'error'   => $request->session()->get('error'),
        ],
    ];
}

private function formatUser($user): array
{
    return [
        'id'             => $user->id,
        'username'       => $user->username,
        'email'          => $user->email,
        'role'           => $user->role,
        'avatar_url'     => $user->avatar_url,
        'pharmacy_staff' => $user->pharmacyStaff ? [
            'role'        => $user->pharmacyStaff->role,
            'pharmacy_id' => $user->pharmacyStaff->pharmacy_id,
        ] : null,
    ];
}
```

---

### 3.3 Dashboard Service Multiple Queries Inefficiency

**Lokasi:** `PharmacyDashboardService.php`

```php
// ❌ 4 separate queries untuk weekly trend
protected function getOrderTrendData(string $pharmacyId)
{
    return collect([
        ['week' => 'Minggu 1', 'pesanan' => Order::where(...)...->count()],  // Query 1
        ['week' => 'Minggu 2', 'pesanan' => Order::where(...)...->count()],  // Query 2
        ['week' => 'Minggu 3', 'pesanan' => Order::where(...)...->count()],  // Query 3
        ['week' => 'Minggu 4', 'pesanan' => Order::where(...)...->count()],  // Query 4
    ]);
}
```

**Solusi:** Single query dengan grouping:

```php
protected function getOrderTrendData(string $pharmacyId): Collection
{
    $startOfMonth = now()->startOfMonth();
    
    $orders = Order::where('pharmacy_id', $pharmacyId)
        ->where('created_at', '>=', $startOfMonth)
        ->selectRaw('
            COUNT(*) as count,
            CEIL(EXTRACT(DAY FROM created_at) / 7.0) as week_number
        ')
        ->groupBy('week_number')
        ->pluck('count', 'week_number');

    return collect(range(1, 4))->map(fn($w) => [
        'week'    => "Minggu {$w}",
        'pesanan' => (int) ($orders[$w] ?? 0),
    ]);
}
```

---

## BAGIAN 4: STRUKTUR KODE (Prioritas Menengah)

### 4.1 Form Validation Tidak Konsisten

```php
// ❌ LoginRequest — field 'remember' nullable|boolean
// Tapi di AuthService tidak ada default value handling:
Auth::login($user, $credentials['remember'] ?? false);
// Ini oke, tapi...

// ❌ StoreMedicineRequest — validasi by name, bukan by ID
'category' => 'required|string|exists:medicine_categories,name',
// Ini rawan case-sensitivity issues di database!
```

**Solusi untuk medicine validation:**

```php
// ✅ Validasi by ID, resolve di Service
'category_id' => 'required|uuid|exists:medicine_categories,id',
'form_id'     => 'required|uuid|exists:medicine_forms,id',
'type_id'     => 'required|uuid|exists:medicine_types,id',
'unit_id'     => 'required|uuid|exists:medicine_units,id',

// Di MedicineService::store()
$medicine = Medicine::create([
    'category_id' => $data['category_id'], // Langsung pakai ID
    // ...
]);
```

---

### 4.2 AdminPagination Component Inconsistency

**Lokasi:** `AdminPagination.jsx`

```jsx
// ❌ Asumsi struktur pagination yang tidak konsisten
// Component ini expect:
pagination.data       // array items
pagination.meta.links // links array  
pagination.prev_page_url
pagination.next_page_url
pagination.from / .to / .total

// Tapi Inertia paginator Laravel format berbeda di beberapa tempat.
// Perlu normalisasi.
```

**Solusi:** Buat single pagination hook:

```jsx
// hooks/usePagination.js
export function usePagination(paginatedData) {
    return {
        items: paginatedData?.data ?? [],
        meta: {
            from: paginatedData?.from ?? 0,
            to: paginatedData?.to ?? 0,
            total: paginatedData?.total ?? 0,
            links: paginatedData?.meta?.links ?? paginatedData?.links ?? [],
            currentPage: paginatedData?.current_page ?? 1,
            lastPage: paginatedData?.last_page ?? 1,
        },
        goToPage: (url) => {
            if (url) router.get(url, {}, { preserveState: true });
        },
    };
}
```

---

### 4.3 Magic Strings Everywhere

```jsx
// ❌ Status strings hardcoded di banyak tempat
order.order_status === "PENDING"    // OrderDetailPanel.jsx
order.order_status === "PROCESSING" // Repeated
order.order_status === "SHIPPED"    // Repeated

// ❌ Role strings
if ($user->role === 'SUPER_ADMIN')   // LoginController
if ($user->role === 'APOTEKER')      // Sidebar.jsx
```

**Solusi Backend — Gunakan Enum yang sudah ada:**

```php
// app/Enums/UserRole.php (baru)
enum UserRole: string
{
    case CUSTOMER       = 'CUSTOMER';
    case PHARMACY_STAFF = 'PHARMACY_STAFF';
    case APOTEKER       = 'APOTEKER';
    case SUPER_ADMIN    = 'SUPER_ADMIN';

    public function label(): string
    {
        return match($this) {
            self::CUSTOMER       => 'Pengguna',
            self::PHARMACY_STAFF => 'Staff Apotek',
            self::APOTEKER       => 'Apoteker',
            self::SUPER_ADMIN    => 'Super Admin',
        };
    }
}

// Di LoginController
if ($user->role === UserRole::SUPER_ADMIN->value) {
    return redirect()->route('admin.dashboard');
}
```

**Solusi Frontend:**

```js
// lib/enums.js
export const ORDER_STATUS = {
    PENDING:          'PENDING',
    PROCESSING:       'PROCESSING',
    READY_FOR_PICKUP: 'READY_FOR_PICKUP',
    SHIPPED:          'SHIPPED',
    DELIVERED:        'DELIVERED',
    COMPLETED:        'COMPLETED',
    CANCELLED:        'CANCELLED',
};

export const USER_ROLE = {
    CUSTOMER:       'CUSTOMER',
    PHARMACY_STAFF: 'PHARMACY_STAFF',
    APOTEKER:       'APOTEKER',
    SUPER_ADMIN:    'SUPER_ADMIN',
};
```

---

## BAGIAN 5: MANAJEMEN STATE & DATA FLOW

### 5.1 useOrderForm — Filtering Tidak Reaktif terhadap Medicines

**Lokasi:** `useOrderForm.js`

```js
// ❌ filteredDrugs tidak depend pada medicines prop
const filteredDrugs = useMemo(() => {
    return medicines.filter((drug) => {
        // Filter logic...
    });
}, [
    searchQuery,
    selectedCategory, 
    // ❌ 'medicines' tidak ada di dependency array!
    // Jika medicines prop berubah, filteredDrugs tidak update
]);
```

**Solusi:**

```js
const filteredDrugs = useMemo(() => {
    return medicines.filter((drug) => { ... });
}, [medicines, searchQuery, selectedCategory, selectedForm, selectedType, selectedUnit]);
//  ^^^^^^^^ Tambahkan ini
```

---

### 5.2 Local State yang Seharusnya Server State

**Lokasi:** `ProfileCard.jsx` (pharmacy)

```jsx
// ❌ Status apotek di-manage sebagai local state
// Tapi tidak di-sync ke server!
const [isPharmacyOpen, setIsPharmacyOpen] = useState(true);

// Toggle switch ini hanya mengubah UI, tidak ada API call
<Switch
    checked={isPharmacyOpen}
    onCheckedChange={setIsPharmacyOpen} // Hanya local state!
/>
```

**Solusi:**

```jsx
// ✅ Sync dengan server menggunakan Inertia router
const handleToggleOpen = (value) => {
    router.patch(route('pharmacy.toggle-status'), {
        is_force_closed: !value,
    }, {
        preserveScroll: true,
        onSuccess: () => toast.success(
            value ? 'Apotek dibuka' : 'Apotek ditutup sementara'
        ),
        onError: () => toast.error('Gagal mengubah status'),
    });
};
```

---

## BAGIAN 6: KEAMANAN

### 6.1 Authorization di Controller Tidak Konsisten

```php
// ❌ MedicineController menggunakan manual check
public function destroy(Request $request, Medicine $medicine)
{
    if ($medicine->pharmacy_id !== $request->user()->pharmacyStaff->pharmacy_id) {
        abort(403);
    }
    // ...
}

// Tapi di update(), check dilakukan dengan query:
$medicine = Medicine::where('pharmacy_id', $request->user()->pharmacyStaff->pharmacy_id)
    ->findOrFail($id);
// Inkonsisten! Kalau ID tidak cocok, satu throw 403, lainnya throw 404
```

**Solusi:** Gunakan Laravel Policy:

```php
// app/Policies/MedicinePolicy.php
class MedicinePolicy
{
    public function update(User $user, Medicine $medicine): bool
    {
        return $user->pharmacyStaff?->pharmacy_id === $medicine->pharmacy_id;
    }

    public function delete(User $user, Medicine $medicine): bool
    {
        return $user->pharmacyStaff?->pharmacy_id === $medicine->pharmacy_id;
    }
}

// Di Controller
public function update(UpdateMedicineRequest $request, Medicine $medicine)
{
    $this->authorize('update', $medicine); // Consistent 403 response
    $this->medicineService->update($medicine, $request->validated());
    // ...
}
```

---

### 6.2 Mass Assignment Risk

```php
// ❌ Semua model menggunakan $guarded = []
// Ini artinya SEMUA field bisa di-mass assign
class Medicine extends Model
{
    protected $guarded = []; // Tidak ada proteksi sama sekali!
}
```

**Solusi:** Gunakan `$fillable` eksplisit pada model-model sensitif:

```php
class Medicine extends Model
{
    protected $fillable = [
        'pharmacy_id', 'category_id', 'form_id', 'type_id', 'unit_id',
        'name', 'generic_name', 'manufacturer', 'description',
        'dosage_info', 'price', 'requires_prescription',
        'weight_in_grams', 'is_active',
    ];
    
    // Field yang TIDAK boleh di-mass assign (seperti deleted_at)
    // tidak perlu dicantumkan
}
```

---

## ROADMAP PRIORITAS REFAKTOR

| Prioritas | Item | Dampak | Effort |
|-----------|------|--------|--------|
| 🔴 P1 | Fix hardcoded admin ID di ProfileService | **Security Bug** | Rendah |
| 🔴 P1 | Tambah missing Staff CRUD routes | **Feature Broken** | Rendah |
| 🔴 P1 | Fix N+1 query di Resource files | **Performance** | Menengah |
| 🟠 P2 | Implementasi WaitingRoom logic sebenarnya | **Feature Incomplete** | Menengah |
| 🟠 P2 | Tambah database indexes | **Performance** | Rendah |
| 🟠 P2 | Hapus service duplikat (legacy files) | **Maintainability** | Rendah |
| 🟠 P2 | Konsistenkan error handling di frontend | **UX** | Menengah |
| 🟡 P3 | Buat HasSearchScope / HasStatusScope traits | **Code Quality** | Menengah |
| 🟡 P3 | Implementasi Laravel Policies | **Security** | Tinggi |
| 🟡 P3 | Ganti $guarded = [] dengan $fillable | **Security** | Menengah |
| 🟡 P3 | Tambahkan enums untuk magic strings | **Maintainability** | Menengah |
| 🟢 P4 | Optimasi dashboard queries | **Performance** | Menengah |
| 🟢 P4 | Normalisasi pagination component | **DX** | Rendah |
| 🟢 P4 | Sync pharmacy status ke server | **Feature Completeness** | Rendah |

---

## KESIMPULAN

ApoTrack memiliki struktur yang cukup mature untuk ukuran project ini. Pemisahan feature-based di frontend dan service layer di backend adalah keputusan arsitektur yang tepat. Namun ada **3 isu yang harus segera ditangani sebelum production:**

1. **Hardcoded admin ID** — security bug nyata
2. **Missing staff routes** — fitur utama tidak berfungsi
3. **N+1 queries di resource** — akan crash performa saat data bertambah

Setelah itu, fokus pada **konsistensi** — error handling, authorization pattern, dan naming convention — agar codebase lebih predictable dan mudah untuk onboarding developer baru.