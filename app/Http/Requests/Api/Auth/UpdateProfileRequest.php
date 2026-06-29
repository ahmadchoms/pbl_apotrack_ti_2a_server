<?php

namespace App\Http\Requests\Api\Auth;

use App\Http\Requests\Api\BaseApiRequest;

class UpdateProfileRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'username' => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email,' . $this->user()->id,
            'phone'    => 'nullable|string|max:20',
            'image'    => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ];
    }
}
