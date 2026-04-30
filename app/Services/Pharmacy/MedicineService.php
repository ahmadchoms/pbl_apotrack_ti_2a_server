<?php

namespace App\Services\Pharmacy;

use App\Models\Medicine;
use App\Models\MedicineCategory;
use App\Models\MedicineForm;
use App\Models\MedicineType;
use App\Models\MedicineUnit;
use Illuminate\Support\Facades\DB;

class MedicineService
{
    public function list(string $pharmacyId, array $filters)
    {
        return Medicine::query()
            ->with(['category', 'form', 'type', 'unit', 'images', 'batches'])
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

            foreach ($data['batches'] as $batchData) {
                $medicine->batches()->create($batchData);
            }

            if (isset($data['images'])) {
                foreach ($data['images'] as $index => $image) {
                    $path = $image->store('medicines', 'public');
                    $medicine->images()->create([
                        'image_url' => $path,
                        'is_primary' => $index === 0
                    ]);
                }
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

            $this->syncBatches($medicine, $data['batches'] ?? []);

            if (isset($data['images'])) {
                // For update, we might want to clear old images or append.
                // Request says "implement a storage bucket system", so I'll handle replacement.
                $medicine->images()->delete(); 
                foreach ($data['images'] as $index => $image) {
                    $path = $image->store('medicines', 'public');
                    $medicine->images()->create([
                        'image_url' => $path,
                        'is_primary' => $index === 0
                    ]);
                }
            }

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

    public function getActiveMedicines(string $pharmacyId)
    {
        return Medicine::query()
            ->with([
                'category',
                'form',
                'unit',
            ])
            ->with(['primaryImage'])
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
