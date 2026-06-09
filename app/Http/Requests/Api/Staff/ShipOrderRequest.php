<?php

namespace App\Http\Requests\Api\Staff;

use App\Http\Requests\Api\BaseApiRequest;

class ShipOrderRequest extends BaseApiRequest
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
            'courier_code' => 'nullable|string',
            'courier_service' => 'nullable|string',
        ];
    }
}
