<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\UserResource;
use App\Services\Api\AuthService;
use App\Mail\OtpVerificationMail;
use App\Mail\TemporaryPasswordMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function __construct(
        protected AuthService $authService
    ) {}

    /**
     * TAHAP 1: Request OTP & Simpan Data Sementara di Cache
     */
    public function requestRegistrationOtp(Request $request)
    {
        $request->validate([
            'username' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|max:20',
            'password' => 'required|string|min:8',
        ]);

        try {
            $otp = rand(100000, 999999);
            $email = $request->email;

            $userData = [
                'username' => $request->username,
                'email' => $email,
                'phone' => $request->phone,
                'password' => $request->password,
                'otp' => (string) $otp,
            ];

            Cache::put('registration_' . $email, $userData, 300);
            
            // Tambahkan log untuk memudahkan debugging tanpa email asli
            Log::info("OTP untuk $email adalah: $otp");

            Mail::to($email)->send(new OtpVerificationMail($otp));

            return response()->json([
                'status' => 'success',
                'message' => 'Kode OTP berhasil dikirim ke email ' . $email . ' (Cek log server jika email tidak masuk)',
            ]);
        } catch (\Exception $e) {
            Log::error('OTP Error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengirim OTP. Pastikan konfigurasi SMTP benar.',
            ], 500);
        }
    }

    /**
     * TAHAP 2: Verifikasi OTP & Create User (Final)
     */
    public function verifyRegistrationOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:6',
        ]);

        $cacheKey = 'registration_' . $request->email;
        $cachedData = Cache::get($cacheKey);

        if (!$cachedData) {
            return response()->json([
                'status' => 'error',
                'message' => 'OTP kadaluarsa atau data tidak ditemukan.',
            ], 400);
        }

        if ((string) $cachedData['otp'] !== (string) $request->otp) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kode OTP salah.',
            ], 400);
        }

        try {
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

            return response()->json([
                'status' => 'success',
                'message' => 'Registrasi berhasil!',
                'data' => [
                    'user' => new UserResource($user),
                    'token' => $token,
                ],
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal membuat akun.',
            ], 500);
        }
    }

    /**
     * LUPA PASSWORD: Kirim Password Sementara
     */
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            // Return success even if email not found to prevent email enumeration
            return response()->json([
                'status' => 'success',
                'message' => 'Jika email terdaftar, password sementara telah dikirim.',
            ]);
        }

        try {
            Log::info("Permintaan Lupa Password untuk: " . $user->email);
            $tempPassword = Str::random(8);
            
            // Simpan password baru
            $user->update(['password_hash' => Hash::make($tempPassword)]);
            
            // Log password sementara agar bisa dicek di storage/logs/laravel.log
            Log::info("Password sementara untuk " . $user->email . " adalah: " . $tempPassword);

            Mail::to($user->email)->send(new TemporaryPasswordMail($tempPassword));

            return response()->json([
                'status' => 'success',
                'message' => 'Jika email terdaftar, password sementara telah dikirim.',
            ]);
        } catch (\Exception $e) {
            Log::error('Forgot Password Error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memproses permintaan reset password.',
            ], 500);
        }
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        try {
            $result = $this->authService->login(
                $request->email,
                $request->password,
                $request->device_name ?? 'mobile-app'
            );

            return response()->json([
                'status' => 'success',
                'message' => 'Login berhasil',
                'data' => [
                    'user' => new UserResource($result['user']),
                    'token' => $result['token'],
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 401);
        }
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    /**
     * Get the authenticated User profile.
     */
    public function me(Request $request)
    {
        $user = $request->user()->load(['pharmacyStaff.pharmacy']);

        return response()->json([
            'status' => 'success',
            'data' => $user
        ]);
    }

    /**
     * Update authenticated user's profile.
     */
    public function updateProfile(Request $request)
    {
        $request->validate([
            'username' => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email,' . $request->user()->id,
            'phone'    => 'nullable|string|max:20',
        ]);

        $user = $request->user();
        $user->update([
            'username' => $request->username,
            'email'    => $request->email,
            'phone'    => $request->phone,
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Profil berhasil diperbarui',
            'data'    => $user->fresh()->load(['pharmacyStaff.pharmacy']),
        ]);
    }

    /**
     * Change authenticated user's password.
     */
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password'     => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!\Hash::check($request->current_password, $user->password_hash)) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Password lama tidak sesuai.',
            ], 422);
        }

        $user->update(['password_hash' => \Hash::make($request->new_password)]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Password berhasil diperbarui',
        ]);
    }
}
