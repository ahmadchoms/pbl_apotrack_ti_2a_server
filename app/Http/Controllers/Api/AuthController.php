<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseApiController;
use App\Http\Resources\Api\UserResource;
use App\Services\Api\AuthService;
use App\Http\Requests\Api\Auth\RequestRegistrationOtpRequest;
use App\Http\Requests\Api\Auth\VerifyRegistrationOtpRequest;
use App\Http\Requests\Api\Auth\ForgotPasswordRequest;
use App\Http\Requests\Api\Auth\LoginApiRequest;
use App\Http\Requests\Api\Auth\UpdateProfileRequest;
use App\Http\Requests\Api\Auth\ChangePasswordRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AuthController extends BaseApiController
{
    public function __construct(
        protected AuthService $authService
    ) {}

    public function requestRegistrationOtp(RequestRegistrationOtpRequest $request)
    {
        try {
            $this->authService->requestRegistrationOtp($request->validated());

            return $this->successResponse(null, 'Kode OTP berhasil dikirim ke email ' . $request->email . ' (Cek log server jika email tidak masuk)');
        } catch (\Exception $e) {
            Log::error('OTP Error: ' . $e->getMessage());
            return $this->errorResponse('Gagal mengirim OTP. Pastikan konfigurasi SMTP benar.', 500);
        }
    }

    public function verifyRegistrationOtp(VerifyRegistrationOtpRequest $request)
    {
        try {
            $result = $this->authService->verifyRegistrationOtp($request->email, $request->otp);

            return $this->successResponse([
                'user' => new UserResource($result['user']),
                'token' => $result['token'],
            ], 'Registrasi berhasil!', 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->errorResponse(collect($e->errors())->first()[0], 400, $e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal membuat akun.', 500);
        }
    }

    public function forgotPassword(ForgotPasswordRequest $request)
    {
        try {
            $this->authService->forgotPassword($request->email);

            return $this->successResponse(null, 'Jika email terdaftar, password sementara telah dikirim.');
        } catch (\Exception $e) {
            Log::error('Forgot Password Error: ' . $e->getMessage());
            return $this->errorResponse('Gagal memproses permintaan reset password.', 500);
        }
    }

    public function login(LoginApiRequest $request)
    {
        try {
            $result = $this->authService->login(
                $request->email,
                $request->password,
                $request->device_name ?? 'mobile-app'
            );

            return $this->successResponse([
                'user' => new UserResource($result['user']),
                'token' => $result['token'],
            ], 'Login berhasil');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 401);
        }
    }

    public function logout(Request $request)
    {
        $this->authService->logout($request->user());

        return $this->successResponse(null, 'Logged out successfully');
    }

    public function me(Request $request)
    {
        $user = $this->authService->getProfile($request->user());

        return $this->successResponse(new UserResource($user), 'Profil berhasil diambil');
    }

    public function updateProfile(UpdateProfileRequest $request)
    {
        $updatedUser = $this->authService->updateProfile($request->user(), $request->validated());

        return $this->successResponse(new UserResource($updatedUser), 'Profil berhasil diperbarui');
    }

    public function changePassword(ChangePasswordRequest $request)
    {
        try {
            $this->authService->changePassword(
                $request->user(),
                $request->current_password,
                $request->new_password
            );

            return $this->successResponse(null, 'Password berhasil diperbarui');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->errorResponse(collect($e->errors())->first()[0], 422, $e->errors());
        }
    }
}
