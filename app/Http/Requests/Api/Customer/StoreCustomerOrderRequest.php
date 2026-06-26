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
            'service_type' => 'required|string|in:PICKUP,PICK_UP',
            'payment_method' => 'required|string|in:CASH,TRANSFER,E-WALLET,QRIS',
            'notes' => 'nullable|string'
        ];
    }
}
