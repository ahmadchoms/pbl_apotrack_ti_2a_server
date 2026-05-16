<?php

namespace App\Http\Requests\Api\Customer;

use App\Http\Requests\Api\BaseApiRequest;

class StoreAddressRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === 'USER';
    }

    public function rules(): array
    {
        return [
            'label' => 'required|string|max:50',
            'address_detail' => 'required|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'is_primary' => 'boolean',
        ];
    }
}
