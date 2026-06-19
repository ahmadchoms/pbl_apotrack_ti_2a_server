<?php

namespace App\Services\Api;

use App\Models\User;
use App\Mail\OtpVerificationMail;
use App\Mail\TemporaryPasswordMail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthService
{
    /**
     * TAHAP 1: Request OTP & Simpan Data Sementara di Cache
     */
    public function requestRegistrationOtp(array $data): void
    {
        $otp = rand(100000, 999999);
        $email = $data['email'];

        $userData = [
            'username' => $data['username'],
            'email' => $email,
            'phone' => $data['phone'],
            'password' => $data['password'],
            'otp' => (string) $otp,
        ];


        Log::info("OTP untuk $email adalah: $otp");

        Mail::to($email)->send(new OtpVerificationMail($otp));
    }

    /**
     * TAHAP 2: Verifikasi OTP & Create User (Final - ACID Protected & Pessimistic Locking)
     */
    public function verifyRegistrationOtp(string $email, string $otp): array
    {
        $cacheKey = 'registration_' . $email;
        $cachedData = Cache::get($cacheKey);

        if (!$cachedData) {
            throw ValidationException::withMessages([
                'otp' => ['OTP kadaluarsa atau data tidak ditemukan.'],
            ]);
        }

        if ((string) $cachedData['otp'] !== (string) $otp) {
            throw ValidationException::withMessages([
                'otp' => ['Kode OTP salah.'],
            ]);
        }

        return DB::transaction(function () use ($cachedData, $cacheKey) {
            if (User::where('email', $cachedData['email'])->lockForUpdate()->exists()) {
                throw ValidationException::withMessages([
                    'email' => ['Email ini sudah terdaftar.'],
                ]);
            }

            $user = User::create([
                'username' => $cachedData['username'],
                'email' => $cachedData['email'],
                'phone' => $cachedData['phone'],
                'password_hash' => Hash::make($cachedData['password']),
                'role' => 'USER',
                'is_active' => true,
            ]);

            Cache::forget($cacheKey);
            $token = $user->createToken('mobile_app')->plainTextToken;

            return [
                'user' => $user,
                'token' => $token,
            ];
        });
    }

    /**
     * Handle user login.
     */
    public function login(string $email, string $password, string $deviceName = 'mobile-app'): array
    {
        $user = User::select(['id', 'username', 'email', 'password_hash', 'role', 'is_active', 'avatar_url'])
            ->where('email', $email)
            ->first();

        if (!$user || !Hash::check($password, $user->password_hash)) {
            throw ValidationException::withMessages([
                'email' => ['Kredensial yang Anda berikan salah.'],
            ]);
        }

        if (!$user->is_active) {
            throw new \Exception('Akun Anda telah dinonaktifkan.', 403);
        }

        $token = $user->createToken($deviceName)->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    /**
     * Handle user logout.
     */
    public function logout(User $user): void
    {
        $user->currentAccessToken()->delete();
    }

    /**
     * LUPA PASSWORD: Kirim Password Sementara (ACID Protected & Pessimistic Locking)
     */
    public function forgotPassword(string $email): void
    {
        DB::transaction(function () use ($email) {
            $user = User::where('email', $email)->lockForUpdate()->first();

            if (!$user) {
                return;
            }

            Log::info("Permintaan Lupa Password untuk: " . $user->email);
            $tempPassword = Str::random(8);

            $user->update(['password_hash' => Hash::make($tempPassword)]);

            Log::info("Password sementara untuk " . $user->email . " adalah: " . $tempPassword);

            Mail::to($user->email)->send(new TemporaryPasswordMail($tempPassword));
        });
    }

    /**
     * Get authenticated user profile with relations.
     */
    public function getProfile(User $user): User
    {
        return $user->load(['pharmacyStaff.pharmacy']);
    }

    /**
     * Update user profile (ACID Protected & Pessimistic Locking).
     */
    public function updateProfile(User $user, array $data): User
    {
        return DB::transaction(function () use ($user, $data) {
            $u = User::where('id', $user->id)->lockForUpdate()->firstOrFail();

            $u->update([
                'username' => $data['username'],
                'email'    => $data['email'],
                'phone'    => $data['phone'] ?? $u->phone,
            ]);

            return $u->fresh()->load(['pharmacyStaff.pharmacy']);
        });
    }

    /**
     * Change user password (ACID Protected & Pessimistic Locking).
     */
    public function changePassword(User $user, string $currentPassword, string $newPassword): void
    {
        DB::transaction(function () use ($user, $currentPassword, $newPassword) {
            $u = User::where('id', $user->id)->lockForUpdate()->firstOrFail();

            if (!Hash::check($currentPassword, $u->password_hash)) {
                throw ValidationException::withMessages([
                    'current_password' => ['Password lama tidak sesuai.'],
                ]);
            }

            $u->update(['password_hash' => Hash::make($newPassword)]);
        });
    }
}
