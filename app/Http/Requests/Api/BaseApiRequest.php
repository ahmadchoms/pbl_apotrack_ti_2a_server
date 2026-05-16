<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

abstract class BaseApiRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    abstract public function authorize(): bool;

    /**
     * Get the validation rules that apply to the request.
     */
    abstract public function rules(): array;

    /**
     * Handle a failed validation attempt.
     */
    protected function failedValidation(Validator $validator)
    {
        $errors = $validator->errors();
        $firstMessage = $errors->first();

        throw new HttpResponseException(response()->json([
            'status' => 'error',
            'success' => false,
            'message' => $firstMessage,
            'data' => null,
            'errors' => $errors->toArray(),
        ], 422));
    }
}
