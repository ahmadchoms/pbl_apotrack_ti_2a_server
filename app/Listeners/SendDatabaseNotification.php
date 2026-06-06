<?php

namespace App\Listeners;

use App\Models\Notification;
use App\Events\PharmacyVerificationChanged;
use App\Events\UserSuspensionChanged;
use App\Models\PharmacyStaff;
use App\Events\PharmacyThresholdBreached;
use App\Models\User;

class SendDatabaseNotification
{
    public function handlePharmacyVerification(PharmacyVerificationChanged $event)
    {
        $pharmacy = $event->pharmacy;
        $status = $event->status;

        $isApproved = ($status === 'APPROVED');

        $pharmacistStaff = PharmacyStaff::where('pharmacy_id', $pharmacy->id)
            ->where('role', 'APOTEKER')
            ->first();

        $targetUserId = $pharmacistStaff ? $pharmacistStaff->user_id : null;

        if (!$targetUserId) {
            $anyStaff = PharmacyStaff::where('pharmacy_id', $pharmacy->id)->first();
            $targetUserId = $anyStaff ? $anyStaff->user_id : null;
        }

        if (!$targetUserId) {
            \Illuminate\Support\Facades\Log::warning("Gagal mengirim notifikasi verifikasi apotek {$pharmacy->id} karena tidak ada staf terdaftar.");
            return;
        }

        Notification::create([
            'user_id'        => $targetUserId,
            'title'          => $isApproved ? 'Apotek Berhasil Diverifikasi' : 'Verifikasi Apotek Ditolak',
            'message'        => $isApproved
                ? "Selamat! Berkas legalitas gerai apotek '{$pharmacy->name}' telah disetujui oleh Administrator pusat."
                : "Berkas legalitas untuk apotek '{$pharmacy->name}' ditolak karena data tidak sesuai. Silakan unggah kembali dokumen yang valid.",
            'type'           => 'SYSTEM_ALERT',
            'reference_type' => 'PHARMACY',
            'reference_id'   => $pharmacy->id,
            'is_read'        => false,
        ]);
    }

    public function handleUserSuspension(UserSuspensionChanged $event)
    {
        $user = $event->user;
        $isActive = $event->isActive;

        Notification::create([
            'user_id'        => $user->id,
            'title'          => $isActive ? 'Akun Anda Aktif Kembali' : 'Akun Anda Ditangguhkan (Suspend)',
            'message'        => $isActive
                ? "Halo {$user->name}, akun Anda telah diaktifkan kembali oleh Administrator. Anda dapat menggunakan layanan ApoTrack seperti biasa."
                : "Akses akun Anda telah dinonaktifkan sementara oleh Administrator karena terindikasi melanggar aturan kebijakan komunitas.",
            'type'           => 'SECURITY_ALERT',
            'reference_type' => 'USER',
            'reference_id'   => $user->id,
            'is_read'        => false,
        ]);
    }

    public function handleThresholdBreach(PharmacyThresholdBreached $event)
    {
        $admin = User::where('role', 'ADMIN')->first();

        if (!$admin) {
            \Illuminate\Support\Facades\Log::warning("Gagal mengirim notifikasi threshold breach karena tidak ada user dengan role ADMIN.");
            return;
        }

        Notification::create([
            'user_id'        => $admin->id,
            'title'          => 'Peringatan Moderasi Apotek',
            'message'        => "Apotek '{$event->pharmacy->name}' telah menerima {$event->badReviewsCount} review buruk dalam 7 hari terakhir. Mohon segera lakukan investigasi pada kolom komentar.",
            'type'           => 'MODERATION_ALERT',
            'reference_type' => 'PHARMACY',
            'reference_id'   => $event->pharmacy->id,
            'is_read'        => false,
        ]);
    }
}
