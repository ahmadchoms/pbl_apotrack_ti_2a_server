<?php

namespace App\Http\Resources\Pharmacy;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MedicineResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'generic_name' => $this->generic_name,
            'description' => $this->description,
            'dosage_info' => $this->dosage_info,
            'manufacturer' => $this->manufacturer,
            'price' => (float) $this->price,
            'requires_prescription' => (bool) $this->requires_prescription,
            'is_active' => (bool) $this->is_active,
            'category' => $this->category?->name,
            'form' => $this->form?->name,
            'type' => $this->type?->name,
            'unit' => $this->unit?->name,
            'image_url' => $this->primaryImage?->image_url,
            'batches' => $this->batches,
            'weight_in_grams' => (float) $this->weight_in_grams,
            'total_active_stock' => (int) $this->total_active_stock,
            'created_at' => $this->created_at?->format('d M Y'),
        ];
    }
}
