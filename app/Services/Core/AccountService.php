<?php

namespace App\Services\Core;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AccountService
{
    /**
     * Update user basic profile information.
     */
    public function updateProfile(User $user, array $data): User
    {
        $user->update([
            'username' => $data['username'] ?? $user->username,
            'email' => $data['email'] ?? $user->email,
            'phone' => $data['phone'] ?? $user->phone,
        ]);

        $this->logAction($user, 'UPDATE_PROFILE', "Memperbarui profil dasar");

        return $user;
    }

    /**
     * Update user password.
     */
    public function updatePassword(User $user, string $newPassword): void
    {
        $user->update([
            'password_hash' => Hash::make($newPassword)
        ]);

        $this->logAction($user, 'CHANGE_PASSWORD', "Mengubah password akun");
    }

    /**
     * Delete user account.
     */
    public function deleteAccount(User $user): void
    {
        $this->logAction($user, 'DELETE_ACCOUNT', "Menghapus akun secara permanen");
        $user->delete();
    }

    /**
     * Get paginated audit logs for a user with filters.
     */
    public function getAuditHistory(User $user, array $filters = [])
    {
        return AuditLog::where('user_id', $user->id)
            ->select('id', 'action', 'description', 'status', 'created_at', 'metadata')
            ->search($filters['search'] ?? null)
            ->filterStatus($filters['status'] ?? null)
            ->filterAction($filters['action_type'] ?? null)
            ->filterDate($filters['date_from'] ?? null, $filters['date_to'] ?? null)
            ->latest()
            ->paginate($filters['per_page'] ?? 10)
            ->withQueryString();
    }

    /**
     * Get distinct action types performed by the user for filtering.
     */
    public function getActionTypes(User $user)
    {
        return AuditLog::where('user_id', $user->id)
            ->distinct()
            ->pluck('action');
    }

    /**
     * Internal helper to create audit logs.
     */
    protected function logAction(User $user, string $action, string $description): void
    {
        AuditLog::create([
            'user_id' => $user->id,
            'action' => $action,
            'description' => $description,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'status' => 'SUCCESS',
            'created_at' => now(),
        ]);
    }
}
