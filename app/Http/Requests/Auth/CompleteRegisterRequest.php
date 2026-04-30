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
            'pharmacy_phone' => 'required|string|max:20',
            'pharmacy_latitude' => 'required|numeric|between:-90,90',
            'pharmacy_longitude' => 'required|numeric|between:-180,180',

            // Legality Data
            'sia_number' => 'required|string|max:100',
            'sipa_number' => 'required|string|max:100',
            'stra_number' => 'required|string|max:100',
            'apoteker_nik' => 'required|string|size:16',
            'sia_document' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'sia_document.required' => 'Surat Izin Apotek (SIA) wajib diunggah.',
            'sia_document.mimes'    => 'Dokumen SIA harus berupa PDF, JPG, atau PNG.',
            'sia_document.max'      => 'Ukuran dokumen SIA maksimal 2MB.',
            'apoteker_nik.size'     => 'NIK KTP Apoteker harus 16 digit.',
        ];
    }
}
