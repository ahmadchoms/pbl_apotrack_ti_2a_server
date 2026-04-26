<?php

namespace App\Services\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
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

        // Logic for sending reset link would go here (e.g., Mail::to($user)->send(...))
        // For now, we simulate success
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
        return \Illuminate\Support\Facades\DB::transaction(function () use ($data) {
            // 1. Create User
            $user = User::create([
                'username' => $data['username'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'password_hash' => Hash::make($data['password']),
                'role' => 'PHARMACY_STAFF', // Default for pharmacy register
                'is_active' => true,
            ]);

            // 2. Create Pharmacy
            $pharmacy = \App\Models\Pharmacy::create([
                'name' => $data['pharmacy_name'],
                'address' => $data['pharmacy_address'],
                'phone' => $data['pharmacy_phone'] ?? null,
                'latitude' => $data['pharmacy_latitude'],
                'longitude' => $data['pharmacy_longitude'],
                'license_number' => $data['license_number'],
                'verification_status' => 'PENDING',
                'is_active' => true,
            ]);

            // 3. Link User to Pharmacy as Apoteker (Owner/Admin)
            \App\Models\PharmacyStaff::create([
                'pharmacy_id' => $pharmacy->id,
                'user_id' => $user->id,
                'role' => 'APOTEKER',
                'is_active' => true,
            ]);

            return [
                'user' => $user,
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
