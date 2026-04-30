<?php

namespace App\Services\Admin;

use App\Models\AuditLog;
use App\Models\User;

class ProfileService
{
    public function getProfileData()
    {
        $user = auth()->user();
        
        return [
            'id' => $user->id,
            'username' => $user->username,
            'email' => $user->email,
            'phone' => $user->phone,
            'role' => $user->role,
            'avatar_url' => $user->avatar_url,
            'is_active' => $user->is_active,
            'created_at' => $user->created_at->format('d M Y'),
            'addresses' => []
        ];
    }

    public function getRecentLogs(int $limit = 4)
    {
        return AuditLog::where('user_id', auth()->id())
            ->latest()
            ->take($limit)
            ->get();
    }

    public function getAuditHistory(array $filters)
    {
        return AuditLog::where('user_id', auth()->id())
            ->select('id', 'action', 'description', 'status', 'created_at', 'metadata')
            ->search($filters['search'] ?? null)
            ->filterStatus($filters['status'] ?? null)
            ->filterAction($filters['action_type'] ?? null)
            ->filterDate($filters['date_from'] ?? null, $filters['date_to'] ?? null)
            ->latest()
            ->paginate(10)
            ->withQueryString();
    }

    public function getActionTypes()
    {
        return AuditLog::where('user_id', auth()->id())
            ->distinct()
            ->pluck('action');
    }

    public function updateProfile(array $data)
    {
        $user = auth()->user();
        $user->update([
            'username' => $data['username'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? $user->phone,
        ]);

        return $user;
    }

    public function updatePassword(string $newPassword)
    {
        $user = auth()->user();
        $user->update([
            'password_hash' => \Hash::make($newPassword)
        ]);
    }
}
