<?php

namespace App\Listeners;

use App\Events\StaffRemoved;
use App\Models\Notification;
use Illuminate\Support\Facades\Log;

class SendStaffRemovedNotificationListener
{
    /**
     * Handle the event.
     */
    public function handle(StaffRemoved $event): void
    {
        $staff = $event->staff;

        if ($staff->role === 'STAFF') {
            Log::info("Mengirim notifikasi pemberhentian staff ke User ID: {$staff->user_id}");

            Notification::create([
                'user_id'        => $staff->user_id,
                'title'          => 'Pemberhentian Staff',
                'message'        => "Anda telah diberhentikan sebagai staff di apotek {$staff->pharmacy?->name}.",
                'type'           => 'STAFF_REMOVED',
                'reference_type' => 'PHARMACY',
                'reference_id'   => $staff->pharmacy_id,
                'is_read'        => false,
            ]);
        }
    }
}
