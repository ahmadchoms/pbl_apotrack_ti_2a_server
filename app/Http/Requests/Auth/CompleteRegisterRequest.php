<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class CompleteRegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // User Data
            'username' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|max:20',
            'password' => 'required|string|min:8|confirmed',

            // Pharmacy Data
            'pharmacy_name' => 'required|string|max:150',
            'pharmacy_address' => 'required|string',
            'pharmacy_phone' => 'nullable|string|max:20',
            'pharmacy_latitude' => 'required|numeric|between:-90,90',
            'pharmacy_longitude' => 'required|numeric|between:-180,180',
            'license_number' => 'required|string|max:100',
            
            // Optional: License document, etc.
        ];
    }
}
