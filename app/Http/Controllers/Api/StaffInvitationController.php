<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use App\Models\Pharmacy;
use App\Models\PharmacyStaff;
use Illuminate\Support\Facades\DB;

class StaffInvitationController extends Controller
{
    public function join(Request $request)
    {
        $request->validate([
            'invitation_url' => 'required|string',
        ]);

        // 1. Parse URL yang discan
        $invitationUrl = $request->input('invitation_url');

        // Parse query string dari URL
        $parsedUrl = parse_url($invitationUrl);
        parse_str($parsedUrl['query'] ?? '', $queryParams);

        $pharmacyId = $queryParams['pharmacy_id'] ?? null;

        if (!$pharmacyId) {
            return response()->json([
                'message' => 'QR tidak valid. pharmacy_id tidak ditemukan.',
            ], 422);
        }

        // 2. Validasi signature Laravel
        if (!URL::hasValidSignature($request->merge(
            array_merge($queryParams, ['path' => $parsedUrl['path'] ?? ''])
        ))) {
            // Validasi manual karena request tidak sama dengan original
            // Kita validasi dengan cara rebuild request
        }

        // Cara validasi signed URL yang benar: cek langsung
        if (!$this->isValidSignedUrl($invitationUrl)) {
            return response()->json([
                'message' => 'Link undangan tidak valid atau sudah kadaluarsa.',
            ], 422);
        }

        // 3. Cek apotek ada
        $pharmacy = Pharmacy::find($pharmacyId);
        if (!$pharmacy) {
            return response()->json([
                'message' => 'Apotek tidak ditemukan.',
            ], 404);
        }

        $user = $request->user();

        // 4. Cek apakah user sudah jadi staff di apotek ini
        $alreadyStaff = PharmacyStaff::where('pharmacy_id', $pharmacyId)
            ->where('user_id', $user->id)
            ->whereNull('deleted_at')
            ->exists();

        if ($alreadyStaff) {
            return response()->json([
                'message' => 'Kamu sudah terdaftar sebagai staff di apotek ini.',
            ], 409);
        }

        // 5. Cek apakah user sudah jadi staff di apotek lain
        $isStaffElsewhere = PharmacyStaff::where('user_id', $user->id)
            ->whereNull('deleted_at')
            ->exists();

        if ($isStaffElsewhere) {
            return response()->json([
                'message' => 'Kamu sudah terdaftar sebagai staff di apotek lain.',
            ], 409);
        }

        // 6. Join sebagai staff
        DB::transaction(function () use ($pharmacyId, $user) {
            PharmacyStaff::create([
                'pharmacy_id' => $pharmacyId,
                'user_id'     => $user->id,
                'role'        => 'STAFF',
                'is_active'   => true,
            ]);

            // Update role user menjadi STAFF
            $user->update(['role' => 'STAFF']);
        });

        return response()->json([
            'message' => 'Berhasil bergabung sebagai staff apotek!',
            'pharmacy' => [
                'id'   => $pharmacy->id,
                'name' => $pharmacy->name,
            ],
        ], 200);
    }

    private function isValidSignedUrl(string $url): bool
    {
        try {
            $parsed = parse_url($url);
            parse_str($parsed['query'] ?? '', $params);

            // Cek expires
            if (isset($params['expires']) && now()->timestamp > (int) $params['expires']) {
                return false;
            }

            // Rebuild URL tanpa signature untuk validasi
            $signature = $params['signature'] ?? '';
            unset($params['signature']);

            $urlWithoutSignature = $parsed['scheme'] . '://' . $parsed['host']
                . ($parsed['path'] ?? '')
                . '?' . http_build_query($params);

            $expectedSignature = hash_hmac('sha256', $urlWithoutSignature, config('app.key'));

            return hash_equals($expectedSignature, $signature);
        } catch (\Throwable $e) {
            return false;
        }
    }
}