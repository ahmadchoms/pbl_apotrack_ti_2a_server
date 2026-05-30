<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Carbon\Carbon;

class NotificationController extends Controller
{
    /**
     * Get authenticated user's notifications.
     */
    public function index(Request $request)
    {
        $notifications = $request->user()->notifications()
            ->latest()
            ->take(10)
            ->get();

        $unreadCount = $request->user()->notifications()
            ->where('is_read', false)
            ->count();

        return response()->json([
            'status' => 'SUCCESS',
            'data' => $notifications,
            'unread_count' => $unreadCount,
        ]);
    }

    /**
     * Mark a specific notification as read.
     */
    public function markAsRead($id, Request $request)
    {
        $notification = $request->user()->notifications()->findOrFail($id);

        $notification->update([
            'is_read' => true,
            'read_at' => Carbon::now(),
        ]);

        return response()->json([
            'status' => 'SUCCESS',
            'message' => 'Notifikasi berhasil ditandai sebagai dibaca',
        ]);
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

        return response()->json([
            'status' => 'SUCCESS',
            'message' => 'Semua notifikasi berhasil ditandai sebagai dibaca',
        ]);
    }
}
