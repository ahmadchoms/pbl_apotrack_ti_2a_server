<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Api\BaseApiController;
use App\Models\DeviceToken;
use Illuminate\Http\Request;

class DeviceTokenController extends BaseApiController
{
    public function store(Request $request)
    {
        $request->validate([
            'fcm_token' => 'required|string',
            'device_type' => 'nullable|string|max:20',
        ]);

        $user = $request->user();

        // Hapus token yang sama dari user lain agar tidak terjadi kebocoran notifikasi
        DeviceToken::where('fcm_token', $request->fcm_token)
            ->where('user_id', '!=', $user->id)
            ->delete();

        $deviceToken = DeviceToken::updateOrCreate(
            [
                'user_id' => $user->id,
                'fcm_token' => $request->fcm_token,
            ],
            [
                'device_type' => $request->device_type ?? 'android',
            ]
        );

        return $this->successResponse($deviceToken, 'Token perangkat berhasil didaftarkan.', 200);
    }
}
