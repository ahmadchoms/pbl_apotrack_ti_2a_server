<?php

namespace App\Services\Auth;

use App\Models\Pharmacy;
use App\Models\PharmacyDocument;
use App\Models\PharmacyLegality;
use App\Models\PharmacyStaff;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function login(array $credentials)
    {
        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password_hash)) {
            throw ValidationException::withMessages([
                'email' => [trans('auth.failed')],
            ]);
        }

        if (!$user->is_active) {
            throw ValidationException::withMessages([
                'email' => ['Akun Anda tidak aktif. Silakan hubungi admin.'],
            ]);
        }

        Auth::login($user, $credentials['remember'] ?? false);

        return $user->load('pharmacyStaff');
    }

    public function forgotPassword(array $data)
    {
        $user = User::where('email', $data['email'])->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'email' => ['Email tidak terdaftar dalam sistem kami.'],
            ]);
        }



        return true;
    }

    public function register(array $data)
    {
        return User::create([
            'username' => $data['username'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'password_hash' => Hash::make($data['password']),
            'role' => $data['role'] ?? 'CUSTOMER',
            'is_active' => true,
        ]);
    }

    public function registerWithPharmacy(array $data)
    {
        return DB::transaction(function () use ($data) {
            // 1. Create User
            $user = User::create([
                'username'      => $data['username'],
                'email'         => $data['email'],
                'phone'         => $data['phone'] ?? null,
                'password_hash' => Hash::make($data['password']),
                'role'          => 'USER',
                'is_active'     => true,
            ]);

            // 2. Create Pharmacy
            $pharmacy = Pharmacy::create([
                'name'                => $data['pharmacy_name'],
                'address'             => $data['pharmacy_address'],
                'phone'               => $data['pharmacy_phone'],
                'latitude'            => $data['pharmacy_latitude'],
                'longitude'           => $data['pharmacy_longitude'],
                'verification_status' => 'PENDING',
                'is_active'          => false,
            ]);

            // 3. Link User to Pharmacy as APOTEKER
            PharmacyStaff::create([
                'pharmacy_id' => $pharmacy->id,
                'user_id'     => $user->id,
                'role'        => 'APOTEKER',
                'is_active'   => true,
            ]);

            // 4. Upload SIA Document
            $siaUrl = null;
            $disk = 'supabase_private';

            if (isset($data['sia_document']) && $data['sia_document'] instanceof \Illuminate\Http\UploadedFile) {
                $path = $data['sia_document']->store('documents/pharmacies/' . $pharmacy->id . '/legality', $disk);
                $siaUrl = Storage::disk($disk)->url($path);
            }

            // 5. Create Pharmacy Legality
            PharmacyLegality::create([
                'pharmacy_id'      => $pharmacy->id,
                'sia_number'       => $data['sia_number'],
                'sipa_number'      => $data['sipa_number'],
                'stra_number'      => $data['stra_number'],
                'apoteker_nik'     => $data['apoteker_nik'],
                'sia_document_url' => $siaUrl,
            ]);

            return [
                'user'     => $user,
                'pharmacy' => $pharmacy,
            ];
        });
    }

    public function logout()
    {
        Auth::logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();
    }
}
