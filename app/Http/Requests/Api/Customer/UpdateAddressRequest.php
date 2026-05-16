<?php

namespace App\Http\Requests\Api\Customer;

use App\Http\Requests\Api\BaseApiRequest;

class UpdateAddressRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === 'USER';
    }

    public function rules(): array
    {
        return [
            'label' => 'string|max:50',
            'address_detail' => 'string',
            'latitude' => 'numeric',
            'longitude' => 'numeric',
            'is_primary' => 'boolean',
        ];
    }
}
