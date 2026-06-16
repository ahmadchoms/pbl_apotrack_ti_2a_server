<?php

namespace App\Http\Requests\Api\Customer;

use App\Http\Requests\Api\BaseApiRequest;

class CheckShippingRatesRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === 'USER';
    }

    public function rules(): array
    {
        return [
            'pharmacy_id' => 'required|exists:pharmacies,id',
            'address_id' => 'required|exists:user_addresses,id',
        ];
    }
}
