<?php

namespace App\Services\Pharmacy;

use App\Models\Medicine;
use App\Models\MedicineBatch;
use App\Models\MedicineCategory;
use App\Models\MedicineForm;
use App\Models\MedicineType;
use App\Models\MedicineUnit;
use App\Models\StockMovement;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class MedicineService
{
    public function list(string $pharmacyId, array $filters)
    {
        return Medicine::query()
            ->with(['category', 'form', 'type', 'unit', 'batches'])
            ->withTotalActiveStock()
            ->where('pharmacy_id', $pharmacyId)
            ->search($filters['search'] ?? null)
            ->filterByCategory($filters['category'] ?? null)
            ->filterByStatus($filters['status'] ?? null)
            ->latest()
            ->paginate(8);
    }

    public function store(string $pharmacyId, array $data)
    {
        return DB::transaction(function () use ($pharmacyId, $data) {
            // 1. Get Category
            $category = MedicineCategory::where('name', $data['category'] ?? '')->first();
            if (!$category) throw new \Exception("Kategori '" . ($data['category'] ?? 'NULL') . "' tidak ditemukan.");
            
            // 2. Get Type (with smart check)
            $type = MedicineType::where('name', $data['type'] ?? '')->first();
            if (!$type) {
                // Cek apakah user salah memasukkan data Sediaan ke kolom Tipe
                if (MedicineForm::where('name', $data['type'])->exists()) {
                    throw new \Exception("Kesalahan: '" . $data['type'] . "' adalah Sediaan (Form), jangan masukkan ke kolom Golongan Obat.");
                }
                throw new \Exception("Tipe '" . ($data['type'] ?? 'NULL') . "' tidak ditemukan di database.");
            }

            // 3. Get Form (with smart check)
            $form = MedicineForm::where('name', $data['form'] ?? '')->first();
            if (!$form) {
                // Cek apakah user salah memasukkan data Golongan ke kolom Sediaan
                if (MedicineType::where('name', $data['form'])->exists()) {
                    throw new \Exception("Kesalahan: '" . $data['form'] . "' adalah Golongan Obat (Type), jangan masukkan ke kolom Sediaan (Form).");
                }
                throw new \Exception("Sediaan '" . ($data['form'] ?? 'NULL') . "' tidak ditemukan di database.");
            }

            // 4. Get Unit
            $unit = MedicineUnit::where('name', $data['unit'] ?? '')->first();
            if (!$unit) throw new \Exception("Satuan '" . ($data['unit'] ?? 'NULL') . "' tidak ditemukan.");

            $medicine = Medicine::create([
                'pharmacy_id' => $pharmacyId,
                'category_id' => $category->id,
                'type_id' => $type->id,
                'form_id' => $form->id,
                'unit_id' => $unit->id,
                'name' => $data['name'],
                'generic_name' => $data['generic_name'] ?? null,
                'manufacturer' => $data['manufacturer'] ?? null,
                'description' => $data['description'] ?? null,
                'dosage_info' => $data['dosage_info'] ?? null,
                'price' => $data['price'],
                'weight_in_grams' => $data['weight_in_grams'] ?? 0,
                'requires_prescription' => $data['requires_prescription'] ?? false,
                'is_active' => $data['is_active'] ?? true,
            ]);

            if (isset($data['image'])) {
                try {
                    $file = $data['image'];
                    $disk = config('filesystems.default');
                    $path = 'medicines/' . $file->hashName();
                    
                    Storage::disk($disk)->put($path, file_get_contents($file));
                    $medicine->update(['image_url' => Storage::disk($disk)->url($path)]);
                } catch (\Exception $e) {
                    \Log::warning("Gagal upload gambar obat: " . $e->getMessage());
                    // Tetap lanjut meskipun gambar gagal, agar data obat tersimpan
                }
            }

            if (isset($data['batches']) && is_array($data['batches'])) {
                $this->syncBatches($medicine, $data['batches']);
            }

            return $medicine;
        });
    }

    public function update(Medicine $medicine, array $data)
    {
        return DB::transaction(function () use ($medicine, $data) {
            // 1. Get Category
            $category = MedicineCategory::where('name', $data['category'] ?? '')->first();
            if (!$category) throw new \Exception("Kategori '" . ($data['category'] ?? 'NULL') . "' tidak ditemukan.");
            
            // 2. Get Type (with smart check)
            $type = MedicineType::where('name', $data['type'] ?? '')->first();
            if (!$type) {
                if (MedicineForm::where('name', $data['type'])->exists()) {
                    throw new \Exception("Kesalahan: '" . $data['type'] . "' adalah Sediaan (Form), jangan masukkan ke kolom Golongan Obat.");
                }
                throw new \Exception("Tipe '" . ($data['type'] ?? 'NULL') . "' tidak ditemukan di database.");
            }

            // 3. Get Form (with smart check)
            $form = MedicineForm::where('name', $data['form'] ?? '')->first();
            if (!$form) {
                if (MedicineType::where('name', $data['form'])->exists()) {
                    throw new \Exception("Kesalahan: '" . $data['form'] . "' adalah Golongan Obat (Type), jangan masukkan ke kolom Sediaan (Form).");
                }
                throw new \Exception("Sediaan '" . ($data['form'] ?? 'NULL') . "' tidak ditemukan di database.");
            }

            // 4. Get Unit
            $unit = MedicineUnit::where('name', $data['unit'] ?? '')->first();
            if (!$unit) throw new \Exception("Satuan '" . ($data['unit'] ?? 'NULL') . "' tidak ditemukan.");

            $medicine->update([
                'category_id' => $category->id,
                'type_id' => $type->id,
                'form_id' => $form->id,
                'unit_id' => $unit->id,
                'name' => $data['name'],
                'generic_name' => $data['generic_name'] ?? null,
                'manufacturer' => $data['manufacturer'] ?? null,
                'description' => $data['description'] ?? null,
                'dosage_info' => $data['dosage_info'] ?? null,
                'price' => $data['price'],
                'weight_in_grams' => $data['weight_in_grams'] ?? 0,
                'requires_prescription' => $data['requires_prescription'] ?? false,
                'is_active' => $data['is_active'] ?? true,
            ]);

            if (isset($data['image'])) {
                try {
                    $disk = config('filesystems.default');
                    if ($medicine->image_url) {
                        $urlPath = parse_url($medicine->image_url, PHP_URL_PATH);
                        $bucket = env('SUPABASE_BUCKET_PRIVATE', 'apotrack-private');
                        $search = '/' . $bucket . '/';
                        $pos = strpos($urlPath, $search);
                        
                        if ($pos !== false) {
                            $oldPath = substr($urlPath, $pos + strlen($search));
                        } else {
                            $oldPath = ltrim($urlPath, '/');
                        }
                        
                        if (Storage::disk($disk)->exists($oldPath)) {
                            Storage::disk($disk)->delete($oldPath);
                        }
                    }
                    
                    $file = $data['image'];
                    $path = 'medicines/' . $file->hashName();
                    Storage::disk($disk)->put($path, file_get_contents($file));
                    $medicine->update(['image_url' => Storage::disk($disk)->url($path)]);
                } catch (\Exception $e) {
                    \Log::warning("Gagal update gambar obat: " . $e->getMessage());
                }
            }

            $this->syncBatches($medicine, $data['batches'] ?? []);



            return $medicine;
        });
    }

    protected function syncBatches(Medicine $medicine, array $batches)
    {
        $batchIds = collect($batches)->pluck('id')->filter()->toArray();

        // Remove batches not in the new list
        $medicine->batches()->whereNotIn('id', $batchIds)->delete();

        foreach ($batches as $batchData) {
            $medicine->batches()->updateOrCreate(
                ['id' => $batchData['id'] ?? null],
                [
                    'batch_number' => $batchData['batch_number'],
                    'expired_date' => $batchData['expired_date'],
                    'stock' => $batchData['stock'],
                ]
            );
        }
    }

    public function addBatch(string $medicineId, array $data, string $userId)
    {
        return DB::transaction(function () use ($medicineId, $data, $userId) {
            $medicine = Medicine::findOrFail($medicineId);

            $batch = $medicine->batches()->create([
                'batch_number' => $data['batch_number'],
                'expired_date' => $data['expired_date'],
                'stock' => $data['quantity'],
            ]);

            StockMovement::create([
                'medicine_id' => $medicineId,
                'batch_id' => $batch->id,
                'type' => 'IN',
                'quantity' => $data['quantity'],
                'note' => $data['note'] ?? 'Initial batch stock',
                'created_by' => $userId,
            ]);

            return $batch;
        });
    }

    public function adjustStock(string $batchId, array $data, string $userId)
    {
        return DB::transaction(function () use ($batchId, $data, $userId) {
            $batch = MedicineBatch::with('medicine')->findOrFail($batchId);
            $oldStock = $batch->stock;
            $newStock = $data['new_stock'];
            $diff = $newStock - $oldStock;

            if ($diff == 0) return $batch;

            $batch->update(['stock' => $newStock]);

            StockMovement::create([
                'medicine_id' => $batch->medicine_id,
                'batch_id' => $batch->id,
                'type' => 'ADJUSTMENT',
                'quantity' => abs($diff),
                'note' => ($data['note'] ?? 'Stock adjustment') . " (From $oldStock to $newStock)",
                'created_by' => $userId,
            ]);

            return $batch;
        });
    }

    public function getStockHistory(string $medicineId)
    {
        return StockMovement::with(['batch', 'creator'])
            ->where('medicine_id', $medicineId)
            ->latest()
            ->paginate(10);
    }

    public function getActiveMedicines(string $pharmacyId)
    {
        return Medicine::query()
            ->with([
                'category',
                'form',
                'unit',
            ])
            ->withTotalActiveStock()
            ->where('pharmacy_id', $pharmacyId)
            ->where('is_active', true)
            ->whereHas('batches', function ($q) {
                $q->where('expired_date', '>', now())
                    ->where('stock', '>', 0);
            })
            ->get();
    }
}
