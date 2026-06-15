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
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use OpenApi\Annotations as OA;
use App\Helpers\AuditHelper;

class AuthController extends BaseApiController
{
    public function __construct(
        protected AuthService $authService
    ) {}

    /**
     * @OA\Post(
     *     path="/api/auth/register/request-otp",
     *     summary="Meminta kode OTP untuk pendaftaran akun baru",
     *     description="Mengirimkan kode OTP 6 digit ke alamat email yang diberikan untuk proses verifikasi pendaftaran. Endpoint ini dibatasi (rate limited).",
     *     operationId="requestRegistrationOtp",
     *     tags={"Auth"},
     *
     *     @OA\RequestBody(
     *         required=true,
     *         description="Data email calon pengguna",
     *         @OA\JsonContent(
     *             required={"email"},
     *             @OA\Property(property="email", type="string", format="email", example="calon_pengguna@example.com")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Kode OTP berhasil dikirim",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Kode OTP berhasil dikirim ke email calon_pengguna@example.com (Cek log server jika email tidak masuk)"),
     *             @OA\Property(property="data", nullable=true)
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validasi gagal (email tidak valid atau sudah terdaftar)",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="The email has already been taken."),
     *             @OA\Property(
     *                 property="errors",
     *                 type="object",
     *                 @OA\Property(property="email", type="array", @OA\Items(type="string", example="The email has already been taken."))
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Kesalahan server saat mengirim email OTP",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Gagal mengirim OTP. Pastikan konfigurasi SMTP benar.")
     *         )
     *     )
     * )
     */
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

    /**
     * @OA\Post(
     *     path="/api/auth/register/verify-otp",
     *     summary="Verifikasi OTP dan buat akun baru",
     *     description="Memverifikasi kode OTP 6 digit yang telah dikirim ke email. Jika valid, akun pengguna akan dibuat dan token Sanctum akan dikembalikan untuk auto-login.",
     *     operationId="verifyRegistrationOtp",
     *     tags={"Auth"},
     *
     *     @OA\RequestBody(
     *         required=true,
     *         description="Data verifikasi pendaftaran",
     *         @OA\JsonContent(
     *             required={"email", "otp", "username", "password", "password_confirmation"},
     *             @OA\Property(property="email", type="string", format="email", example="calon_pengguna@example.com"),
     *             @OA\Property(property="otp", type="string", example="123456"),
     *             @OA\Property(property="username", type="string", example="johndoe"),
     *             @OA\Property(property="password", type="string", format="password", example="Rahasia123!"),
     *             @OA\Property(property="password_confirmation", type="string", format="password", example="Rahasia123!")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=201,
     *         description="Akun berhasil dibuat",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Registrasi berhasil!"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(
     *                     property="user",
     *                     type="object",
     *                     @OA\Property(property="id", type="string", format="uuid", example="01932c91-5f00-7341-91a3-b9e7f02c8d1a"),
     *                     @OA\Property(property="username", type="string", example="johndoe"),
     *                     @OA\Property(property="email", type="string", example="calon_pengguna@example.com"),
     *                     @OA\Property(property="role", type="string", example="USER"),
     *                     @OA\Property(property="avatar_url", type="string", nullable=true)
     *                 ),
     *                 @OA\Property(property="token", type="string", example="1|laravel_sanctum_token_string_here")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="OTP tidak valid atau kadaluarsa",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Kode OTP tidak valid atau sudah kedaluwarsa.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validasi gagal",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="The otp field is required.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Kesalahan server",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Gagal membuat akun.")
     *         )
     *     )
     * )
     */
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

