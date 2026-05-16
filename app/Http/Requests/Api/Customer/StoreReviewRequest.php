<?php

namespace App\Http\Requests\Api\Customer;

use App\Http\Requests\Api\BaseApiRequest;

class StoreReviewRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === 'USER';
    }

    public function rules(): array
    {
        return [
            'medicine_id' => 'required|exists:medicines,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ];
    }
}
