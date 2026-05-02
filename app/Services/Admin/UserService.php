<?php

namespace App\Services\Admin;

use App\Models\User;

class UserService
{
    public function list(array $filters)
    {
        return User::query()
            ->with(['pharmacyStaff.pharmacy'])
            ->search($filters['search'] ?? null)
            ->filterRole($filters['role'] ?? null)
            ->filterStatus($filters['status'] ?? null)
            ->latest()
            ->paginate(10);
    }

    public function findById(string $id)
    {
        return User::with(['pharmacyStaff.pharmacy'])->findOrFail($id);
    }

    public function store(array $data)
    {
        return \DB::transaction(function () use ($data) {
            $user = User::create([
                'username' => $data['username'],
                'email' => $data['email'],
                'password_hash' => \Hash::make($data['password']),
                'role' => $data['role'],
                'phone' => $data['phone'] ?? null,
                'avatar_url' => $data['avatar_url'] ?? null,
                'is_active' => $data['is_active'] ?? true,
            ]);

            return $user;
        });
    }

    public function update(User $user, array $data)
    {
        return \DB::transaction(function () use ($user, $data) {
            $updateData = [
                'username' => $data['username'],
                'email' => $data['email'],
                'role' => $data['role'],
                'phone' => $data['phone'] ?? $user->phone,
                'avatar_url' => $data['avatar_url'] ?? $user->avatar_url,
                'is_active' => $data['is_active'] ?? $user->is_active,
            ];

            if (!empty($data['password'])) {
                $updateData['password_hash'] = \Hash::make($data['password']);
            }

            $user->update($updateData);

            return $user;
        });
    }

    public function toggleActive(User $user)
    {
        $user->update(['is_active' => !$user->is_active]);
        return $user;
    }

    public function resetPassword(User $user)
    {
        $password = 'Apotrack2026!';
        $user->update(['password_hash' => \Hash::make($password)]);
        return $password;
    }

    public function delete(User $user)
    {
        return $user->delete();
    }
}