    /**
     * @OA\Post(
     *     path="/api/auth/forgot-password",
     *     summary="Permintaan reset password",
     *     description="Jika email ditemukan di sistem, password sementara atau instruksi reset akan dikirim ke email tersebut.",
     *     operationId="forgotPassword",
     *     tags={"Auth"},
     *
     *     @OA\RequestBody(
     *         required=true,
     *         description="Alamat email akun yang lupa password",
     *         @OA\JsonContent(
     *             required={"email"},
     *             @OA\Property(property="email", type="string", format="email", example="pengguna@example.com")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Permintaan reset berhasil diproses",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Jika email terdaftar, password sementara telah dikirim."),
     *             @OA\Property(property="data", nullable=true)
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validasi gagal",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="The email field is required.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Kesalahan server",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Gagal memproses permintaan reset password.")
     *         )
     *     )
     * )
     */
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

    /**
     * @OA\Post(
     *     path="/api/auth/login",
     *     summary="Login pengguna dan dapatkan token",
     *     description="Mengautentikasi pengguna menggunakan email dan password. Mengembalikan data profil beserta token Sanctum.",
     *     operationId="login",
     *     tags={"Auth"},
     *
     *     @OA\RequestBody(
     *         required=true,
     *         description="Kredensial login",
     *         @OA\JsonContent(
     *             required={"email", "password"},
     *             @OA\Property(property="email", type="string", format="email", example="pengguna@example.com"),
     *             @OA\Property(property="password", type="string", format="password", example="Rahasia123!"),
     *             @OA\Property(property="device_name", type="string", example="mobile-app")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Login berhasil",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Login berhasil"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(
     *                     property="user",
     *                     type="object",
     *                     @OA\Property(property="id", type="string", format="uuid", example="01932c91-5f00-7341-91a3-b9e7f02c8d1a"),
     *                     @OA\Property(property="username", type="string", example="johndoe"),
     *                     @OA\Property(property="email", type="string", example="pengguna@example.com"),
     *                     @OA\Property(property="role", type="string", example="USER"),
     *                     @OA\Property(property="avatar_url", type="string", nullable=true)
     *                 ),
     *                 @OA\Property(property="token", type="string", example="1|laravel_sanctum_token_string_here")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Kredensial salah (Unauthorized)",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Email atau password salah.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validasi gagal",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="The email field is required.")
     *         )
     *     )
     * )
     */
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

    /**
     * @OA\Post(
     *     path="/api/auth/logout",
     *     summary="Logout pengguna",
     *     description="Membatalkan (revoke) token Sanctum yang sedang digunakan saat ini.",
     *     operationId="logout",
     *     tags={"Auth"},
     *     security={{"sanctum": {}}},
     *
     *     @OA\Response(
     *         response=200,
     *         description="Logout berhasil",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Logged out successfully"),
     *             @OA\Property(property="data", nullable=true)
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Tidak terautentikasi",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Unauthenticated.")
     *         )
     *     )
     * )
     */
    public function logout(Request $request)
    {
        $this->authService->logout($request->user());

        return $this->successResponse(null, 'Logged out successfully');
    }

    /**
     * @OA\Get(
     *     path="/api/me",
     *     summary="Ambil data profil pengguna saat ini",
     *     description="Mengembalikan informasi lengkap profil pengguna yang sedang login.",
     *     operationId="me",
     *     tags={"Auth"},
     *     security={{"sanctum": {}}},
     *
     *     @OA\Response(
     *         response=200,
     *         description="Profil berhasil diambil",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Profil berhasil diambil"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="string", format="uuid", example="01932c91-5f00-7341-91a3-b9e7f02c8d1a"),
     *                 @OA\Property(property="username", type="string", example="johndoe"),
     *                 @OA\Property(property="email", type="string", example="pengguna@example.com"),
     *                 @OA\Property(property="role", type="string", example="USER"),
     *                 @OA\Property(property="avatar_url", type="string", nullable=true)
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Tidak terautentikasi",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Unauthenticated.")
     *         )
     *     )
     * )
     */
    public function me(Request $request)
    {
        $user = $this->authService->getProfile($request->user());

        return $this->successResponse(new UserResource($user), 'Profil berhasil diambil');
    }

