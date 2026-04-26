<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePharmacyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:150',
            'address' => 'required|string',
            'phone' => 'nullable|string|max:20',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'license_number' => 'nullable|string|max:100',
            'verification_status' => 'required|in:PENDING,VERIFIED,REJECTED',
            'is_active' => 'boolean',
            'is_force_closed' => 'boolean',
            'hours' => 'array',
            'hours.*.id' => 'nullable|uuid',
            'hours.*.day_of_week' => 'required|integer|between:0,6',
            'hours.*.open_time' => 'nullable|string',
            'hours.*.close_time' => 'nullable|string',
            'hours.*.is_closed' => 'boolean',
            'hours.*.is_24_hours' => 'boolean',
            'staffs' => 'array',
            'staffs.*.user_id' => 'required|exists:users,id',
            'staffs.*.role' => 'required|in:APOTEKER,STAFF',
        ];
    }
}
