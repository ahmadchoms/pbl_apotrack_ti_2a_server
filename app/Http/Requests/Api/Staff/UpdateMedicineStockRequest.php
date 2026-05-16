<?php

namespace App\Http\Requests\Api\Staff;

use App\Http\Requests\Api\BaseApiRequest;

class UpdateMedicineStockRequest extends BaseApiRequest
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
            'batch_id' => 'required_if:type,ADJUSTMENT|exists:medicine_batches,id',
            'type' => 'required|in:IN,OUT,ADJUSTMENT',
            'quantity' => 'required_unless:type,ADJUSTMENT|integer|min:1',
            'new_stock' => 'required_if:type,ADJUSTMENT|integer|min:0',
            'batch_number' => 'required_if:type,IN|string',
            'expired_date' => 'required_if:type,IN|date',
            'note' => 'nullable|string',
        ];
    }
}
