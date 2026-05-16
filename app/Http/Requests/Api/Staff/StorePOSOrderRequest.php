<?php

namespace App\Http\Requests\Api\Staff;

use App\Http\Requests\Api\BaseApiRequest;

class StorePOSOrderRequest extends BaseApiRequest
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
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:medicines,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'payment_method' => 'nullable|string',
            'user_id' => 'nullable|exists:users,id',
        ];
    }
}
