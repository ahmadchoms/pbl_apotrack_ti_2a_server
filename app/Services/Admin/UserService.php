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
}
