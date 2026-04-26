<?php

namespace App\Services\Admin;

use App\Models\AuditLog;
use App\Models\User;

class ProfileService
{
    protected string $adminId = '019db9a6-8991-7103-b685-bf0ed93fe9fb';

    public function getProfileData()
    {
        // In a real scenario, this would be auth()->user()
        // For now, using the hardcoded logic provided
        return [
            'id' => $this->adminId,
            'username' => 'Super Admin',
            'email' => 'admin@apotek.id',
            'phone' => '081111111111',
            'role' => 'SUPER_ADMIN',
            'avatar_url' => 'https://rccoezzqqntpdarqqkht.supabase.co/storage/v1/object/public/apotrack-public/avatar/avatar.jpg',
            'is_active' => true,
            'created_at' => '25 Apr 2026',
            'addresses' => []
        ];
    }

    public function getRecentLogs(int $limit = 4)
    {
        return AuditLog::where('user_id', $this->adminId)
            ->latest()
            ->take($limit)
            ->get();
    }

    public function getAuditHistory(array $filters)
    {
        return AuditLog::where('user_id', $this->adminId)
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
        return AuditLog::where('user_id', $this->adminId)
            ->distinct()
            ->pluck('action');
    }
}
