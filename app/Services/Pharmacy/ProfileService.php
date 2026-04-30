<?php

namespace App\Services\Pharmacy;

use App\Models\Pharmacy;
use App\Models\User;
use App\Models\AuditLog;
use Illuminate\Support\Facades\Hash;

class ProfileService
{
    public function updatePharmacy(Pharmacy $pharmacy, array $data)
    {
        $pharmacy->update($data);

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => 'UPDATE_PHARMACY_PROFILE',
            'description' => "Memperbarui profil apotek: {$pharmacy->name}",
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent()
        ]);

        return $pharmacy;
    }

    public function updatePassword(User $user, string $newPassword)
    {
        $user->update([
            'password_hash' => Hash::make($newPassword)
        ]);

        AuditLog::create([
            'user_id' => $user->id,
            'action' => 'CHANGE_PASSWORD',
            'description' => 'Mengubah password akun apotek',
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent()
        ]);
    }

    public function updateOperatingHours(array $hours)
    {
        $pharmacy = auth()->user()->pharmacyStaff->pharmacy;
        
        foreach ($hours as $hour) {
            $pharmacy->hours()->updateOrCreate(
                ['day_of_week' => $hour['day_of_week']],
                [
                    'open_time' => $hour['open_time'],
                    'close_time' => $hour['close_time'],
                    'is_closed' => $hour['is_closed'],
                    'is_24_hours' => $hour['is_24_hours']
                ]
            );
        }

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => 'UPDATE_OPERATING_HOURS',
            'description' => 'Memperbarui jam operasional apotek',
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent()
        ]);
    }

    public function deleteAccount()
    {
        $user = auth()->user();
        
        AuditLog::create([
            'user_id' => $user->id,
            'action' => 'DELETE_ACCOUNT',
            'description' => 'Menghapus akun apotek secara permanen',
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent()
        ]);

        $user->delete();
    }

    public function getAuditLogs(string $userId)
    {
        return AuditLog::where('user_id', $userId)
            ->latest()
            ->paginate(10);
    }
}
