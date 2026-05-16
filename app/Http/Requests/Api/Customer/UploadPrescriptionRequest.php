<?php

namespace App\Http\Requests\Api\Customer;

use App\Http\Requests\Api\BaseApiRequest;

class UploadPrescriptionRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === 'USER';
    }

    public function rules(): array
    {
        return [
            'prescription_image' => 'required|image|max:5120',
        ];
    }
}
