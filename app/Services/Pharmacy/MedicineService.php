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
            $category = MedicineCategory::where('name', $data['category'])->firstOrFail();
            $type = MedicineType::where('name', $data['type'])->firstOrFail();
            $form = MedicineForm::where('name', $data['form'])->firstOrFail();
            $unit = MedicineUnit::where('name', $data['unit'])->firstOrFail();

            $medicine = Medicine::create([
                'pharmacy_id' => $pharmacyId,
                'category_id' => $category->id,
                'type_id' => $type->id,
                'form_id' => $form->id,
                'unit_id' => $unit->id,
                'name' => $data['name'],
                'generic_name' => $data['generic_name'],
                'manufacturer' => $data['manufacturer'],
                'description' => $data['description'],
                'dosage_info' => $data['dosage_info'],
                'price' => $data['price'],
                'weight_in_grams' => $data['weight_in_grams'],
                'requires_prescription' => $data['requires_prescription'],
                'is_active' => $data['is_active'],
            ]);

            if (isset($data['image'])) {
                $file = $data['image'];
                $path = 'medicines/' . $file->hashName();
                Storage::disk('s3')->put($path, file_get_contents($file));
                $medicine->update(['image_url' => Storage::disk('s3')->url($path)]);
            }

            foreach ($data['batches'] as $batchData) {
                $medicine->batches()->create($batchData);
            }



            return $medicine;
        });
    }

    public function update(Medicine $medicine, array $data)
    {
        return DB::transaction(function () use ($medicine, $data) {
            $category = MedicineCategory::where('name', $data['category'])->firstOrFail();
            $type = MedicineType::where('name', $data['type'])->firstOrFail();
            $form = MedicineForm::where('name', $data['form'])->firstOrFail();
            $unit = MedicineUnit::where('name', $data['unit'])->firstOrFail();

            $medicine->update([
                'category_id' => $category->id,
                'type_id' => $type->id,
                'form_id' => $form->id,
                'unit_id' => $unit->id,
                'name' => $data['name'],
                'generic_name' => $data['generic_name'],
                'manufacturer' => $data['manufacturer'],
                'description' => $data['description'],
                'dosage_info' => $data['dosage_info'],
                'price' => $data['price'],
                'weight_in_grams' => $data['weight_in_grams'],
                'requires_prescription' => $data['requires_prescription'],
                'is_active' => $data['is_active'],
            ]);

            if (isset($data['image'])) {
                if ($medicine->image_url) {
                    // Extract relative path from URL for S3 deletion
                    $urlPath = parse_url($medicine->image_url, PHP_URL_PATH);
                    
                    // Supabase public URLs often contain '/storage/v1/object/public/bucket/'
                    // We need the part after the bucket name.
                    $bucket = env('AWS_BUCKET');
                    $search = '/' . $bucket . '/';
                    $pos = strpos($urlPath, $search);
                    
                    if ($pos !== false) {
                        $oldPath = substr($urlPath, $pos + strlen($search));
                    } else {
                        $oldPath = ltrim($urlPath, '/');
                    }
                    
                    if (Storage::disk('s3')->exists($oldPath)) {
                        Storage::disk('s3')->delete($oldPath);
                    }
                }
                
                $file = $data['image'];
                $path = 'medicines/' . $file->hashName();
                Storage::disk('s3')->put($path, file_get_contents($file));
                $medicine->update(['image_url' => Storage::disk('s3')->url($path)]);
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
                'stock' => $data['stock'],
            ]);

            StockMovement::create([
                'medicine_id' => $medicineId,
                'batch_id' => $batch->id,
                'type' => 'IN',
                'quantity' => $data['stock'],
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
