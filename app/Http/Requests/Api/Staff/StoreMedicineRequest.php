<?php

namespace App\Http\Requests\Api\Staff;

use App\Http\Requests\Api\BaseApiRequest;

class StoreMedicineRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        $user = $this->user();
        if (!$user) return false;

        if (in_array($user->role, ['STAFF', 'APOTEKER'])) {
            return true;
        }

        $user->loadMissing('pharmacyStaff');
        return $user->pharmacyStaff && $user->pharmacyStaff->is_active;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:200',
            'category' => 'required|string',
            'type' => 'required|string',
            'form' => 'required|string',
            'unit' => 'required|string',
            'price' => 'required|numeric|min:0',
            'is_active' => 'required|boolean',
            'image' => 'nullable|image|max:2048',
            'generic_name' => 'nullable|string|max:255',
            'manufacturer' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'dosage_info' => 'nullable|string',
            'requires_prescription' => 'required|boolean',
            'weight_in_grams' => 'nullable|numeric|min:0',
            'batches' => 'nullable|array',
            'batches.*.batch_number' => 'required|string|max:50',
            'batches.*.expired_date' => 'required|date',
            'batches.*.stock' => 'required|integer|min:0',
        ];
    }
}
