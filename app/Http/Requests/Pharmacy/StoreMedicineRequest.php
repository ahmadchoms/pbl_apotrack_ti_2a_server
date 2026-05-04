<?php

namespace App\Http\Requests\Pharmacy;

use Illuminate\Foundation\Http\FormRequest;

class StoreMedicineRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'generic_name' => 'nullable|string|max:255',
            'manufacturer' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'dosage_info' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'weight_in_grams' => 'nullable|numeric|min:0',
            'category' => 'required|string|exists:medicine_categories,name',
            'type' => 'required|string|exists:medicine_types,name',
            'form' => 'required|string|exists:medicine_forms,name',
            'unit' => 'required|string|exists:medicine_units,name',
            'requires_prescription' => 'required|boolean',
            'is_active' => 'required|boolean',
            'batches' => 'required|array|min:1',
            'batches.*.batch_number' => 'required|string',
            'batches.*.expired_date' => 'required|date',
            'batches.*.stock' => 'required|integer|min:0',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
        ];
    }
}
