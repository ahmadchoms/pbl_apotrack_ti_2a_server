<?php

namespace App\Services\Pharmacy;

use App\Models\Pharmacy;
use App\Models\User;
use App\Models\AuditLog;
use App\Services\Core\AccountService;
use Illuminate\Support\Facades\DB;

class ProfileService
{
    public function __construct(
        protected AccountService $accountService
    ) {}

    public function updatePharmacy(Pharmacy $pharmacy, array $data)
    {
        return DB::transaction(function () use ($pharmacy, $data) {
            $pharmacy->update($data);

            AuditLog::create([
                'user_id' => auth()->id(),
                'action' => 'UPDATE_PHARMACY_PROFILE',
                'description' => "Memperbarui profil apotek: {$pharmacy->name}",
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'status' => 'SUCCESS',
                'created_at' => now(),
            ]);

            return $pharmacy;
        });
    }

    public function updatePassword(User $user, string $newPassword)
    {
        $this->accountService->updatePassword($user, $newPassword);
    }

    public function updateOperatingHours(array $hours)
    {
        $pharmacy = auth()->user()->pharmacyStaff->pharmacy;
        
        return DB::transaction(function () use ($pharmacy, $hours) {
            foreach ($hours as $hour) {
                $pharmacy->hours()->updateOrCreate(
                    ['day_of_week' => $hour['day_of_week']],
                    [
                        'open_time' => $hour['is_closed'] || $hour['is_24_hours'] ? null : $hour['open_time'],
                        'close_time' => $hour['is_closed'] || $hour['is_24_hours'] ? null : $hour['close_time'],
                        'is_closed' => $hour['is_closed'],
                        'is_24_hours' => $hour['is_24_hours']
                    ]
                );
            }

            AuditLog::create([
                'user_id' => auth()->id(),
                'action' => 'UPDATE_OPERATING_HOURS',
                'description' => 'Memperbarui jam operasional apotek (Relational format)',
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'status' => 'SUCCESS',
                'created_at' => now(),
            ]);
            
            return $pharmacy;
        });
    }

    public function deleteAccount()
    {
        $this->accountService->deleteAccount(auth()->user());
    }

    public function getAuditLogs(string $userId)
    {
        $user = User::findOrFail($userId);
        return $this->accountService->getAuditHistory($user);
    }
}
