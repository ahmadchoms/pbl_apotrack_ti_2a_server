<?php

namespace App\Http\Requests\Api\Customer;

use App\Http\Requests\Api\BaseApiRequest;

class StoreCustomerOrderRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === 'USER';
    }

    public function rules(): array
    {
        return [
            'pharmacy_id' => 'required|exists:pharmacies,id',
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:medicines,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric',
            'subtotal_amount' => 'required|numeric',
            'service_type' => 'required|string|in:PICK_UP,DELIVERY',
            'payment_method' => 'required|string|in:CASH,TRANSFER,E-WALLET',
            
            'address_id' => 'required_if:service_type,DELIVERY|nullable|exists:user_addresses,id',
            'courier_code' => 'required_if:service_type,DELIVERY|nullable|string',
            'courier_service' => 'required_if:service_type,DELIVERY|nullable|string',
            'shipping_cost' => 'required_if:service_type,DELIVERY|numeric',
            'notes' => 'nullable|string'
        ];
    }
}
