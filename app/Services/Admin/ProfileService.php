<?php

namespace App\Services\Admin;

use App\Services\Core\AccountService;

class ProfileService
{
    public function __construct(
        protected AccountService $accountService
    ) {}

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
        return $this->accountService->getAuditHistory(auth()->user(), ['per_page' => $limit]);
    }

    public function getAuditHistory(array $filters)
    {
        return $this->accountService->getAuditHistory(auth()->user(), $filters);
    }

    public function getActionTypes()
    {
        return $this->accountService->getActionTypes(auth()->user());
    }

    public function updateProfile(array $data)
    {
        return $this->accountService->updateProfile(auth()->user(), $data);
    }

    public function updatePassword(string $newPassword)
    {
        $this->accountService->updatePassword(auth()->user(), $newPassword);
    }
}