    /**
     * @OA\Put(
     *     path="/api/profile",
     *     summary="Perbarui profil pengguna",
     *     description="Memperbarui informasi profil seperti nama pengguna atau avatar.",
     *     operationId="updateProfile",
     *     tags={"Auth"},
     *     security={{"sanctum": {}}},
     *
     *     @OA\RequestBody(
     *         required=true,
     *         description="Data profil yang akan diperbarui",
     *         @OA\JsonContent(
     *             @OA\Property(property="username", type="string", example="johndoe_updated"),
     *             @OA\Property(property="avatar_url", type="string", nullable=true, example="https://example.com/avatar.jpg")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Profil berhasil diperbarui",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Profil berhasil diperbarui"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="string", format="uuid", example="01932c91-5f00-7341-91a3-b9e7f02c8d1a"),
     *                 @OA\Property(property="username", type="string", example="johndoe_updated"),
     *                 @OA\Property(property="email", type="string", example="pengguna@example.com"),
     *                 @OA\Property(property="role", type="string", example="USER"),
     *                 @OA\Property(property="avatar_url", type="string", example="https://example.com/avatar.jpg")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Tidak terautentikasi",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Unauthenticated.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validasi gagal",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="The username has already been taken.")
     *         )
     *     )
     * )
     */
    public function updateProfile(UpdateProfileRequest $request)
    {
        $updatedUser = $this->authService->updateProfile($request->user(), $request->validated());

        if (in_array($request->user()->role, ['STAFF', 'APOTEKER'])) {
            AuditHelper::log(
                'UPDATE_PROFILE',
                'Memperbarui informasi profil staf.',
                ['user_id' => $request->user()->id]
            );
        }

        return $this->successResponse(new UserResource($updatedUser), 'Profil berhasil diperbarui');
    }

    /**
     * @OA\Put(
     *     path="/api/password",
     *     summary="Ubah password pengguna",
     *     description="Memperbarui password pengguna dengan memverifikasi password lama terlebih dahulu.",
     *     operationId="changePassword",
     *     tags={"Auth"},
     *     security={{"sanctum": {}}},
     *
     *     @OA\RequestBody(
     *         required=true,
     *         description="Data perubahan password",
     *         @OA\JsonContent(
     *             required={"current_password", "new_password", "new_password_confirmation"},
     *             @OA\Property(property="current_password", type="string", format="password", example="PasswordLama123!"),
     *             @OA\Property(property="new_password", type="string", format="password", example="PasswordBaru123!"),
     *             @OA\Property(property="new_password_confirmation", type="string", format="password", example="PasswordBaru123!")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Password berhasil diperbarui",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="success"),
     *             @OA\Property(property="message", type="string", example="Password berhasil diperbarui"),
     *             @OA\Property(property="data", nullable=true)
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Tidak terautentikasi",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Unauthenticated.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validasi gagal atau password lama salah",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="error"),
     *             @OA\Property(property="message", type="string", example="Password lama tidak sesuai.")
     *         )
     *     )
     * )
     */
    public function changePassword(ChangePasswordRequest $request)
    {
        try {
            $this->authService->changePassword(
                $request->user(),
                $request->current_password,
                $request->new_password
            );

            if (in_array($request->user()->role, ['STAFF', 'APOTEKER'])) {
                AuditHelper::log(
                    'CHANGE_PASSWORD',
                    'Melakukan perubahan kata sandi akun.',
                    ['user_id' => $request->user()->id]
                );
            }

            return $this->successResponse(null, 'Password berhasil diperbarui');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->errorResponse(collect($e->errors())->first()[0], 422, $e->errors());
        }
    }
    public function deleteAccount(Request $request)
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        $user = $request->user();

        if (!Hash::check($request->password, $user->password)) {
            return $this->errorResponse('Password tidak sesuai.', 422);
        }

        try {
            DB::transaction(function () use ($user) {
                // Revoke semua token
                $user->tokens()->delete();
                // Hapus user (cascade ke data terkait)
                $user->delete();
            });

            return $this->successResponse(null, 'Akun berhasil dihapus.');
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal menghapus akun: ' . $e->getMessage(), 500);
        }
    }
}
