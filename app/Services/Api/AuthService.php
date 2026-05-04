<?php

namespace App\Services\Api;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AuthService
{
    /**
     * Handle user registration within a transaction.
     */
    public function register(array $data)
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'username' => $data['username'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'password_hash' => Hash::make($data['password_hash']),
                'role' => 'USER',
                'is_active' => true,
            ]);

            $token = $user->createToken($data['device_name'] ?? 'mobile-app')->plainTextToken;

            return [
                'user' => $user,
                'token' => $token
            ];
        });
    }

    /**
     * Handle user login.
     */
    public function login(string $email, string $password, string $deviceName = 'mobile-app')
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
            'token' => $token
        ];
    }
}
