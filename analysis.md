# Project Analysis Report: ApoTrack Platform

## Executive Summary
Analisis ini bertujuan untuk mengevaluasi kualitas kode, struktur arsitektur, keamanan, dan performa dari platform ApoTrack. Meskipun fondasi aplikasi sudah cukup kuat menggunakan Laravel 11, React 19, dan Inertia.js, ditemukan beberapa area krusial yang memerlukan perbaikan untuk memastikan skalabilitas dan integritas data jangka panjang.

---

## 1. Arsitektur & Maintainability

### 1.1 Konsistensi Layer Layanan (Service Layer)
**Temuan:** Implementasi Service Layer tidak konsisten di seluruh aplikasi.
*   **Masalah:** Beberapa controller seperti `MedicineController` dan `OrderController` mengandalkan Service secara penuh, namun `UserController` masih melakukan logika validasi dan pengolahan data langsung di dalam method-nya.
*   **Dampak:** Duplikasi logika jika fitur yang sama diperlukan di endpoint API atau Command Line, serta menyulitkan Unit Testing.
*   **Rekomendasi:** Pindahkan seluruh logika bisnis dari `UserController` ke `UserService` dan gunakan `FormRequest` untuk validasi input.

### 1.2 Penggunaan Policies yang Belum Menyeluruh
**Temuan:** Terdapat file Policy (seperti `StockMovementPolicy`) yang sudah didefinisikan namun belum dipanggil secara konsisten di Controller terkait.
*   **Masalah:** Beberapa method di `UserController` dan `ReportController` tidak melakukan pengecekan `authorize()`, hanya mengandalkan middleware role global.
*   **Dampak:** Potensi celah keamanan jika terjadi perubahan struktur role di masa depan atau jika diperlukan otorisasi yang lebih granular (misal: Admin hanya bisa mengedit User di wilayah tertentu).
*   **Rekomendasi:** Terapkan `$this->authorize()` pada setiap method controller yang melakukan manipulasi data.

### 1.3 Duplikasi Logika di Frontend
**Temuan:** Komponen `index.jsx` pada berbagai fitur (Users, Pharmacies, Medicines) memiliki struktur tabel, filter, dan pagination yang hampir identik.
*   **Masalah:** Redundansi kode yang besar di `resources/js/features`.
*   **Dampak:** Sulit melakukan perubahan desain global (misal: mengganti gaya pagination atau filter) karena harus mengubah banyak file.
*   **Rekomendasi:** Abstraksi logika tabel dan filter ke dalam komponen reusable seperti `DataTable` dan `FilterBar`.

---

## 2. Integritas Data & Database

### 2.1 Ketidakkonsistenan Soft Deletes
**Temuan:** Model utama seperti `User` dan `Medicine` menggunakan `SoftDeletes`, namun model relasinya seperti `PharmacyStaff` dan `MedicineBatch` tidak menggunakannya.
*   **Masalah:** Saat `PharmacyStaffService@delete` dipanggil, record di tabel `pharmacy_staffs` dihapus secara permanen (Hard Delete), sedangkan record `users` hanya di-soft delete.
*   **Dampak:** Kehilangan riwayat hubungan (audit trail) jika data perlu dipulihkan. Laporan histori aktivitas mungkin akan merujuk ke ID yang sudah tidak ada.
*   **Rekomendasi:** Terapkan `SoftDeletes` pada seluruh model transaksi dan relasi penting, atau gunakan mekanisme "Archive".

### 2.2 Redundansi Kolom Stok
**Temuan:** Tabel `medicines` memiliki kolom `total_active_stock`, namun terdapat juga local scope `withTotalActiveStock` yang menghitung nilai yang sama dari tabel `medicine_batches`.
*   **Masalah:** Nilai kolom `total_active_stock` harus diupdate manual setiap kali ada transaksi, yang rawan terjadi *race condition* atau desinkronisasi data.
*   **Dampak:** Admin mungkin melihat jumlah stok yang berbeda antara halaman list dan halaman detail jika terjadi kegagalan update manual.
*   **Rekomendasi:** Hapus kolom `total_active_stock` dari database dan andalkan kalkulasi agregat (Query Sum) melalui scope atau gunakan Database Trigger jika performa menjadi bottleneck.

---

## 3. Performa & Optimasi

### 3.1 Potensi N+1 Queries
**Temuan:** Beberapa Resource (seperti `OrderResource` dan `PharmacyResource`) memuat relasi yang cukup dalam tanpa pengecekan apakah relasi tersebut sudah ter-eager load.
*   **Masalah:** Di `Admin\PharmacyService@list`, relasi `staffs.user` dimuat, namun di bagian lain mungkin terlewat.
*   **Dampak:** Beban database meningkat secara eksponensial seiring bertambahnya jumlah data.
*   **Rekomendasi:** Gunakan plugin `laravel-query-detector` saat development dan pastikan seluruh relasi yang diakses di Resource sudah didefinisikan dalam method `with()`.

### 3.2 Loading Global Middleware
**Temuan:** Middleware `CheckUserActive` dimuat di grup `web` global.
*   **Masalah:** Middleware ini melakukan query ke database untuk mengecek status user pada setiap request, termasuk untuk aset statis atau route yang tidak memerlukan auth.
*   **Dampak:** Overhead latensi pada setiap request.
*   **Rekomendasi:** Pindahkan middleware ini ke dalam grup middleware yang hanya membungkus rute yang membutuhkan autentikasi (`auth`).

---

## 4. File & Kode Tidak Terpakai (Dead Code)

### 4.1 Model & Controller Yatim
**Temuan:** Terdapat model `Notification` dan `DeliveryTrackingLog` yang sudah memiliki struktur namun belum memiliki logika implementasi (penciptaan data) di Service manapun.
*   **Masalah:** Penumpukan file yang membingungkan pengembang baru.
*   **Rekomendasi:** Jika fitur ini direncanakan untuk masa depan, berikan komentar TODO yang jelas atau pindahkan ke branch fitur terpisah hingga siap diimplementasikan.

---

## 5. Kesimpulan & Langkah Perbaikan

| Prioritas | Masalah Utama | Rekomendasi Concrete |
| :--- | :--- | :--- |
| **CRITICAL** | Hard Delete pada `PharmacyStaff` | Tambahkan `SoftDeletes` pada migration dan model terkait. |
| **HIGH** | Inconsistency `total_active_stock` | Migrasi logika stok ke sistem agregat dinamis. |
| **MEDIUM** | Duplikasi UI Table | Refaktor komponen `DataTable` yang generic di React. |
| **LOW** | Policy Unused | Audit seluruh Controller dan tambahkan `authorize()` calls. |

---
**Dibuat oleh:** Antigravity AI
**Tanggal:** 2026-05-02
