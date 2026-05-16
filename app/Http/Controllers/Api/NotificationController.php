<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\Notification;
use Illuminate\Http\Request;
use Carbon\Carbon;

class NotificationController extends BaseApiController
{
    /**
     * Get user notifications.
     */
    public function index(Request $request)
    {
        $notifications = $request->user()->notifications()
            ->latest()
            ->paginate(20);

        return $this->successResponse($notifications, 'Daftar notifikasi berhasil diambil', 200, [
            'unread_count' => $request->user()->notifications()->where('is_read', false)->count(),
        ]);
    }

    /**
     * Mark a notification as read.
     */
    public function markAsRead($id, Request $request)
    {
        $notification = $request->user()->notifications()->findOrFail($id);
        
        $notification->update([
            'is_read' => true,
            'read_at' => Carbon::now(),
        ]);

        return $this->successResponse(null, 'Notifikasi ditandai sebagai dibaca');
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead(Request $request)
    {
        $request->user()->notifications()->where('is_read', false)->update([
            'is_read' => true,
            'read_at' => Carbon::now(),
        ]);

        return $this->successResponse(null, 'Semua notifikasi ditandai sebagai dibaca');
    }
}
