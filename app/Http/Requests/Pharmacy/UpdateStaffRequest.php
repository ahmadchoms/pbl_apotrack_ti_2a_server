<?php

namespace App\Http\Requests\Pharmacy;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStaffRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'username' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email,' . $this->route('staff')->user_id,
            'phone' => 'nullable|string|max:20',
            'role' => 'required|string|in:APOTEKER,STAFF',
            'is_active' => 'required|boolean',
        ];
    }
}
